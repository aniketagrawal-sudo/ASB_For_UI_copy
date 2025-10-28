import { notifyViaSnackBar } from '../../redux/store/conversationSlice';
import { CONVERSATION_ITEM_STATUS, SOCKET_EVENTS } from '../constants';
import { addToRunning, removeFromRunning, addToQueue } from '../../redux/store/queueSlice';
import { store } from '../../redux/store';

/**
 * Comprehensive status extraction function to check all possible status locations
 * in order of priority
 *
 * @param {Object} data - The message or data object containing status information
 * @returns {string|null} - The normalized status or null if no status found
 */
const extractStatus = (data) => {
  // STEP 1: Check metadata.agent_response.status (first priority)
  if (data?.metadata?.agent_response?.status) {
    const apiStatus = String(data.metadata.agent_response.status).toLowerCase();
    // If API explicitly says completed/done, trust that
    if (apiStatus === 'completed' || apiStatus === 'done' || apiStatus === 'complete') {
      return 'completed';
    }
    // Return the API status for other values
    return apiStatus;
  }

  // STEP 2: Check metadata.api_response_on_call.status (second priority)
  if (data?.metadata?.api_response_on_call?.status) {
    const onCallStatus = String(data.metadata.api_response_on_call.status).toLowerCase();
    // If API explicitly says completed/done, trust that
    if (onCallStatus === 'completed' || onCallStatus === 'done' || onCallStatus === 'complete') {
      return 'completed';
    }
    // Return the API status for other values
    return onCallStatus;
  }

  // STEP 3: Check metadata.status (third priority)
  if (data?.metadata?.status) {
    const metaStatus = String(data.metadata.status).toLowerCase();
    // If metadata explicitly says completed/done, trust that
    if (metaStatus === 'completed' || metaStatus === 'done' || metaStatus === 'complete') {
      return 'completed';
    }
    // Return the metadata status for other values
    return metaStatus;
  }

  // STEP 4: Check direct status property of the message (last priority)
  if (data?.status) {
    const directStatus = String(data.status).toLowerCase();
    // If explicitly says completed/done, trust that
    if (directStatus === 'completed' || directStatus === 'done' || directStatus === 'complete') {
      return 'completed';
    }
    // Return the direct status for other values
    return directStatus;
  }

  // If no status found, return null
  return null;
};

/**
 * Checks if a status indicates completion (including error states)
 *
 * @param {string} status - The status to check
 * @returns {boolean} - Whether the status indicates completion
 */
const isCompletedStatus = (status) => {
  if (!status) return false;
  const statusLower = status.toLowerCase();
  return ['complete', 'completed', 'done', 'error', 'failed', 'cancelled'].includes(statusLower);
};

/**
 * Socket event listener manager optimized for Azure environments
 * - Prevents duplicate listeners
 * - Handles Azure-specific disconnection scenarios
 * - Improved error handling and diagnostics
 * - Better status management for long-running tasks
 *
 * @version 1.5.0
 * Changes:
 * v1.1.0: Introduced to listen socket events
 * v1.2.0: Enhanced CONVERSATION_QUEUED handling to track messages in ThreadsDashboard
 * v1.3.0: Added Azure-specific optimizations for connection resilience
 * v1.4.0: Added comprehensive channel debugging for Redis communication
 * v1.5.0: Enhanced status detection with comprehensive status extraction
 */
export const setupSocketListeners = (socket, dispatch, disableLoading) => {

  // Clear existing listeners first to prevent duplicates
  socket.off(SOCKET_EVENTS.CONNECT);
  socket.off(SOCKET_EVENTS.DISCONNECT);
  socket.off(SOCKET_EVENTS.CONVERSATION_MESSAGE);
  socket.off(SOCKET_EVENTS.NOTIFICATION);
  socket.off(SOCKET_EVENTS.CONNECTION_ERROR);
  socket.off(SOCKET_EVENTS.CONVERSATION_QUEUED);
  socket.off(SOCKET_EVENTS.CONVERSATION_STATUS);
  socket.off(SOCKET_EVENTS.ERROR_NOTIFICATION);

  // Track reconnection attempts for exponential backoff
  let reconnectAttempts = 0;
  let reconnectTimer = null;

  // Track the last status update time to avoid duplicates
  const statusUpdateLog = new Map();

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    disableLoading();

    // Reset reconnection counters
    reconnectAttempts = 0;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    // Notify user of successful connection
    dispatch(
      notifyViaSnackBar({
        message: 'Real-time connection established',
        severity: 'success',
        open: true,
        autoHideDuration: 3000, // Auto-hide after 3 seconds
      }),
    );
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {

    // Only show notification for unexpected disconnects
    if (reason !== 'io client disconnect') {
      // For server disconnects, try to reconnect
      if (reason === 'io server disconnect') {

        // Azure-specific: use exponential backoff for reconnection
        const backoffTime = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 30000);
        reconnectAttempts++;

        // Wait with exponential backoff before reconnecting to avoid rapid reconnect loops
        reconnectTimer = setTimeout(() => {
          try {
            socket.connect();
          } catch (err) {
            console.error('Reconnection attempt failed:', err);
          }
        }, backoffTime);
      }

      // Check for Azure-specific disconnection reasons
      let diagnosticInfo = '';
      if (reason === 'transport close' || reason === 'ping timeout') {
        diagnosticInfo = ' (Azure load balancer timeout)';
      } else if (reason === 'transport error') {
        diagnosticInfo = ' (Network connectivity issue)';
      }

      dispatch(
        notifyViaSnackBar({
          message: `Connection interrupted${diagnosticInfo}. Attempting to reconnect...`,
          severity: 'warning',
          open: true,
        }),
      );
    }
  });

  socket.on(SOCKET_EVENTS.CONVERSATION_MESSAGE, (data) => {

    // Received LLM response for the user input
    dispatch({ type: 'conversation/updateMessageResponseInConversation', payload: data });

    // If there's a task_id and data.conversation_id, this might be the final message after a queued/streaming operation
    if (data.task_id && data.conversation_id && data.message_id) {

      // Get current state
      const state = store.getState();
      const runningMessages = state.queue.runningMessages;
      const queuedMessages = state.queue.queuedMessages;

      // Extract status using comprehensive function
      const status = extractStatus(data);

      // Check if the message is in running queue
      const isInRunningQueue = runningMessages[data.conversation_id]?.includes(data.message_id);

      // Check if already in queue
      const isInQueue = queuedMessages[data.conversation_id]?.includes(data.message_id);

      // Only remove from running if present in running queue
      if (isInRunningQueue) {

        dispatch(
          removeFromRunning({
            chatId: data.conversation_id,
            messageId: data.message_id,
          }),
        );
      } else {

        // IMPORTANT: Check if this is a message with queued status that should be added to running
        if (status === 'queued') {

          dispatch(
            addToRunning({
              chatId: data.conversation_id,
              messageId: data.message_id,
            }),
          );
        }
      }

      // Only add to queue if not already in queue and if it's a completed/error message
      if (!isInQueue && isCompletedStatus(status) && isInRunningQueue) {

        dispatch(
          addToQueue({
            chatId: data.conversation_id,
            messageId: data.message_id,
          }),
        );
      }
    }

    // Update conversation item status
    dispatch({
      type: 'conversation/updateConversationItemStatus',
      payload: {
        id: data.conversation_id,
        status: CONVERSATION_ITEM_STATUS.COMPLETED,
      },
    });

  });

  socket.on(SOCKET_EVENTS.CONVERSATION_STATUS, (data) => {

    // Update on message status changes (in_progress, queued, etc.)
    // Rate limit logging to avoid console spam on streaming responses
    const statusKey = `${data.conversation_id}:${data.message_id}:${data.status}`;
    const now = Date.now();
    const lastUpdate = statusUpdateLog.get(statusKey) || 0;

    // Only log status updates if they're more than 2 seconds apart for the same status
    if (now - lastUpdate > 2000) {

      statusUpdateLog.set(statusKey, now);

      // Clean up old entries from the log (keep only last 5 minutes of updates)
      for (const [key, timestamp] of statusUpdateLog.entries()) {
        if (now - timestamp > 300000) {
          // 5 minutes
          statusUpdateLog.delete(key);
        }
      }
    }

    if (data.message_id) {
      // Extract status using comprehensive function
      const status = extractStatus(data);
      const statusLower = status?.toLowerCase();

      // OPTIMIZED: Process immediately without excessive logging
      if (statusLower) {
        // Process status update with immediate dispatch using setTimeout
        setTimeout(() => {
          const state = store.getState();
          const runningMessages = state.queue.runningMessages;
          const queuedMessages = state.queue.queuedMessages;

          // Handle COMPLETED status with enhanced handling
          if (isCompletedStatus(status) && data.conversation_id) {
            // Check if message is in running queue before removing
            const isInRunningQueue = runningMessages[data.conversation_id]?.includes(data.message_id);
            const isInQueue = queuedMessages[data.conversation_id]?.includes(data.message_id);

            if (isInRunningQueue) {
              // Remove message from running immediately
              dispatch(
                removeFromRunning({
                  chatId: data.conversation_id,
                  messageId: data.message_id,
                }),
              );

              // Only add to queue if not already there
              if (!isInQueue) {
                dispatch(
                  addToQueue({
                    chatId: data.conversation_id,
                    messageId: data.message_id,
                  }),
                );
              }
            }

            // Continue with conversation status update
            dispatch({
              type: 'conversation/updateConversationItemStatus',
              payload: {
                id: data.conversation_id,
                status: CONVERSATION_ITEM_STATUS.COMPLETED,
              },
            });
          }
        }, 0); // Execute immediately but asynchronously
      }
      // Handle queued status - only add to running if status is queued and not already in running
      else if (
        (statusLower === 'queued' ||
          data.metadata?.status === 'queued' ||
          data.metadata?.agent_response?.status === 'queued') &&
        data.conversation_id
      ) {
        // OPTIMIZED: Get fresh state for queue management
        setTimeout(() => {
          const state = store.getState();
          const runningMessages = state.queue.runningMessages;

          // Check if already in running queue
          const isInRunningQueue = runningMessages[data.conversation_id]?.includes(data.message_id);

          // Only add to running queue if not already there
          if (!isInRunningQueue) {
            dispatch(
              addToRunning({
                chatId: data.conversation_id,
                messageId: data.message_id,
              }),
            );
          }

          // Update conversation status in the sidebar
          dispatch({
            type: 'conversation/updateConversationItemStatus',
            payload: {
              id: data.conversation_id,
              status: CONVERSATION_ITEM_STATUS.IN_PROGRESS,
            },
          });
        }, 0);
      }
      // Don't automatically add to running queue for processing/in_progress status
      // Let specific components manage those via their own logic
    }
  });

  socket.on(SOCKET_EVENTS.CONVERSATION_QUEUED, (data) => {

    // Show notification to the user
    dispatch(
      notifyViaSnackBar({
        message:
          'This request is taking longer than expected and will complete in the background. You can view progress in Threads.',
        severity: 'info',
        open: true,
        autoHideDuration: 6000,
      }),
    );

    // Add the message to the running queue for ThreadsDashboard to track
    // Use either message_id or request_id depending on which is available
    const messageId = data.message_id || data.request_id;

    if (messageId && data.conversation_id) {
      // Check if already in running queue
      const state = store.getState();
      const runningMessages = state.queue.runningMessages;
      const isInRunningQueue = runningMessages[data.conversation_id]?.includes(messageId);

      // Only add to running if not already there
      if (!isInRunningQueue) {
        dispatch(
          addToRunning({
            chatId: data.conversation_id,
            messageId: messageId,
          }),
        );

      }
    }

    // Update conversation status in the sidebar
    dispatch({
      type: 'conversation/updateConversationItemStatus',
      payload: {
        id: data.conversation_id,
        status: CONVERSATION_ITEM_STATUS.IN_PROGRESS,
      },
    });

  });

  socket.on(SOCKET_EVENTS.NOTIFICATION, (data) => {

    dispatch({
      type: 'conversation/updateConversationItemStatus',
      payload: {
        id: data.conversation_id,
        status: CONVERSATION_ITEM_STATUS.COMPLETED,
      },
    });

    // If this is an error notification, show it to the user
    if (data.error) {
      dispatch(
        notifyViaSnackBar({
          message: `${data.error}: ${data.details || ''}`,
          severity: 'error',
          open: true,
        }),
      );
    }
  });

  // New handler for specific error notifications
  socket.on(SOCKET_EVENTS.ERROR_NOTIFICATION, (data) => {

    // Move from running to completed (even though it's an error)
    if (data.message_id && data.conversation_id) {
      // Check if actually in running queue
      const state = store.getState();
      const runningMessages = state.queue.runningMessages;
      const queuedMessages = state.queue.queuedMessages;

      const isInRunningQueue = runningMessages[data.conversation_id]?.includes(data.message_id);
      const isInQueue = queuedMessages[data.conversation_id]?.includes(data.message_id);

      if (isInRunningQueue) {
        dispatch(
          removeFromRunning({
            chatId: data.conversation_id,
            messageId: data.message_id,
          }),
        );

        // Only add to queue if not already there
        if (!isInQueue) {
          dispatch(
            addToQueue({
              chatId: data.conversation_id,
              messageId: data.message_id,
            }),
          );
        }

      }
    }

    dispatch(
      notifyViaSnackBar({
        message: `Error: ${data.error || 'Unknown error'} ${data.details ? `- ${data.details}` : ''}`,
        severity: 'error',
        open: true,
        autoHideDuration: 8000,
      }),
    );

    // Update conversation status in the sidebar
    dispatch({
      type: 'conversation/updateConversationItemStatus',
      payload: {
        id: data.conversation_id,
        status: CONVERSATION_ITEM_STATUS.COMPLETED,
      },
    });

  });

  socket.on(SOCKET_EVENTS.CONNECTION_ERROR, (err) => {

    disableLoading();

    // Azure-specific: Add more details to the error message for better diagnostics
    let errorMessage = 'Error while initiating socket connection';

    if (err.message) {
      if (err.message.includes('xhr poll error')) {
        errorMessage = 'Network connection interrupted. Please check your internet connection.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Azure load balancing might be affecting real-time updates.';
      } else {
        errorMessage = `Connection error: ${err.message}`;
      }
    }

    dispatch(
      notifyViaSnackBar({
        message: errorMessage,
        severity: 'error',
        open: true,
      }),
    );
  });

  // Add monitoring for Azure Redis Cache specific issues
  socket.on('reconnect_attempt', (attemptNumber) => {
    // After several retries, provide additional diagnostics
    if (attemptNumber > 3) {
      console.log('[SOCKET DEBUG] Multiple reconnection attempts');
    }
  });

  // This event fires when a reconnection is successful
  socket.on('reconnect', (attemptNumber) => {

    if (attemptNumber > 1) {
      dispatch(
        notifyViaSnackBar({
          message: 'Connection restored after multiple attempts',
          severity: 'success',
          open: true,
          autoHideDuration: 3000,
        }),
      );
    }
  });
};

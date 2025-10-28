import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress, IconButton, LinearProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  selectQueuedMessages,
  selectRunningMessages,
  selectActiveThread,
  selectStopGenerating,
  setActiveThread,
  setStopGenerating,
  removeFromRunning,
  addToQueue,
  setMessageData,
} from '../../redux/store/queueSlice';
import { api } from '../../services/api';
import MessageBubble from '../MessageBubble/MessageBubble';
import classes from './ThreadsDashboard.module.scss';
import { notifyViaSnackBar } from '../../redux/store/conversationSlice';
import { createSelector } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';

/**
 * QueueingPanel component for displaying and managing queued messages.
 * Implements Azure best practices for handling long-running operations.
 *
 * @param {Object} props - Component props
 * @param {number} props.pollInterval - Interval for polling in milliseconds
 * @param {number} props.maxRetries - Maximum number of polling retries
 */
const QueueingPanel = ({ pollInterval = 10000, maxRetries = 60 }) => {
  const dispatch = useDispatch();

  // Redux state
  const queuedMessages = useSelector(selectQueuedMessages);
  const runningMessages = useSelector(selectRunningMessages);
  const activeMessageId = useSelector(selectActiveThread);
  const stopGenerating = useSelector(selectStopGenerating);

  // Local state
  const [loadingMessages] = useState({}); // setLoadingMessages not used
  const [pollingStatus] = useState({}); // setPollingStatus not used
  const [retryCount, setRetryCount] = useState({});
  const [lastError, setLastError] = useState(null);
  const [processingMessages, setProcessingMessages] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [messageDataCache, setMessageDataCache] = useState({});

  // Refs for tracking timers
  const pollTimersRef = useRef({});
  const retryTimersRef = useRef({});
  const processingPollingRef = useRef(null);
  const componentMountedRef = useRef(true);
  const lastPollTimeRef = useRef({});
  const prevProcessingMessagesRef = useRef(new Set());

  // New ref to prevent update loops
  const stateUpdateInProgressRef = useRef(false);

  // API endpoint reference
  const conversationQueries = api.endpoints.getConversationDetailsById;

  // Get unique message IDs from both queued and running messages - with stable reference
  const messageIds = useMemo(() => {
    const uniqueIds = new Set();

    // Add messages from queued state
    if (queuedMessages && typeof queuedMessages === 'object') {
      Object.values(queuedMessages).forEach((ids) => {
        if (Array.isArray(ids)) {
          ids.forEach((id) => id && uniqueIds.add(id));
        }
      });
    }

    // Add messages from running state
    if (runningMessages && typeof runningMessages === 'object') {
      Object.values(runningMessages).forEach((ids) => {
        if (Array.isArray(ids)) {
          ids.forEach((id) => id && uniqueIds.add(id));
        }
      });
    }

    return Array.from(uniqueIds);
  }, [queuedMessages, runningMessages]);

  // Get all chat IDs that have messages (both queued and running) - with stable reference
  const allChatIds = useMemo(() => {
    const chatIds = new Set();

    // Add chat IDs from queued messages
    if (queuedMessages && typeof queuedMessages === 'object') {
      Object.keys(queuedMessages).forEach((chatId) => {
        if (queuedMessages[chatId]?.length > 0) {
          chatIds.add(chatId);
        }
      });
    }

    // Add chat IDs from running messages
    if (runningMessages && typeof runningMessages === 'object') {
      Object.keys(runningMessages).forEach((chatId) => {
        if (runningMessages[chatId]?.length > 0) {
          chatIds.add(chatId);
        }
      });
    }

    return Array.from(chatIds);
  }, [queuedMessages, runningMessages]);

  // Get active chat IDs that still need polling (not completed) - with stable reference
  const runningChatIds = useMemo(() => {
    if (!runningMessages || Object.keys(runningMessages).length === 0) return [];

    const activeChats = Object.keys(runningMessages).filter(
      (chatId) => runningMessages[chatId]?.length > 0 && !pollingStatus[chatId]?.completed,
    );

    return activeChats;
  }, [runningMessages, pollingStatus]);

  // Track mounted state for safer async operations
  useEffect(() => {
    componentMountedRef.current = true;
    return () => {
      componentMountedRef.current = false;

      // Clear all timers and intervals on unmount
      Object.values(pollTimersRef.current).forEach(clearInterval);
      Object.values(retryTimersRef.current).forEach(clearTimeout);
      if (processingPollingRef.current) {
        clearInterval(processingPollingRef.current);
      }
    };
  }, []);

  // Memoized selector for all message data to prevent unnecessary rerenders
  const selectAllMessageData = createSelector(
    [(state) => state.queue.messageData, (state) => state.queue.queuedMessages, (state) => state.queue.runningMessages],
    (messageData, queuedMessages, runningMessages) => {
      const data = {};

      // Include messages from running state
      Object.keys(runningMessages || {}).forEach((chatId) => {
        const messages = runningMessages[chatId] || [];
        messages.forEach((messageId) => {
          if (messageId) {
            data[chatId] = data[chatId] || {};
            if (messageData[chatId] && messageData[chatId][messageId]) {
              data[chatId][messageId] = messageData[chatId][messageId];
            }
          }
        });
      });

      // Include messages from queued state (if not already added)
      Object.keys(queuedMessages || {}).forEach((chatId) => {
        const messages = queuedMessages[chatId] || [];
        messages.forEach((messageId) => {
          if (messageId) {
            data[chatId] = data[chatId] || {};
            if (!data[chatId][messageId] && messageData[chatId] && messageData[chatId][messageId]) {
              data[chatId][messageId] = messageData[chatId][messageId];
            }
          }
        });
      });

      return data;
    },
  );

  // Use the memoized selector
  const allMessageData = useSelector(selectAllMessageData);

  // Helper function to find the chatId for a messageId - with stable implementation
  const findChatIdForMessage = useCallback(
    (messageId) => {
      if (!messageId) return null;

      const messageIdStr = String(messageId);

      // Check in runningMessages
      for (const chatId in runningMessages) {
        if (
          Array.isArray(runningMessages[chatId]) &&
          runningMessages[chatId].some((id) => String(id) === messageIdStr)
        ) {
          return chatId;
        }
      }

      // Check in queuedMessages
      for (const chatId in queuedMessages) {
        if (Array.isArray(queuedMessages[chatId]) && queuedMessages[chatId].some((id) => String(id) === messageIdStr)) {
          return chatId;
        }
      }

      // Check directly in message data cache as a fallback
      for (const chatId in messageDataCache) {
        if (messageDataCache[chatId] && messageIdStr in messageDataCache[chatId]) {
          return chatId;
        }
      }

      return null;
    },
    [runningMessages, queuedMessages, messageDataCache],
  );

  // Comprehensive message status extraction
  const extractMessageStatus = useCallback((message) => {
    if (!message) return null;

    // 1. Look in metadata.status
    if (message.metadata?.status) {
      return message.metadata.status.toLowerCase();
    }

    // 2. Parse JSON message for status
    if (typeof message.message === 'string') {
      try {
        const parsed = JSON.parse(message.message);
        if (parsed && parsed.status) {
          return parsed.status.toLowerCase();
        }
      } catch {
        // Parsing failed, continue to other checks
      }
    }

    // 3. Check agent_response in metadata
    if (message.metadata?.agent_response?.status) {
      return message.metadata.agent_response.status.toLowerCase();
    }

    // 4. Check for task_id in metadata (implies processing)
    if (message.metadata?.task_id) {
      return 'processing';
    }

    return null;
  }, []);

  // Process message data with improved state transition handling
  const processMessageData = useCallback(
    (data, chatId) => {
      if (!data || !chatId) return;

      try {
        const messages = data.messages || [];

        // Initialize cache if it doesn't exist
        if (!messageDataCache[chatId]) {
          messageDataCache[chatId] = {};
        }

        const updatedMessageDataCache = { ...messageDataCache };
        const currentProcessingMessages = new Set(processingMessages);
        let processingChanged = false;

        messages.forEach((message) => {
          if (!message || !message.id) return;
          const messageId = message.id.toString();

          // Store the message data indexed by message ID
          updatedMessageDataCache[chatId][messageId] = message;
          const status = extractMessageStatus(message);

          // Handle message state transitions based on your requirements
          if (status === 'queued') {
            console.log(`Message ${messageId} has queued status - leaving as is`);
          } else if (['completed', 'complete', 'success'].includes(status?.toLowerCase())) {
            // For completed status: remove from running and add to queue
            dispatch(removeFromRunning({ chatId, messageId }));
            dispatch(addToQueue({ chatId, messageId }));

            // Remove from processing messages
            if (currentProcessingMessages.has(messageId)) {
              currentProcessingMessages.delete(messageId);
              processingChanged = true;
            }

            console.log(`Message ${messageId} completed - moved from running to queue`);
          } else if (['failed', 'error'].includes(status?.toLowerCase())) {
            // Remove from both queues on failure/error
            dispatch(removeFromRunning({ chatId, messageId }));

            if (currentProcessingMessages.has(messageId)) {
              currentProcessingMessages.delete(messageId);
              processingChanged = true;
            }
          } else if (['processing', 'generating', 'in_progress', 'inprogress'].includes(status?.toLowerCase())) {
            // Ensure message is in processing state
            if (!currentProcessingMessages.has(messageId)) {
              currentProcessingMessages.add(messageId);
              processingChanged = true;
            }
          }

          // Store message data in Redux for chat AI messages
          if (message.sender_type === 'chatai' && message.message?.trim()) {
            dispatch(
              setMessageData({
                chatId,
                messageId,
                data: {
                  id: messageId,
                  title: extractTitleFromMessage(message),
                  status: status,
                  rawMessage: message,
                  message: message.message,
                  sender_type: message.sender_type,
                  question: findQuestionForAnswer(messages, messageId),
                  answer: message,
                  created_at: message.created_at,
                },
              }),
            );
          }
        });

        // Update state if component is still mounted
        if (componentMountedRef.current) {
          if (JSON.stringify(updatedMessageDataCache) !== JSON.stringify(messageDataCache)) {
            setMessageDataCache(updatedMessageDataCache);
          }

          if (processingChanged) {
            setProcessingMessages(currentProcessingMessages);
          }
        }

        return { messages, messageCount: messages.length };
      } catch (error) {
        console.error(`[QueueingPanel] Error processing message data:`, error);
        throw error;
      }
    },
    [dispatch, messageDataCache, processingMessages, extractMessageStatus],
  );

  // Helper function to extract title from message
  const extractTitleFromMessage = (message) => {
    if (!message) return 'Untitled Message';

    // Try to get title from question message if it exists
    if (message.source_msg_id) {
      try {
        // Find the related question message by source_msg_id
        const questionMessage = message;
        if (questionMessage && questionMessage.message) {
          const truncatedQuestion = questionMessage.message;
          return truncatedQuestion;
        }
      } catch (e) {
        console.error('Error extracting title from question:', e);
      }
    }

    // Otherwise, use the message content itself
    if (message.message) {
      try {
        const messageStr = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
        const truncatedMessage = messageStr.length > 30 ? `${messageStr.substring(0, 30)}...` : messageStr;
        return truncatedMessage;
      } catch {
        // Failed to parse, return default
      }
    }

    // Default title
    return 'Untitled Message';
  };

  // Helper function to find the user question that triggered this answer
  const findQuestionForAnswer = (messages, answerId) => {
    if (!messages || !messages.length || !answerId) return null;

    try {
      // Find the AI answer message
      const answerMessage = messages.find((msg) => msg.id.toString() === answerId);
      if (!answerMessage) return null;

      // Find the user question by source_msg_id
      if (answerMessage.source_msg_id) {
        const questionMessage = messages.find((msg) => msg.id.toString() === answerMessage.source_msg_id.toString());
        if (questionMessage && questionMessage.sender_type === 'user') {
          return questionMessage;
        }
      }

      // If not found by source_msg_id, look for a user message that comes before this answer
      const answerIndex = messages.findIndex((msg) => msg.id.toString() === answerId);
      if (answerIndex > 0) {
        for (let i = answerIndex - 1; i >= 0; i--) {
          if (messages[i].sender_type === 'user') {
            return messages[i];
          }
        }
      }
    } catch (error) {
      console.error('[QueueingPanel] Error finding question for answer:', error);
    }

    return null;
  };

  // Initial load of all conversations when component first mounts (single execution)
  useEffect(() => {
    if (initialLoadComplete || stateUpdateInProgressRef.current) return;

    stateUpdateInProgressRef.current = true;

    // Get all chat IDs that need data fetched
    const fetchChatIds = [...allChatIds];

    if (fetchChatIds.length === 0) {
      setInitialLoadComplete(true);
      stateUpdateInProgressRef.current = false;
      return;
    }

    // Define a sequential loading function to avoid race conditions
    const fetchDataSequentially = async () => {
      const results = [];

      for (const chatId of fetchChatIds) {
        try {
          // Use the conversation query API to fetch chat data
          const response = await dispatch(
            conversationQueries.initiate(chatId, {
              subscribe: false,
              refetchOnMountOrArgChange: true,
            }),
          ).unwrap();

          if (response) {
            // Process the data right away
            processMessageData(response, chatId);
            results.push({ chatId, success: true });
          } else {
            results.push({ chatId, success: true, empty: true });
          }
        } catch (error) {
          console.error(`[QueueingPanel] Error fetching data for chat ${chatId}:`, error);
          results.push({ chatId, success: false, error });
        }
      }

      if (componentMountedRef.current) {
        // Mark initial load as complete
        setInitialLoadComplete(true);
      }

      stateUpdateInProgressRef.current = false;
      return results;
    };

    // Start the sequential loading process
    fetchDataSequentially().catch((error) => {
      console.error('[QueueingPanel] Error during initial data load:', error);
      if (componentMountedRef.current) {
        setInitialLoadComplete(true);
      }
      stateUpdateInProgressRef.current = false;
    });
  }, [allChatIds, dispatch, conversationQueries, processMessageData, initialLoadComplete]);

  // Track changes to processing messages and set up polling if needed
  useEffect(() => {
    // Only update prevProcessingMessagesRef if not inside an update loop
    prevProcessingMessagesRef.current = new Set(processingMessages);

    // Only poll if we have processing messages and not currently polling
    if (processingMessages.size === 0) {
      if (processingPollingRef.current) {
        clearInterval(processingPollingRef.current);
        processingPollingRef.current = null;
      }
      return;
    }

    // Setup polling if not already polling
    if (!processingPollingRef.current && !stopGenerating) {
      processingPollingRef.current = setInterval(async () => {
        // Minimum interval between API calls to avoid rate limiting
        const now = Date.now();
        const minIntervalBetweenPolls = 5000; // 5 seconds minimum

        for (const messageId of Array.from(processingMessages)) {
          const chatId = findChatIdForMessage(messageId);
          if (!chatId) continue;

          // Skip if we polled this chat recently
          if (lastPollTimeRef.current[chatId] && now - lastPollTimeRef.current[chatId] < minIntervalBetweenPolls) {
            continue;
          }

          // Update the last poll time
          lastPollTimeRef.current[chatId] = now;

          try {
            const response = await dispatch(
              conversationQueries.initiate(chatId, {
                subscribe: false,
                refetchOnMountOrArgChange: true,
                forceRefetch: true,
              }),
            ).unwrap();

            if (response && componentMountedRef.current) {
              processMessageData(response, chatId);
            }
          } catch (error) {
            console.error(`[QueueingPanel] Error polling message ${messageId}:`, error);
          }
        }
      }, pollInterval);
    }

    // Cleanup polling when stopGenerating changes or component unmounts
    return () => {
      if (processingPollingRef.current) {
        clearInterval(processingPollingRef.current);
        processingPollingRef.current = null;
      }
    };
  }, [
    processingMessages,
    findChatIdForMessage,
    dispatch,
    conversationQueries,
    processMessageData,
    pollInterval,
    stopGenerating,
  ]);

  // Setup polling for running chats with better state management
  useEffect(() => {
    if (!runningChatIds.length || stopGenerating) {
      // Clear existing timers if stopGenerating is true
      Object.entries(pollTimersRef.current).forEach(([chatId, timer]) => {
        clearInterval(timer);
        delete pollTimersRef.current[chatId];
      });
      return;
    }

    // Create poll timers for each active chat that doesn't have one already
    runningChatIds.forEach((chatId) => {
      // Skip if already polling or completed
      if (pollTimersRef.current[chatId] || pollingStatus[chatId]?.completed) {
        return;
      }

      // Immediate first poll to avoid waiting for interval
      const doInitialPoll = async () => {
        try {
          const result = await dispatch(
            conversationQueries.initiate(chatId, {
              subscribe: false,
              refetchOnMountOrArgChange: true,
              forceRefetch: true,
            }),
          ).unwrap();

          if (result && componentMountedRef.current) {
            processMessageData(result, chatId);
          }
        } catch (error) {
          console.error('[QueueingPanel] Initial poll error:', error);
        }
      };

      // Execute first poll
      doInitialPoll();

      // Setup polling interval that's aware of stopGenerating changes
      pollTimersRef.current[chatId] = setInterval(async () => {
        // Stop polling if requested or already completed
        if (stopGenerating || pollingStatus[chatId]?.completed) {
          clearInterval(pollTimersRef.current[chatId]);
          delete pollTimersRef.current[chatId];
          return;
        }

        // Check retry count before polling again
        const currentRetryCount = retryCount[chatId] || 0;
        if (currentRetryCount > maxRetries) {
          clearInterval(pollTimersRef.current[chatId]);
          delete pollTimersRef.current[chatId];

          // Notify user that we've stopped polling
          dispatch(
            notifyViaSnackBar({
              message: `Stopped polling for updates after ${maxRetries} attempts. The operation may still complete in the background.`,
              severity: 'warning',
              open: true,
            }),
          );
          return;
        }

        // Increment retry count
        if (componentMountedRef.current) {
          setRetryCount((prev) => ({
            ...prev,
            [chatId]: (prev[chatId] || 0) + 1,
          }));
        }

        // Execute the poll
        try {
          const response = await dispatch(
            conversationQueries.initiate(chatId, {
              subscribe: false,
              refetchOnMountOrArgChange: true,
              forceRefetch: true,
            }),
          ).unwrap();

          if (response && componentMountedRef.current) {
            processMessageData(response, chatId);
          }
        } catch (error) {
          console.error('[QueueingPanel] Poll error:', error);
        }
      }, pollInterval);
    });

    // Cleanup function to prevent memory leaks
    return () => {
      // Only clean up timers that were created by this effect
      runningChatIds.forEach((chatId) => {
        if (pollTimersRef.current[chatId]) {
          clearInterval(pollTimersRef.current[chatId]);
          delete pollTimersRef.current[chatId];
        }
      });
    };
  }, [
    runningChatIds,
    pollingStatus,
    stopGenerating,
    dispatch,
    conversationQueries,
    retryCount,
    processMessageData,
    pollInterval,
    maxRetries,
  ]);

  // Auto-select first message when messageIds changes and none is selected
  useEffect(() => {
    if (!activeMessageId && messageIds.length > 0 && initialLoadComplete) {
      dispatch(setActiveThread(messageIds[0]));
    }
  }, [messageIds, activeMessageId, dispatch, initialLoadComplete]);

  // Render message list item with better title extraction
  const renderMessageItem = useCallback(
    (messageId) => {
      const chatId = findChatIdForMessage(messageId);

      if (!chatId) {
        return null;
      }

      // Get message data from Redux state or the local cache
      const messageData = allMessageData[chatId]?.[messageId] || messageDataCache[chatId]?.[messageId];

      // Improved title extraction from multiple possible sources
      let title = 'Untitled Message';

      if (messageData) {
        // Try to get title from question message first
        if (messageData.question?.message) {
          title =
            typeof messageData.question.message === 'string'
              ? messageData.question.message.length > 30
                ? `${messageData.question.message.substring(0, 30)}...`
                : messageData.question.message
              : title;
        } else if (messageData.title) {
          title = messageData.title;
        } else if (messageData.message) {
          title =
            typeof messageData.message === 'string'
              ? messageData.message.length > 30
                ? `${messageData.message.substring(0, 30)}...`
                : messageData.message
              : title;
        } else if (messageData.rawMessage?.message) {
          title =
            typeof messageData.rawMessage.message === 'string'
              ? messageData.rawMessage.message.length > 30
                ? `${messageData.rawMessage.message.substring(0, 30)}...`
                : messageData.rawMessage.message
              : title;
        }
      }

      // Get status for appropriate indicators
      const status = messageData?.status || extractMessageStatus(messageData?.rawMessage);
      const isQueued = status === 'queued';
      const isProcessing = processingMessages.has(messageId);
      const isLoading = !!loadingMessages[messageId];
      const isActive = activeMessageId === messageId;

      // Show clock icon only for queued status (generating)
      const showClockIcon = isQueued || isProcessing || isLoading;

      return (
        <Box
          key={messageId}
          className={`${classes.threadItem} ${isActive ? classes.activeThread : ''}`}
          onClick={() => !isActive && dispatch(setActiveThread(messageId))}>
          <Typography className={classes.threadTitle}>{title}</Typography>
          <div className={classes.threadActions}>
            {showClockIcon && <AccessTimeIcon color="primary" className={classes.clockIcon} />}
            <IconButton className={classes.moreButton} size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </div>
        </Box>
      );
    },
    [
      loadingMessages,
      activeMessageId,
      dispatch,
      allMessageData,
      processingMessages,
      findChatIdForMessage,
      messageDataCache,
      extractMessageStatus,
    ],
  );

  // Render active content with updated status handling
  const renderActiveContent = useCallback(() => {
    if (!activeMessageId) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Select a message to view details
          </Typography>
        </Box>
      );
    }

    const chatId = findChatIdForMessage(activeMessageId);
    if (!chatId) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Message not found
          </Typography>
        </Box>
      );
    }

    const messageData = allMessageData[chatId]?.[activeMessageId] || messageDataCache[chatId]?.[activeMessageId];

    if (!messageData && initialLoadComplete) {
      return (
        <Box className={classes.loadingContainer}>
          <CircularProgress size={24} className={classes.spinner} />
          <Typography className={classes.loadingText}>Loading message details...</Typography>
        </Box>
      );
    }

    const question = messageData?.question || {};
    const answer = messageData?.answer || {};
    const status = messageData?.status || extractMessageStatus(messageData?.rawMessage);
    const isQueued = status === 'queued';

    // Show stop generating button only when queued (generating)
    const showStopButton = isQueued;

    return (
      <Box className={classes.messageContainer}>
        {/* Header with conditional Stop Generating button */}
        <Box className={classes.rightPaneHeader}>
          <Typography className={classes.questionTitle}>
            {messageData?.question?.message || 'Untitled Message'}
          </Typography>

          {showStopButton && (
            <div className={classes.actionButtons}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  dispatch(setStopGenerating(!stopGenerating));
                  if (!stopGenerating) {
                    // When stopping, clear polling and stop processing
                    console.log('Stopping generation for message:', activeMessageId);
                  }
                }}
                className={classes.generateButton}>
                {stopGenerating ? 'Resume Generating' : 'Stop Generating'}
              </Button>
            </div>
          )}
        </Box>

        {/* Content area - no blur effect for completed messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            padding: 2,
            position: 'relative',
          }}>
          {question && question.message && (
            <MessageBubble
              message={question.message}
              isUser={true}
              userInitials="U"
              id={question.id}
              sender_type="user"
              created_at={question.created_at}
              files={question.files || []}
              previousMessage={null}
            />
          )}

          {answer && answer.message && (
            <MessageBubble
              message={answer.message}
              isUser={false}
              userInitials="AI"
              id={answer.id}
              sender_type="chatai"
              created_at={answer.created_at}
              metadata={answer.metadata}
              files={answer.files || []}
              previousMessage={question && question.message ? question : null}
            />
          )}

          {/* Show progress indicator only if queued (generating) */}
          {isQueued && (
            <Box className={classes.progressContainer}>
              <LinearProgress className={classes.progressBar} />
              <Typography className={classes.progressText}>Generating response...</Typography>
            </Box>
          )}

          {/* Show message if both question and answer are missing */}
          {!question.message && !answer.message && !isQueued && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Message content not available
              </Typography>
            </Box>
          )}
        </Box>

        {/* Loading overlay only for queued state */}
        {isQueued && (
          <Box className={classes.queuedOverlay}>
            <LinearProgress className={classes.progressBar} />
            <Typography className={classes.progressText}>Processing in background...</Typography>
          </Box>
        )}
      </Box>
    );
  }, [
    activeMessageId,
    allMessageData,
    messageDataCache,
    stopGenerating,
    dispatch,
    findChatIdForMessage,
    initialLoadComplete,
    extractMessageStatus,
  ]);

  // Main render
  return (
    <Box className={classes.content}>
      {lastError && (
        <Box className={classes.errorBanner}>
          <Typography variant="body2">{lastError}</Typography>
          <Button size="small" onClick={() => setLastError(null)} className={classes.dismissButton}>
            Dismiss
          </Button>
        </Box>
      )}

      <Box className={classes.leftPane}>
        {messageIds.length === 0 ? (
          <Box className={classes.noMessages}>
            <Typography variant="body2" color="textSecondary">
              No queued messages found
            </Typography>
          </Box>
        ) : (
          messageIds.map(renderMessageItem)
        )}
      </Box>

      <Box className={classes.rightPane}>
        {messageIds.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 3 }}>
            <Typography variant="body2" color="textSecondary">
              No queued messages found
            </Typography>
          </Box>
        ) : (
          renderActiveContent()
        )}
      </Box>
    </Box>
  );
};

QueueingPanel.propTypes = {
  pollInterval: PropTypes.number,
  maxRetries: PropTypes.number,
};

export default QueueingPanel;

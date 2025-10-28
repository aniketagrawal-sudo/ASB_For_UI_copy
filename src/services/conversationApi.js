import { api } from './api';
import {
  setCreatingConversation,
  updateLatestMessageErrorInConversation,
  setLoadingConversationData,
  setConversationDetails,
  setArchivedConversation,
  updateConversationItemStatus,
  notifyViaSnackBar,
} from '../redux/store/conversationSlice';
import { setPageConversation, clearPageConversation } from '../features/auth/authSlice';
import { CONVERSATION_ITEM_STATUS } from '../utils/constants';
import { isSocketConnected } from '../utils/socket';

/**
 * Group conversations by time periods for better organization
 * Filter by current user's selected client and persona
 * @param {Array} data - Conversation data from API
 * @param {number} selectedIndustryId - Currently selected industry/client ID
 * @param {number} selectedPersonaId - Currently selected persona ID
 * @returns {Object} Grouped conversation data
 */
const groupConversations = (data, selectedIndustryId, selectedPersonaId) => {
  if (!data || !Array.isArray(data)) {
    return {
      'This Week': [],
      'Last Week': [],
      Previous: [],
    };
  }

  // Filter conversations to match current user's selected client and persona
  const filteredData = data.filter((conversation) => {
    // If no filter criteria provided, show all conversations (fallback)
    if (!selectedIndustryId || !selectedPersonaId) {
      return true;
    }

    const metadata = conversation.conversation_metadata;
    if (!metadata) {
      return false;
    }

    // Check if conversation matches current client and persona
    const conversationClientId = metadata.client;
    const conversationPersonaId = metadata.persona;

    return conversationClientId === selectedIndustryId && conversationPersonaId === selectedPersonaId;
  });

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const twoWeeks = 2 * oneWeek;

  const result = filteredData.reduce(
    (acc, conversation) => {
      if (!conversation.created_at) return acc;

      const conversationDate = new Date(conversation.created_at);
      const timeDiff = now - conversationDate;

      // Group by weeks
      if (timeDiff <= oneWeek) {
        acc['This Week'].push(conversation);
      } else if (timeDiff <= twoWeeks) {
        acc['Last Week'].push(conversation);
      } else {
        acc['Previous'].push(conversation);
      }
      return acc;
    },
    {
      'This Week': [],
      'Last Week': [],
      Previous: [],
    },
  );

  // Sort conversations within each group by created_at date (newest first)
  Object.keys(result).forEach((key) => {
    result[key].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  });

  return result;
};

/**
 * Enhanced API endpoints with WebSocket integration
 * - Primary: Uses WebSockets for real-time updates
 * - Fallback: Uses polling only when WebSockets are unavailable
 * - Azure-optimized: Handles reconnection and intermittent failures
 *
 * @version 2.0.0
 */
export const conversationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: (email) => ({
        url: `/api/user/data?email=${encodeURIComponent(email)}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.data || null,
    }),

    addMessageInDB: builder.mutation({
      query: (data) => ({
        url: `/api/message`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(newQuestion, { dispatch, queryFulfilled }) {
        try {
          // This will return task_id from the WebSocket-enhanced backend
          const response = await queryFulfilled;

          // Update conversation status to in-progress while waiting for WebSocket updates
          if (response?.data?.conversation_id) {
            dispatch(
              updateConversationItemStatus({
                id: response.data.conversation_id,
                status: CONVERSATION_ITEM_STATUS.IN_PROGRESS,
              }),
            );
          }
        } catch (err) {
          console.error('Message creation failed:', err);
          dispatch(
            updateLatestMessageErrorInConversation({
              msg: err.error?.data?.message || 'Something went wrong',
            }),
          );
        }
      },
    }),

    // Emergency fallback endpoint only used when WebSockets are completely unavailable
    // This is kept for system resilience in Azure environments where WebSocket
    // connections might be temporarily affected by load balancers
    checkTaskStatuses: builder.mutation({
      query: (tasks) => ({
        url: '/api/agent/check-task-status',
        method: 'POST',
        body: { tasks },
      }),
    }),

    getConversationDetailsById: builder.query({
      query: (id) => ({
        url: `/api/conversation/${id}`,
        method: 'GET',
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: undefined,
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      keepUnusedDataFor: 0,
      transformResponse: (response) => {
        return response?.data || { messages: [] };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const currentState = getState();
        const currentId = currentState.auth.pageConversations[currentState.auth.currentPage];
        const hasExistingData = currentState.conversation.conversationDetails.length > 0;

        // Only clear data when switching conversations, not when refetching the same conversation
        if (currentId != id && !hasExistingData) {
          dispatch(setConversationDetails([]));
          dispatch(setLoadingConversationData(true));
        } else if (currentId == id && !hasExistingData) {
          // Only set loading if we don't have any data yet
          dispatch(setLoadingConversationData(true));
        }

        try {
          const { data } = await queryFulfilled;

          // Only update if this is still the current conversation
          if (currentId == id && data?.messages.length > 0) {
            const currentState = getState().conversation;

            // Process for in-progress messages with task_id (WebSocket tracking)
            if (!currentState.isProcessingMessageCreation) {
              const pendingTasks = data.messages
                .filter((msg) => {
                  try {
                    if (msg.sender_type !== 'chatai') return false;

                    // Check if message is JSON and has task_id
                    const messageContent =
                      typeof msg.message === 'string' && (msg.message.startsWith('{') || msg.message.startsWith('['))
                        ? JSON.parse(msg.message)
                        : msg.message;

                    return messageContent?.task_id && ['PENDING', 'IN_PROGRESS'].includes(messageContent?.status);
                  } catch {
                    return false;
                  }
                })
                .map((msg) => {
                  try {
                    return {
                      task_id: JSON.parse(msg.message)?.task_id,
                      message_id: msg.id,
                    };
                  } catch {
                    return null;
                  }
                })
                .filter(Boolean);

              // WEBSOCKET-FIRST APPROACH:
              // Only use polling as a true last-resort fallback when:
              // 1. We have pending tasks that need status updates
              // 2. Socket is completely disconnected
              // 3. Task has been pending for over 30 seconds
              if (pendingTasks.length > 0) {
                try {
                  // Check if socket is connected - primary method
                  const socketConnected = isSocketConnected();

                  // Socket state from store - secondary check
                  const socketStateConnected = getState().socket?.connected;

                  // Final connection status
                  const hasConnection = socketConnected || socketStateConnected;

                  // Only poll if all WebSocket options have failed
                  if (!hasConnection) {
                    // Get timestamp of oldest pending task
                    const oldestTaskTime = Math.min(
                      ...pendingTasks.map((task) => {
                        try {
                          // Find message in data
                          const message = data.messages.find((m) => m.id === task.message_id);
                          return message ? new Date(message.created_at).getTime() : Date.now();
                        } catch {
                          return Date.now();
                        }
                      }),
                    );

                    // Only poll for tasks pending more than 30 seconds
                    const taskAge = Date.now() - oldestTaskTime;
                    if (taskAge > 30000) {

                      // Notify user about fallback mode (only once)
                      if (!window._notifiedFallbackMode) {
                        window._notifiedFallbackMode = true;
                        dispatch(
                          notifyViaSnackBar({
                            message: 'Real-time connection unavailable. Using fallback update method.',
                            severity: 'info',
                            open: true,
                          }),
                        );

                        // Reset notification flag after 2 minutes
                        setTimeout(() => {
                          window._notifiedFallbackMode = false;
                        }, 120000);
                      }

                      // Make the fallback API call
                      const taskResult = await dispatch(
                        conversationApi.endpoints.checkTaskStatuses.initiate(pendingTasks),
                      ).unwrap();

                      if (taskResult?.data?.some((task) => task.status === 'COMPLETE')) {
                        dispatch(api.util.invalidateTags([{ type: 'Conversation', id }]));
                      }
                    }
                  }
                } catch (error) {
                  console.error('Task status check failed:', error);
                }
              }
            }

            // Update conversation details if still current
            dispatch(setConversationDetails(data.messages));

            // Check if any message is still in-progress
            const hasInProgressMessage = data.messages.some((msg) => {
              try {
                if (msg.sender_type !== 'chatai') return false;

                const messageContent =
                  typeof msg.message === 'string' && (msg.message.startsWith('{') || msg.message.startsWith('['))
                    ? JSON.parse(msg.message)
                    : msg.message;

                const status = messageContent?.status || msg.metadata?.status;
                return status === 'inprogress' || status === 'PENDING' || status === 'IN_PROGRESS';
              } catch {
                return false;
              }
            });

            // Update conversation item status based on message status
            dispatch(
              updateConversationItemStatus({
                id,
                status: hasInProgressMessage
                  ? CONVERSATION_ITEM_STATUS.IN_PROGRESS
                  : CONVERSATION_ITEM_STATUS.COMPLETED,
              }),
            );
          }
        } catch (err) {
          console.error('Conversation fetch failed:', err);
          if (currentId == id) {
            dispatch(
              updateLatestMessageErrorInConversation({
                msg: err.error?.data?.message || 'Failed to fetch conversation',
              }),
            );
          }
        } finally {
          if (currentId == id) {
            dispatch(setLoadingConversationData(false));
          }
        }
      },
      providesTags: (result, error, id) => [{ type: 'Conversation', id }],
    }),

    createNewConversation: builder.mutation({
      query: (data) => ({
        url: `/api/conversation`,
        method: 'POST',
        body: {
          user_id: data.user_id,
          title: data.title,
          conversation_metadata: data.conversation_metadata || { topic: data.title || '' },
        },
      }),
      async onQueryStarted(queryData, { dispatch, queryFulfilled }) {
        dispatch(setCreatingConversation(true));
        try {
          const { data } = await queryFulfilled;
          const conversationId = data?.id || data?.data?.id;
          const currentPage = queryData.conversation_metadata?.currentPage;

          if (conversationId && currentPage) {
            dispatch(
              setPageConversation({
                page: currentPage,
                conversationId,
              }),
            );
          }
        } catch (err) {
          console.error('Failed to create conversation:', err);
        } finally {
          dispatch(setCreatingConversation(false));
        }
      },
    }),

    fetchArchivedData: builder.query({
      query: ({ page = 1, limit = 100 } = {}) => ({
        url: '/api/conversation',
        params: {
          page,
          limit,
        },
      }),
      transformResponse: (response, meta, { selectedIndustryId, selectedPersonaId }) => {
        if (!response?.data)
          return {
            'This Week': [],
            'Last Week': [],
            Previous: [],
          };

        return groupConversations(response.data, selectedIndustryId, selectedPersonaId);
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Update archived conversation data
          dispatch(setArchivedConversation({ archivedConversationData: data }));

          // Check for in-progress conversations and mark them accordingly
          Object.keys(data).forEach((timeframe) => {
            data[timeframe].forEach((conversation) => {
              // Check if there's metadata indicating in-progress status
              if (
                conversation.status === 'inprogress' ||
                conversation.metadata?.status === 'inprogress' ||
                conversation.conversation_metadata?.status === 'inprogress'
              ) {
                dispatch(
                  updateConversationItemStatus({
                    id: conversation.id,
                    status: CONVERSATION_ITEM_STATUS.IN_PROGRESS,
                  }),
                );
              }
            });
          });
        } catch (err) {
          console.error('Error fetching archived data:', err);
        }
      },
      keepUnusedDataFor: 0,
      providesTags: ['Conversations', 'ArchivedData'],
    }),

    getBlobURLfromFile: builder.query({
      query: (path) => ({ url: path }),
    }),

    deleteConversationById: builder.mutation({
      query: (id) => ({
        url: `/api/conversation/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled;
          const currentPage = getState().auth.currentPage;
          dispatch(clearPageConversation(currentPage));
          dispatch(api.util.invalidateTags(['Conversations', 'ArchivedData']));
        } catch (err) {
          console.error('Error deleting conversation:', err);
        }
      },
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useAddMessageInDBMutation,
  useCheckTaskStatusesMutation,
  useGetConversationDetailsByIdQuery,
  useCreateNewConversationMutation,
  useFetchArchivedDataQuery,
  useLazyGetBlobURLfromFileQuery,
  useDeleteConversationByIdMutation,
} = conversationApi;

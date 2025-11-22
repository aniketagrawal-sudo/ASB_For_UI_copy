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
        //Need to uncomment below line once real data will come 
        // return response?.data || { messages: [] };
        return {
    "conversation_metadata": {
        "conversation_id": null,
        "currentPage": "home",
        "files": [],
        "client": 1,
        "persona": 4,
        "topic": "How does Brand 1’s promo efficiency compare to oth"
    },
    "id": 4875,
    "user_id": "dashrath.patidar@tigeranalytics.com",
    "title": "How does Brand 1’s promo efficiency compare to oth...",
    "created_by": "dashrath.patidar@tigeranalytics.com",
    "updated_by": "dashrath.patidar@tigeranalytics.com",
    "created_at": "2025-11-19T11:12:43.891Z",
    "updated_at": "2025-11-19T11:12:43.891Z",
    "messages": [
        {
            "metadata": null,
            "id": 20024,
            "conversation_id": 4875,
            "source_msg_id": null,
            "message": "How does Brand 1’s promo efficiency compare to others?",
            "message_type": "text",
            "sender_type": "user",
            "feedback_reaction": null,
            "created_by": "dashrath.patidar@tigeranalytics.com",
            "updated_by": "dashrath.patidar@tigeranalytics.com",
            "created_at": "2025-11-19T11:12:44.068Z",
            "updated_at": "2025-11-19T11:12:44.068Z",
            "files": []
        },
        {
            "metadata": {
                "status": "completed",
                "request_id": "20025",
                "original_message_id": 20025,
                "task_id": "76a9d1c0-7f69-434b-9db2-941a38a602ee",
                "updated_at": "2025-11-19T11:12:59.863Z",
                "queued_at": "2025-11-19T11:12:45.304Z",
                "api_response_on_call": {
                    "request_id": "20025",
                    "message": "Request received and processing started in the background.",
                    "status": "processing"
                },
                "agent_response": {
                    "request_id": "20025",
                    "status": "completed",
                    "elapsed_time": 14.078838586807251,
                    "result": {
                        "insight": "<p>Brand 1's promo effectiveness (difference between volume sales and base volume sales in 2024) varies by market. For example:</p><ul><li>Albuquerque: <b>4,028.66</b></li><li>Atlanta: <b>28,620.79</b></li><li>Bakersfield: <b>44,438.83</b></li><li>Charlotte: <b>102,840.71</b></li><li>Miami: <b>8,803.76</b></li></ul><p>Comparatively, Brand 2 in the same markets shows:</p><ul><li>Albuquerque: <b>1,912.43</b></li><li>Atlanta: <b>29,591.52</b></li><li>Bakersfield: <b>23,845.95</b></li><li>Charlotte: <b>128,981.04</b></li><li>Miami: <b>6,835.67</b></li></ul><p>Brand 3's numbers for same markets:</p><ul><li>Albuquerque: <b>3,341.07</b></li><li>Atlanta: <b>8,500.51</b></li><li>Bakersfield: <b>25,385.66</b></li><li>Charlotte: <b>38,882.32</b></li><li>Miami: <b>4,027.14</b></li></ul><p>Brand 4 and Brand 5's corresponding values:</p><ul><li>Brand 4, Albuquerque: <b>1,181.21</b></li><li>Brand 5, Albuquerque: <b>189.55</b></li></ul>",
                        "save_thread": true,
                        "visualization": {
                            "type": "bar",
                            "data": {
                                "labels": [
                                    "Albuquerque",
                                    "Atlanta",
                                    "Bakersfield",
                                    "Charlotte",
                                    "Miami"
                                ],
                                "datasets": [
                                    {
                                        "label": "Brand 1",
                                        "data": [
                                            4028.66,
                                            28620.79,
                                            44438.83,
                                            102840.71,
                                            8803.76
                                        ],
                                        "backgroundColor": "#2176ff"
                                    },
                                    {
                                        "label": "Brand 2",
                                        "data": [
                                            1912.43,
                                            29591.52,
                                            23845.95,
                                            128981.04,
                                            6835.67
                                        ],
                                        "backgroundColor": "#ffad05"
                                    },
                                    {
                                        "label": "Brand 3",
                                        "data": [
                                            3341.07,
                                            8500.51,
                                            25385.66,
                                            38882.32,
                                            4027.14
                                        ],
                                        "backgroundColor": "#62e8e9"
                                    }
                                ]
                            },
                            "options": {
                                "responsive": true,
                                "plugins": {
                                    "title": {
                                        "display": true,
                                        "text": "Promo Efficiency Comparison by Brand and Market (2024)"
                                    },
                                    "tooltip": {
                                        "callbacks": {
                                            "label": "function(context) { return context.dataset.label + ': ' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}); }"
                                        }
                                    },
                                    "legend": {
                                        "position": "top"
                                    }
                                },
                                "scales": {
                                    "x": {
                                        "title": {
                                            "display": true,
                                            "text": "Market"
                                        }
                                    },
                                    "y": {
                                        "title": {
                                            "display": true,
                                            "text": "Promo Effectiveness"
                                        },
                                        "ticks": {
                                            "callback": "function(value) { return value.toLocaleString(); }"
                                        }
                                    }
                                }
                            }
                        },
                        "table": [
                            {
                                "Market": "Albuquerque",
                                "Brand 1": 4028.66,
                                "Brand 2": 1912.43,
                                "Brand 3": 3341.07,
                                "Brand 4": 1181.21,
                                "Brand 5": 189.55
                            },
                            {
                                "Market": "Atlanta",
                                "Brand 1": 28620.79,
                                "Brand 2": 29591.52,
                                "Brand 3": 8500.51
                            },
                            {
                                "Market": "Bakersfield",
                                "Brand 1": 44438.83,
                                "Brand 2": 23845.95,
                                "Brand 3": 25385.66
                            },
                            {
                                "Market": "Charlotte",
                                "Brand 1": 102840.71,
                                "Brand 2": 128981.04,
                                "Brand 3": 38882.32
                            },
                            {
                                "Market": "Miami",
                                "Brand 1": 8803.76,
                                "Brand 2": 6835.67,
                                "Brand 3": 4027.14
                            }
                        ]
                    }
                },
                "updated_via": "redis_callback"
            },
            "id": 20025,
            "conversation_id": 4875,
            "source_msg_id": 20024,
            "message": "{\"insight\":\"<p>Brand 1's promo effectiveness (difference between volume sales and base volume sales in 2024) varies by market. For example:</p><ul><li>Albuquerque: <b>4,028.66</b></li><li>Atlanta: <b>28,620.79</b></li><li>Bakersfield: <b>44,438.83</b></li><li>Charlotte: <b>102,840.71</b></li><li>Miami: <b>8,803.76</b></li></ul><p>Comparatively, Brand 2 in the same markets shows:</p><ul><li>Albuquerque: <b>1,912.43</b></li><li>Atlanta: <b>29,591.52</b></li><li>Bakersfield: <b>23,845.95</b></li><li>Charlotte: <b>128,981.04</b></li><li>Miami: <b>6,835.67</b></li></ul><p>Brand 3's numbers for same markets:</p><ul><li>Albuquerque: <b>3,341.07</b></li><li>Atlanta: <b>8,500.51</b></li><li>Bakersfield: <b>25,385.66</b></li><li>Charlotte: <b>38,882.32</b></li><li>Miami: <b>4,027.14</b></li></ul><p>Brand 4 and Brand 5's corresponding values:</p><ul><li>Brand 4, Albuquerque: <b>1,181.21</b></li><li>Brand 5, Albuquerque: <b>189.55</b></li></ul>\",\"save_thread\":true,\"visualization\":{\"type\":\"bar\",\"data\":{\"labels\":[\"Albuquerque\",\"Atlanta\",\"Bakersfield\",\"Charlotte\",\"Miami\"],\"datasets\":[{\"label\":\"Brand 1\",\"data\":[4028.66,28620.79,44438.83,102840.71,8803.76],\"backgroundColor\":\"#2176ff\"},{\"label\":\"Brand 2\",\"data\":[1912.43,29591.52,23845.95,128981.04,6835.67],\"backgroundColor\":\"#ffad05\"},{\"label\":\"Brand 3\",\"data\":[3341.07,8500.51,25385.66,38882.32,4027.14],\"backgroundColor\":\"#62e8e9\"}]},\"options\":{\"responsive\":true,\"plugins\":{\"title\":{\"display\":true,\"text\":\"Promo Efficiency Comparison by Brand and Market (2024)\"},\"tooltip\":{\"callbacks\":{\"label\":\"function(context) { return context.dataset.label + ': ' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}); }\"}},\"legend\":{\"position\":\"top\"}},\"scales\":{\"x\":{\"title\":{\"display\":true,\"text\":\"Market\"}},\"y\":{\"title\":{\"display\":true,\"text\":\"Promo Effectiveness\"},\"ticks\":{\"callback\":\"function(value) { return value.toLocaleString(); }\"}}}}},\"table\":[{\"Market\":\"Albuquerque\",\"Brand 1\":4028.66,\"Brand 2\":1912.43,\"Brand 3\":3341.07,\"Brand 4\":1181.21,\"Brand 5\":189.55},{\"Market\":\"Atlanta\",\"Brand 1\":28620.79,\"Brand 2\":29591.52,\"Brand 3\":8500.51},{\"Market\":\"Bakersfield\",\"Brand 1\":44438.83,\"Brand 2\":23845.95,\"Brand 3\":25385.66},{\"Market\":\"Charlotte\",\"Brand 1\":102840.71,\"Brand 2\":128981.04,\"Brand 3\":38882.32},{\"Market\":\"Miami\",\"Brand 1\":8803.76,\"Brand 2\":6835.67,\"Brand 3\":4027.14}]}",
            "message_type": "text",
            "sender_type": "chatai",
            "feedback_reaction": null,
            "created_by": "dashrath.patidar@tigeranalytics.com",
            "updated_by": "dashrath.patidar@tigeranalytics.com",
            "created_at": "2025-11-19T11:12:44.109Z",
            "updated_at": "2025-11-19T11:12:59.863Z",
            "files": []
        }
    ]
}
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

import { api } from './api';
import {
  setThreadLoading,
  setThreadError,
  setSavedThreads,
  setActiveThreadData,
  clearThreadError,
  setRerunningState,
  setThreadResults,
  setThreadSuccess
} from '../redux/store/threadsSlice';

export const threadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    saveThread: builder.mutation({
      query: (data) => ({
        url: '/api/threads/save-thread',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          return data;
        } catch (err) {
          console.error('Save thread failed:', err);
        }
      },
    }),

    

    getUserThreads: builder.query({
      query: () => ({
        url: '/api/threads/get-user-threads',
        method: 'GET',
      }),
      transformResponse: (response) => response?.data || [],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setThreadLoading({ type: 'fetchThreads', loading: true }));
        dispatch(clearThreadError());

        try {
          const { data } = await queryFulfilled;
          dispatch(setSavedThreads(data));
          dispatch(clearThreadError());
        } catch (err) {
          dispatch(setThreadError(err.error?.data?.error || 'Failed to fetch saved threads'));
        } finally {
          dispatch(setThreadLoading({ type: 'fetchThreads', loading: false }));
        }
      },
      providesTags: ['SavedThreads'],
    }),

    addMessageFeedback: builder.mutation({
      query: ({ messageId, feedbackData }) => ({
        url: `/api/threads/messages/${messageId}/feedback`, // Example route
        method: 'PATCH',
        body: feedbackData,
      }),
      // This will automatically refetch the conversation data to get the updated feedback
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'Conversation', id: conversationId }],
    }),

    getWorkflowSteps: builder.query({
      query: (workflowId) => ({
        url: `/api/data/get-workflow-steps?workflow_id=${workflowId}`,
        method: 'GET',
      }),
      transformResponse: (response) => ({
        workflow_steps: response?.data || []
      }),
      async onQueryStarted(workflowId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(setActiveThreadData({ threadId: workflowId, data }));
          }
        } catch (err) {
          console.error('Error fetching workflow steps:', err);
          dispatch(setThreadError('Failed to load thread details'));
        }
      },
    }),
    

    rerunThread: builder.mutation({
      query: ({ workflowId, userId }) => ({
        url: `/api/threads/rerun-thread/${workflowId}`,
        method: 'POST',
        body: { user_id: userId },
      }),
      async onQueryStarted({ workflowId }, { dispatch, queryFulfilled }) {
        dispatch(setRerunningState({ threadId: workflowId, isRerunning: true }));
        dispatch(setThreadLoading({ type: 'rerunThread', loading: true }));

        try {
          const { data } = await queryFulfilled;

          // Process both workflow data and results
          if (data.data) {
            // Store the updated workflow data
            dispatch(setActiveThreadData({ threadId: workflowId, data: data.data }));
          }

          // Process the results array if available
          if (data.results && Array.isArray(data.results)) {
            // Store results in the thread metadata
            dispatch(
              setThreadResults({
                threadId: workflowId,
                results: data.results,
              }),
            );
          }

          // Set success message
          dispatch(setThreadSuccess('Thread re-run completed successfully'));
        } catch (err) {
          console.error('Error rerunning thread:', err);
          dispatch(setThreadError(err.data?.error || 'Failed to rerun thread'));
        } finally {
          dispatch(setThreadLoading({ type: 'rerunThread', loading: false }));
          dispatch(setRerunningState({ threadId: workflowId, isRerunning: false }));
        }
      },
      invalidatesTags: ['SavedThreads'],
    }),
    deleteThread: builder.mutation({
      query: ({ workflowId, userId, clientId, personaId }) => ({
        url: `/api/threads/${workflowId}`,
        method: 'DELETE',
        body: {
          userId,
          clientId,
          personaId,
        },
      }),
      // Invalidate saved threads after deletion
      invalidatesTags: ['SavedThreads'],
    }),
  }),
});

export const {
  useSaveThreadMutation,
  useGetUserThreadsQuery,
  useLazyGetWorkflowStepsQuery,
  useRerunThreadMutation,
  useDeleteThreadMutation,
  useAddMessageFeedbackMutation,
} = threadApi;

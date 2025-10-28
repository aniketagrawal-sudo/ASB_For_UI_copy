import { api } from './api';
// 1. IMPORT THE ACTION TO SET THE COUNT
import { setArtifactsCount } from '../redux/store/dashboardSlice';

export const artifactsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getArtifacts: builder.query({
      query: ({ userId, personaId }) => `/api/artifacts?userId=${userId}&personaId=${personaId}`,
      providesTags: ['Artifacts'],
    }),
    pinArtifact: builder.mutation({
      query: (artifactData) => ({
        url: '/api/artifacts',
        method: 'POST',
        body: artifactData,
      }),
      // 2. THIS NEW LOGIC RUNS AFTER THE API CALL SUCCEEDS
      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for the API call to finish
          // Get the current count from the state
          const currentCount = getState().dashboard.dashboardCount.artifacts || 0;
          // Dispatch the action to increment the count
          dispatch(setArtifactsCount(currentCount + 1));
        } catch (err) {
          console.error('Failed to update artifact count on pin:', err);
        }
      },
      invalidatesTags: ['Artifacts'],
    }),
    unpinArtifact: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/api/artifacts/${id}`,
        method: 'DELETE',
        body: { user_id: userId },
      }),
      // 3. THIS LOGIC RUNS AFTER UNPINNING SUCCEEDS
      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for the API call to finish
          // Get the current count from the state
          const currentCount = getState().dashboard.dashboardCount.artifacts || 0;
          // Dispatch the action to decrement the count, ensuring it doesn't go below zero
          dispatch(setArtifactsCount(Math.max(0, currentCount - 1)));
        } catch (err) {
          console.error('Failed to update artifact count on unpin:', err);
        }
      },
      invalidatesTags: ['Artifacts'],
    }),
  }),
});

export const {
  useGetArtifactsQuery,
  usePinArtifactMutation,
  useUnpinArtifactMutation,
} = artifactsApi;


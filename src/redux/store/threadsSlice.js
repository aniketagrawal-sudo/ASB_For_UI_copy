import { createSlice } from '@reduxjs/toolkit';
import { threadApi } from '../../services/threadApi';

// Initial state
const initialState = {
  savedThreads: [],
  activeThreadId: null,
  threadDetails: {},
  loading: {
    saveThread: false,
    fetchThreads: false,
    rerunThread: false,
  },
  error: null,
  success: null,
  rerunningThreads: {}, // Track threads being reprocessed: { workflowId: true }
};

/**
 * Thread management slice for saved conversation threads
 * Handles fetching, saving, and rerunning of user threads
 */
const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setActiveThread: (state, action) => {
      state.activeThreadId = action.payload;
    },
    clearActiveThread: (state) => {
      state.activeThreadId = null;
    },
    clearThreadError: (state) => {
      state.error = null;
    },
    clearThreadSuccess: (state) => {
      state.success = null;
    },
    clearThreadsNotification: (state) => {
      state.error = null;
      state.success = null;
    },
    setThreadLoading: (state, action) => {
      const { type, loading } = action.payload;
      if (state.loading[type] !== undefined) {
        state.loading[type] = loading;
      }
    },
    setThreadError: (state, action) => {
      state.error = action.payload;
    },
    setThreadSuccess: (state, action) => {
      state.success = action.payload;
    },
    setSavedThreads: (state, action) => {
      state.error = null;
      state.savedThreads = action.payload;
    },
    setActiveThreadData: (state, action) => {
      const { threadId, data } = action.payload;
      state.threadDetails[threadId] = data;
    },
    setRerunningState: (state, action) => {
      const { threadId, isRerunning } = action.payload;
      if (isRerunning) {
        state.rerunningThreads[threadId] = true;
      } else {
        delete state.rerunningThreads[threadId];
      }
    },
    setThreadResults: (state, action) => {
      const { threadId, results } = action.payload;

      // If the thread details don't exist yet, create an entry
      if (!state.threadDetails[threadId]) {
        state.threadDetails[threadId] = {};
      }

      // Store the results in the thread details
      state.threadDetails[threadId].results = results;

      // Also update the metadata in the saved threads list if the thread exists there
      const threadIndex = state.savedThreads.findIndex((t) => t.workflow_id === threadId);
      if (threadIndex !== -1) {
        // Create or update metadata with results
        if (!state.savedThreads[threadIndex].metadata) {
          state.savedThreads[threadIndex].metadata = {};
        }
        state.savedThreads[threadIndex].metadata.results = results;
      }
    },
    resetThreadsState: () => initialState,
  },
  // Extra reducers for RTK Query integration through the existing threadApi service
  extraReducers: (builder) => {
    // Listen for API events and update state accordingly
    builder.addMatcher(threadApi.endpoints.saveThread.matchPending, (state) => {
      state.loading.saveThread = true;
      state.error = null;
    });
    builder.addMatcher(threadApi.endpoints.saveThread.matchFulfilled, (state, action) => {
      state.loading.saveThread = false;
      state.success = 'Thread saved successfully';
      // Don't need to update savedThreads here as it will be refreshed when viewing threads
    });
    builder.addMatcher(threadApi.endpoints.saveThread.matchRejected, (state, action) => {
      state.loading.saveThread = false;
      state.error = action.payload?.error || 'Failed to save thread';
    });

    builder.addMatcher(threadApi.endpoints.getUserThreads.matchPending, (state) => {
      state.loading.fetchThreads = true;
      state.error = null;
    });
    builder.addMatcher(threadApi.endpoints.getUserThreads.matchFulfilled, (state, action) => {
      state.loading.fetchThreads = false;
      state.savedThreads = action.payload?.data || [];
    });
    builder.addMatcher(threadApi.endpoints.getUserThreads.matchRejected, (state, action) => {
      state.loading.fetchThreads = false;
      state.error = action.payload?.error || 'Failed to fetch saved threads';
    });

    builder.addMatcher(threadApi.endpoints.rerunThread.matchPending, (state, action) => {
      state.loading.rerunThread = true;
      state.error = null;
      // Add the workflowId to rerunningThreads
      const workflowId = action.meta.arg.workflowId;
      state.rerunningThreads[workflowId] = true;
    });
    builder.addMatcher(threadApi.endpoints.rerunThread.matchFulfilled, (state, action) => {
      state.loading.rerunThread = false;
      const workflowId = action.meta.arg.workflowId;

      // Update the thread in our state
      const updatedThread = action.payload.data;
      const threadIndex = state.savedThreads.findIndex((t) => t.workflow_id === workflowId);

      if (threadIndex !== -1) {
        state.savedThreads[threadIndex] = updatedThread;
      }

      // Store thread details
      state.threadDetails[workflowId] = updatedThread;

      // Remove from rerunningThreads
      delete state.rerunningThreads[workflowId];
    });
    builder.addMatcher(threadApi.endpoints.rerunThread.matchRejected, (state, action) => {
      state.loading.rerunThread = false;
      state.error = action.payload?.error || 'Failed to rerun thread';

      // Remove from rerunningThreads
      const workflowId = action.meta.arg.workflowId;
      delete state.rerunningThreads[workflowId];
    });
  },
});

// Export actions
export const {
  setActiveThread,
  clearActiveThread,
  clearThreadError,
  clearThreadSuccess,
  clearThreadsNotification,
  setThreadLoading,
  setThreadError,
  setThreadSuccess,
  setSavedThreads,
  setActiveThreadData,
  setRerunningState,
  setThreadResults,
  resetThreadsState,
} = threadsSlice.actions;

// Selectors - follow Azure best practices for performance
export const selectSavedThreads = (state) => state.threads.savedThreads;
export const selectActiveThreadId = (state) => state.threads.activeThreadId;
export const selectActiveThreadData = (state) => {
  const id = state.threads.activeThreadId;
  return id ? state.threads.threadDetails[id] : null;
};
export const selectThreadDetails = (state, threadId) => state.threads.threadDetails[threadId];
export const selectThreadsLoading = (state) => state.threads.loading;
export const selectThreadsError = (state) => state.threads.error;
export const selectThreadsSuccess = (state) => state.threads.success;
export const selectIsThreadRerunning = (state, threadId) => Boolean(state.threads.rerunningThreads[threadId]);
export const selectRerunningThreadsCount = (state) => Object.keys(state.threads.rerunningThreads).length;

// Memoized selector to get threads with rerunning status (optimized for Azure)
export const selectThreadsWithStatus = (state) => {
  return state.threads.savedThreads.map((thread) => ({
    ...thread,
    isRerunning: Boolean(state.threads.rerunningThreads[thread.workflow_id]),
  }));
};

// Memoized selector for filtered threads by search term
export const selectFilteredThreads = (state, searchTerm = '') => {
  if (!searchTerm) return state.threads.savedThreads;

  const term = searchTerm.toLowerCase();
  return state.threads.savedThreads.filter(
    (thread) => thread.workflow_name?.toLowerCase().includes(term) || thread.created_by?.toLowerCase().includes(term),
  );
};

// NEW: Selector for threads filtered by client and persona
export const selectClientPersonaFilteredThreads = (state, clientId, personaId) => {
  if (!clientId || !personaId) return state.threads.savedThreads;

  return state.threads.savedThreads.filter((thread) => {
    const threadMetadata = thread.metadata || {};
    // Check for industry/persona match (using loose equality to handle string/number comparison)
    return threadMetadata.industry == clientId && threadMetadata.persona == personaId;
  });
};

export default threadsSlice.reducer;

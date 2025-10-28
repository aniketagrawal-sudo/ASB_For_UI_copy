import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import authReducer from '../../features/auth/authSlice';
import conversationReducer from './conversationSlice';
import dashboardReducer from './dashboardSlice';
import queueReducer from './queueSlice';
import threadsReducer from './threadsSlice';
import adminReducer from './adminSlice';
// Combine all reducers

const reducers = {
  auth: authReducer,
  conversation: conversationReducer,
  dashboard: dashboardReducer,
  queue: queueReducer,
  threads: threadsReducer,
  admin: adminReducer,
};
reducers[api.reducerPath] = api.reducer;
const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
        ignoredPaths: ['_persist'], // Ignore redux-persist internal state
      },
    }).concat(api.middleware),
});

// Export store for use in auth utilities
export default store;

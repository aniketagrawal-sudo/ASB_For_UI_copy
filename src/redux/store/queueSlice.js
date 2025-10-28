import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queuedMessages: {}, // {chatId: [messageIds]}
  runningMessages: {}, // {chatId: [messageIds]}
  isPolling: false,
  messageData: {},
  activeThreadId: null,
  stopGenerating: false,
  recentlyCleared: null,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    addToQueue: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (!chatId || !messageId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      // Ensure messageId is a string for consistent comparison
      const messageIdStr = messageId.toString();

      // Initialize array if doesn't exist
      if (!state.queuedMessages[chatIdStr]) {
        state.queuedMessages[chatIdStr] = [];
      }

      // Add messageId if not already present
      if (!state.queuedMessages[chatIdStr].includes(messageIdStr)) {
        state.queuedMessages[chatIdStr].push(messageIdStr);
      }
    },

    removeFromQueue: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (!chatId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      if (state.queuedMessages[chatIdStr]) {
        if (messageId) {
          // Ensure messageId is a string
          const messageIdStr = messageId.toString();
          // Remove specific messageId
          state.queuedMessages[chatIdStr] = state.queuedMessages[chatIdStr].filter(
            (id) => id.toString() !== messageIdStr,
          );
        } else {
          // Remove all messages for this chatId
          delete state.queuedMessages[chatIdStr];
        }

        // Clean up empty arrays
        if (state.queuedMessages[chatIdStr]?.length === 0) {
          delete state.queuedMessages[chatIdStr];
        }
      }
    },

    addToRunning: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (!chatId || !messageId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      // Ensure messageId is a string for consistent comparison
      const messageIdStr = messageId.toString();

      // Initialize array if doesn't exist
      if (!state.runningMessages[chatIdStr]) {
        state.runningMessages[chatIdStr] = [];
      }

      // Check if message is already in the running queue
      if (!state.runningMessages[chatIdStr].some((id) => id.toString() === messageIdStr)) {
        state.runningMessages[chatIdStr].push(messageIdStr);
      }
    },

    removeFromRunning: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (!chatId || !messageId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      // Ensure messageId is a string for consistent comparison
      const messageIdStr = messageId.toString();

      if (state.runningMessages[chatIdStr]) {
        state.runningMessages[chatIdStr] = state.runningMessages[chatIdStr].filter(
          (id) => id.toString() !== messageIdStr,
        );

        // Clean up empty arrays
        if (state.runningMessages[chatIdStr].length === 0) {
          delete state.runningMessages[chatIdStr];
        }
      }
    },

    setActiveThread: (state, action) => {
      state.activeThreadId = action.payload;
    },

    setStopGenerating: (state, action) => {
      state.stopGenerating = action.payload;
    },

    setIsPolling: (state, action) => {
      state.isPolling = action.payload;
    },

    resetQueueState: () => initialState,

    setMessageData: (state, action) => {
      const { chatId, messageId, data } = action.payload;
      if (!chatId || !messageId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      // Ensure messageId is a string
      const messageIdStr = messageId.toString();

      if (!state.messageData[chatIdStr]) {
        state.messageData[chatIdStr] = {};
      }

      state.messageData[chatIdStr][messageIdStr] = {
        ...data,
        timestamp: new Date().toISOString(),
      };
    },

    removeMessageData: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (!chatId) return;

      // Ensure chatId is a string
      const chatIdStr = chatId.toString();

      if (state.messageData[chatIdStr]) {
        if (messageId) {
          // Ensure messageId is a string
          const messageIdStr = messageId.toString();
          delete state.messageData[chatIdStr][messageIdStr];

          // Clean up empty objects
          if (Object.keys(state.messageData[chatIdStr]).length === 0) {
            delete state.messageData[chatIdStr];
          }
        } else {
          // Remove all message data for this chatId
          delete state.messageData[chatIdStr];
        }
      }
    },

    // Modified to provide a reference-only option for conversation switching
    clearRunningForChat: (state, action) => {
      // If action.payload is an object, check for options
      if (typeof action.payload === 'object') {
        const { chatId, referenceOnly = false } = action.payload;
        if (!chatId) return;

        const chatIdStr = chatId.toString();

        if (referenceOnly) {
          // Only mark as recently cleared without actually removing from state
          // This is used when switching conversations to retain the state
          if (state.runningMessages[chatIdStr]) {
            state.recentlyCleared = {
              chatId: chatIdStr,
              messageIds: [...state.runningMessages[chatIdStr]],
              timestamp: Date.now(),
              referenceOnly: true,
            };
          }
        } else {
          // Actually clear the running messages (traditional behavior)
          if (state.runningMessages[chatIdStr]) {

            // Save the IDs before clearing to avoid re-adding them immediately
            const clearedIds = [...state.runningMessages[chatIdStr]];

            // Store the cleared IDs temporarily to prevent immediate re-addition
            state.recentlyCleared = {
              chatId: chatIdStr,
              messageIds: clearedIds,
              timestamp: Date.now(),
              referenceOnly: false,
            };

            // Delete the running messages
            delete state.runningMessages[chatIdStr];
          }
        }
      } else {
        // Backwards compatibility for string chatId
        const chatId = action.payload;
        if (!chatId) return;

        const chatIdStr = chatId.toString();

        if (state.runningMessages[chatIdStr]) {

          // Save the IDs before clearing to avoid re-adding them immediately
          const clearedIds = [...state.runningMessages[chatIdStr]];

          // Store the cleared IDs temporarily to prevent immediate re-addition
          state.recentlyCleared = {
            chatId: chatIdStr,
            messageIds: clearedIds,
            timestamp: Date.now(),
            referenceOnly: false,
          };

          // Delete the running messages
          delete state.runningMessages[chatIdStr];
        }
      }
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  addToRunning,
  removeFromRunning,
  setActiveThread,
  setStopGenerating,
  setIsPolling,
  resetQueueState,
  setMessageData,
  removeMessageData,
  clearRunningForChat,
} = queueSlice.actions;

// Update selectors to handle arrays
export const selectQueuedMessages = (state) => state.queue.queuedMessages;
export const selectRunningMessages = (state) => state.queue.runningMessages;
export const selectActiveThread = (state) => state.queue.activeThreadId;
export const selectStopGenerating = (state) => state.queue.stopGenerating;
export const selectIsPolling = (state) => state.queue.isPolling;

// Add helper selectors
export const selectQueuedMessageIds = (state, chatId) => {
  if (!chatId) return [];
  const chatIdStr = chatId.toString();
  return state.queue.queuedMessages[chatIdStr] || [];
};

export const selectRunningMessageIds = (state, chatId) => {
  if (!chatId) return [];
  const chatIdStr = chatId.toString();
  return state.queue.runningMessages[chatIdStr] || [];
};

export const selectMessageData = (state, chatId, messageId) => {
  if (!chatId || !messageId) return null;
  const chatIdStr = chatId.toString();
  const messageIdStr = messageId.toString();
  return state.queue.messageData[chatIdStr]?.[messageIdStr];
};

export const selectAllMessageData = (state, chatId) => {
  if (!chatId) return {};
  const chatIdStr = chatId.toString();
  return state.queue.messageData[chatIdStr] || {};
};

export default queueSlice.reducer;

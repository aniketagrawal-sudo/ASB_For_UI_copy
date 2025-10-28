import { createSlice } from '@reduxjs/toolkit';
import { CONVERSATION_ITEM_STATUS, MESSAGE_IDENTIFIER, MESSAGE_STATUS } from '../../utils/constants';

/** changes made
v1.1.0 :
  =>updateMessageResponseInConversation on receiving the message from socket
  =>introduced the snackbar state (toast message) to show the success and error messages
  =>moved the uiVisibility (to handle side and right panel open/close) state from conversation to redux store
  =>introduced the business content state to show the business context in a separate panel
  =>while resetConversationData added the uiVisibility state to reset the sidebar and business content panel state
  =>added reducer functions to toggle the sidebar and business content panel visibility [toggleSidebarContent, toggleBusinessContent]
  =>added the reducer functions to show and hide the snackbar [notifyViaSnackBar, closeSnackbar]
  =>added the reducer function updateConversationItemStatus to handle display spinners in sidebar
  =>added the selectors to expose the state getSnackbar, getUiVisibility, getBusinessContent
**/

export const selectThreadsCount = state => {
  const activeCount = state.conversation.conversationDetails?.length || 0;
  const archivedCount = Object.values(state.conversation.archivedConversations || {}).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  return activeCount + archivedCount;
};

const initialState = {
  id: 'new',
  conversationDetails: [],
  messageFeedback: {},
  archivedConversations: {},
  isCreatingConversation: false,
  isLoadingConversationData: false,
  isProcessingMessageCreation: false,
  showHomeScreen: true,
  activeConversation: false,
  // Original state from HEAD
  error: null,
  lastUpdated: null,
  uploadedFiles: {},
  isFeedbackEnabled: false,
  showSaveOptions: true,
  selectedMessages: [], // For save thread selection
  defaultSelectedMessages: [], // For default checkbox selection
  // New state from v1.1.0
  snackbar: {
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
    autoHideDuration: 4000,
  },
  feedbackDialog: {
    open: false,
    messageId: null, // To track which message is being commented on
  },
  currentReactionFromMap: {},
  // v1.1.0 moved the uiVisibility (to handle side and right panel open/close) state from conversation to redux store
  uiVisibility: {
    sidebarContentVisible: true,
    businessContentVisible: false,
  },
  // v1.1.0 introduced the business content state to show the business context in a separate panel
  businessContent: {
    messageId: '',
    fileurl: '',
  },
  //to handle the loading state when the conversation is new
  inprogressConversationItem: {
    id: null,
  },
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setUploadedFiles: (state, action) => {
      const { instanceId, files } = action.payload;
      state.uploadedFiles[instanceId] = files;
    },
    clearUploadedFiles: (state, action) => {
      const instanceId = action.payload;
      delete state.uploadedFiles[instanceId];
    },
    setSelectedMessages: (state, action) => {
      state.selectedMessages = action.payload;
    },

    clearSelectedMessages: (state) => {
      state.selectedMessages = [];
    },

    setDefaultSelectedMessages: (state, action) => {
      state.defaultSelectedMessages = action.payload;
    },

    clearDefaultSelectedMessages: (state) => {
      state.defaultSelectedMessages = [];
    },
    // Add this new reducer
    toggleFeedbackMode: (state) => {
      state.isFeedbackEnabled = !state.isFeedbackEnabled;
    },

    setShowSaveOptions: (state, action) => {
      state.showSaveOptions = action.payload;
      // Clear save thread selections when exiting save mode
      if (!action.payload) {
        state.selectedMessages = [];
      }
    },

    updateConversation: (state, action) => {
      const { dummyQuestion, dummyAnswer } = action.payload;
      state.conversationDetails.push(dummyQuestion);
      state.conversationDetails.push(dummyAnswer);
      state.lastUpdated = new Date().toISOString();
    },
     // ADDED: Reducers to control the feedback dialog
    openFeedbackDialog: (state, action) => {
      state.feedbackDialog.open  = {
        open: true,
        id: action.payload.id,   // <- make sure you store this
      };
      state.feedbackDialog.messageId = action.payload.messageId;
    },
    closeFeedbackDialog: (state) => {
      state.feedbackDialog.open = false;
      state.feedbackDialog.messageId = null;
    },

    // Combined implementation from both branches
    setConversationDetails: (state, action) => {
      const newDetails = action.payload;

      // If we're getting empty data but we have existing data, don't clear it immediately
      if ((!newDetails || newDetails.length === 0) && state.conversationDetails.length > 0) {
        // Keep existing data for a brief moment to prevent flickering
        return;
      }

      state.conversationDetails = newDetails;
      state.lastUpdated = new Date().toISOString();
      state.isLoadingConversationData = false;
      state.error = null;
    },
    // v1.1.0 updateMessageResponseInConversation on receiving the message from socket
    updateMessageResponseInConversation: (state, action) => {
      const responseData = action.payload;
      //once answer received from the llm update same in the conversationDetails
      //check if the answer received is for the same conversation id or not
      if (responseData?.conversation_id === state.id) {
        // Safe navigation - ensure conversations exist and have IDs
        const updateConversation = state.conversationDetails.map((conversation) => {
          // Add null/undefined check to prevent "id" property access on undefined
          if (!conversation) return conversation;

          // Check if IDs match - safely handle string vs number comparison
          const conversationId = String(conversation.id || '');
          const responseId = String(responseData.message_id || '');

          if (conversationId === responseId) {

            // Handle both AI and user message updates
            const updatedConversation = {
              ...conversation,
              metadata: {
                ...conversation.metadata,
                status: responseData.status,
                ...(responseData.metadata && responseData.metadata),
              },
            };

            // Update content for AI messages - handle different content sources
            if (responseData.content !== undefined && responseData.content !== null && responseData.content !== '') {
              updatedConversation.message = responseData.content;
            }
            // ENHANCED: Handle messageData (original parsed message structure) first
            else if (responseData.messageData) {
              updatedConversation.message = responseData.message || conversation.message;

              // Extract and handle result from messageData
              if (responseData.messageData.result) {
                let result = responseData.messageData.result;

                // Parse double-encoded JSON result
                if (typeof result === 'string') {
                  try {
                    result = JSON.parse(result);
                  } catch {
                    // Keep as string if parsing fails
                  }
                }

                // Handle file URLs in result
                if (result && typeof result === 'object' && result.file_url) {
                  if (!updatedConversation.files) {
                    updatedConversation.files = [];
                  }
                  // Check if file already exists to avoid duplicates
                  const fileExists = updatedConversation.files.some((f) => f.file_url === result.file_url);
                  if (!fileExists) {
                    updatedConversation.files.push({
                      file_name: 'Generated Report',
                      file_url: result.file_url,
                      ...result,
                    });
                  }
                }
              }
            }
            // ENHANCED: Handle parsed result data with file URLs
            else if (responseData.parsedResult) {
              if (responseData.parsedResult.file_url) {
                // For file responses, use the original message structure but ensure files are included
                updatedConversation.message = responseData.message || conversation.message;
                // Add file information to the files array
                if (!updatedConversation.files) {
                  updatedConversation.files = [];
                }
                // Check if file already exists to avoid duplicates
                const fileExists = updatedConversation.files.some(
                  (f) => f.file_url === responseData.parsedResult.file_url,
                );
                if (!fileExists) {
                  updatedConversation.files.push({
                    file_name: 'Generated Report',
                    file_url: responseData.parsedResult.file_url,
                    ...responseData.parsedResult,
                  });
                }
              } else if (responseData.parsedResult.insight) {
                updatedConversation.message = responseData.parsedResult.insight;
              } else if (typeof responseData.parsedResult === 'object') {
                updatedConversation.message = JSON.stringify(responseData.parsedResult, null, 2);
              } else {
                updatedConversation.message = String(responseData.parsedResult);
              }
            }
            // Fallback: try to extract content from result if main content is missing
            else if (responseData.result) {
              if (typeof responseData.result === 'string') {
                updatedConversation.message = responseData.result;
              } else if (responseData.result.insight) {
                updatedConversation.message = responseData.result.insight;
              } else if (responseData.result.content) {
                updatedConversation.message = responseData.result.content;
              } else if (typeof responseData.result === 'object') {
                // Try to stringify the result object if it's structured data
                updatedConversation.message = JSON.stringify(responseData.result, null, 2);
              }
            }

            // Update files if provided (typically for user messages after backend processing)
            if (responseData.files && Array.isArray(responseData.files)) {
              updatedConversation.files = responseData.files;
            }

            return updatedConversation;
          }
          return conversation;
        });
        state.conversationDetails = updateConversation;
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Keep addConversation as an alias for setConversationDetails for backward compatibility
    addConversation: (state, action) => {
      state.conversationDetails = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    updateConvesationId: (state, action) => {
      state.id = action.payload;
      if (action.payload === 'new') {
        state.conversationDetails = [];
      }
    },

    resetConversationData: (state) => {
      state.id = 'new';
      state.conversationDetails = [];
      // From HEAD
      state.error = null;
      state.lastUpdated = new Date().toISOString();
      state.showSaveOptions = false;
      state.selectedMessages = [];
      state.defaultSelectedMessages = [];
      state.uploadedFiles = {};
      // From v1.1.0
      state.uiVisibility = {
        ...state.uiVisibility,
        sidebarContentVisible: true,
        businessContentVisible: false,
      };
    },

    // Keep the original implementation here but add more comprehensive status update
    updateLatestMessageErrorInConversation: (state, action) => {
      const { msg } = action.payload;
      const errorMsg = msg || 'Unknown error';

      state.conversationDetails = state.conversationDetails.map((message) => {
        if (message.id?.includes(MESSAGE_IDENTIFIER.USER_MESSAGE_IDENTIFIER)) {
          return {
            ...message,
            isError: true,
            errMsg: errorMsg,
          };
        }
        if (message.id === MESSAGE_IDENTIFIER.AI_MESSAGE_IDENTIFIER) {
          return {
            ...message,
            metadata: {
              ...message.metadata,
              status: MESSAGE_STATUS.IN_PROGRESS,
            },
          };
        }
        return message;
      });

      state.error = errorMsg;
      state.lastUpdated = new Date().toISOString();
    },

    setCreatingConversation: (state, action) => {
      state.isCreatingConversation = action.payload;
    },

    setLoadingConversationData: (state, action) => {
      state.isLoadingConversationData = action.payload;
    },

    setMessageCreaionProcessing: (state, action) => {
      state.isProcessingMessageCreation = action.payload;
    },

    setShowHomeScreen: (state, action) => {
      state.showHomeScreen = action.payload;
    },

    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      // Clear selections when switching conversations
      if (!action.payload) {
        state.selectedMessages = [];
        state.defaultSelectedMessages = [];
      }
    },

    setArchivedConversation: (state, action) => {
      state.archivedConversations = action.payload.archivedConversationData;
    },

    clearError: (state) => {
      state.error = null;
    },

    // v1.1.0 added reducer functions to toggle the sidebar and business content panel visibility
    toggleSidebarContent: (state) => {
      state.uiVisibility = {
        ...state.uiVisibility,
        sidebarContentVisible: !state.uiVisibility.sidebarContentVisible,
        businessContentVisible:
          state.uiVisibility.sidebarContentVisible === false ? false : state.uiVisibility.businessContentVisible,
      };
    },

    toggleBusinessContent: (state, action) => {
      if (action.payload) {
        const { blobUrl, messageid } = action.payload;
        state.businessContent = {
          ...state.businessContent,
          fileurl: blobUrl,
          messageId: messageid,
        };
      }
      //if the business context is open, close the sidebar content automatically
      state.uiVisibility = {
        ...state.uiVisibility,
        sidebarContentVisible:
          state.uiVisibility.businessContentVisible === false ? false : state.uiVisibility.sidebarContentVisible,
        businessContentVisible: !state.uiVisibility.businessContentVisible,
      };
    },

    // v1.1.0 added the reducer function updateConversationItemStatus to handle display spinners in sidebar
    updateConversationItemStatus: (state, action) => {
      const { id, status } = action.payload;
      if (status === CONVERSATION_ITEM_STATUS.IN_PROGRESS) {
        state.inprogressConversationItem.id = id;
      } else {
        state.inprogressConversationItem.id = null;
      }
      //find the conversation item from archived conversations and upate its status to status received
      if (state.archivedConversations && Object.keys(state.archivedConversations).length > 0) {
        for (const convCategory in state.archivedConversations) {
          state.archivedConversations[convCategory] = state.archivedConversations[convCategory].map(
            (conversationItem) => {
              if (parseInt(conversationItem.id) == parseInt(id)) {
                return {
                  ...conversationItem,
                  status,
                };
              }
              return conversationItem;
            },
          );
        }
      }
    },

    // v1.0.0 added the reducer functions to show and hide the snackbar
    notifyViaSnackBar: (state, action) => {
      const { open, message, severity } = action.payload;
      state.snackbar = {
        ...state.snackbar,
        open,
        message,
        severity,
      };
    },

    closeSnackBar: (state) => {
      state.snackbar = {
        ...state.snackbar,
        open: false,
      };

      
    },
     // ✅ Feedback storage
    addOrUpdateMessageFeedback: (state, action) => {
      const { messageId, reaction, comment } = action.payload;
      if (!state.messageFeedback) {
        state.messageFeedback = {};   // ensure object exists
      }
      state.messageFeedback[messageId] = { reaction, comment };
      const message = state.conversationDetails.find(msg => msg.id === messageId);
      if (message) {
        message.feedback_reaction = reaction;
      }

    },
    deleteMessageFeedback: (state, action) => {
      const messageId = action.payload;
      delete state.messageFeedback[messageId];
      const message = state.conversationDetails.find(msg => msg.id === messageId);
      if (message) {
        message.feedback_reaction = null;
      }
    },
  },
});


// Selectors
export const getConversationDetails = (state) => state.conversation.conversationDetails;
export const getConversationId = (state) => state.conversation.id;
export const getIsCreatingConversation = (state) => state.conversation.isCreatingConversation;
export const getIsLoadingConversationData = (state) => state.conversation.isLoadingConversationData;
export const getShowHomeScreen = (state) => state.conversation.showHomeScreen;
export const getActiveConversation = (state) => state.conversation.activeConversation;
export const getArchivedConversation = (state) => state.conversation.archivedConversations;
export const getMessageCreationLoading = (state) => state.conversation.isProcessingMessageCreation;
export const selectIsFeedbackEnabled = (state) => state.conversation.isFeedbackEnabled;
export const selectFeedbackDialog = (state) => state.conversation.feedbackDialog;



// Selectors from HEAD
export const getConversationError = (state) => state.conversation.error;
export const getLastUpdated = (state) => state.conversation.lastUpdated;
export const getSelectedMessages = (state) => state.conversation.selectedMessages;
export const getDefaultSelectedMessages = (state) => state.conversation.defaultSelectedMessages;
export const getUploadedFiles = (state) => state.conversation.uploadedFiles;
export const getShowSaveOptions = (state) => state.conversation.showSaveOptions;

// v1.1.0 added selectors
export const selectSnackbar = (state) => state.conversation.snackbar;
export const getUiVisibility = (state) => state.conversation.uiVisibility;
export const getBusinessContent = (state) => state.conversation.businessContent;

// Actions
export const {
  updateConversation,
  setConversationDetails,
  updateConvesationId,
  resetConversationData,
  updateLatestMessageErrorInConversation,
  setCreatingConversation,
  setLoadingConversationData,
  setMessageCreaionProcessing,
  setShowHomeScreen,
  setActiveConversation,
  setArchivedConversation,
  toggleFeedbackMode, 
  // From HEAD
  clearError,
  setSelectedMessages,
  clearSelectedMessages,
  setDefaultSelectedMessages,
  clearDefaultSelectedMessages,
  setUploadedFiles,
  clearUploadedFiles,
  setShowSaveOptions,
  // From v1.1.0
  addConversation,
  notifyViaSnackBar,
  closeSnackBar,
  addOrUpdateMessageFeedback,
  deleteMessageFeedback,
  toggleSidebarContent,
  toggleBusinessContent,
  updateConversationItemStatus,
  updateMessageResponseInConversation,
  openFeedbackDialog,
  closeFeedbackDialog,

} = conversationSlice.actions;

export default conversationSlice.reducer;

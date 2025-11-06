import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import ChatBotIcon from '../../assets/conversationDashboard/chatbot-speech-bubble.svg';
import ChatHistoryIcon from '../../assets/conversationDashboard/ChatHistoryIcon.svg';
import MaxsimizeIcon from '../../assets/conversationDashboard/MaxsimizeIcon.svg';


import ForumIcon from '../../assets/conversationDashboard/ThreadsIcon.png';
import {
  selectUser,
  selectCurrentPage,
  selectCurrentPageConversation,
  clearPageConversation,
  selectSelectedRole,
  selectSelectedIndustry,
} from '../../features/auth/authSlice';
import ChatInput from '../ChatInput/ChatInput';
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage';
import ConversationScreen from '../ConversationScreen/ConversationScreen';
import { useFetchArchivedDataQuery } from '../../services/conversationApi';
import { useSaveThreadMutation } from '../../services/threadApi';
import ThreadsPanel from '../ThreadsPanel/ThreadsPanel';
import classes from './ConversationDashboard.module.scss';
import { getSocket, initSocket, isSocketConnected } from '../../utils/socket';
import keycloak from '../../utils/keycloak';
import FeedbackDialog from '../FeedbackDialog/FeedbackDialog';
import {
  notifyViaSnackBar,
  toggleFeedbackMode,
  selectIsFeedbackEnabled,
  selectSnackbar,
  closeSnackBar,
  setShowSaveOptions,
  getSelectedMessages,
  clearSelectedMessages,
  getConversationDetails,
  resetConversationData,
  setActiveConversation,
  getMessageCreationLoading,
} from '../../redux/store/conversationSlice';

/**
 * ConversationDashboard - Main conversation interface with Azure WebSocket optimizations
 */
function ConversationDashboard() {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const user = useSelector(selectUser);
  const userName = useMemo(() => user?.given_name || user?.name?.split(' ')[0] || 'there', [user]);
  const activeConversationId = useSelector(selectCurrentPageConversation);
  const chatInputRef = useRef(null);
  const componentMountedRef = useRef(true);
  const selectedRole = useSelector(selectSelectedRole);
  const selectedIndustry = useSelector(selectSelectedIndustry);
  const selectedIndustryId = user?.industries?.find((i) => i.name === selectedIndustry)?.id;
  const selectedPersonaId = user?.industries
    ?.find((i) => i.name === selectedIndustry)
    ?.personas?.find((p) => p.name === selectedRole)?.id;

  // Socket connection state
  const socket = getSocket();
  const [socketConnected, setSocketConnected] = useState(isSocketConnected());
  const connectAttemptRef = useRef(0);

  const [isThreadsPanelOpen, setIsThreadsPanelOpen] = useState(false);
  const snackbar = useSelector(selectSnackbar);

  // --- Start: Logic for Save Thread functionality ---
  const selectedMessages = useSelector(getSelectedMessages);
  const conversationDetails = useSelector(getConversationDetails);
  const isProcessingMessage = useSelector(getMessageCreationLoading);

  const [saveThread, { isLoading: isSaving, error: saveError }] = useSaveThreadMutation();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [threadName, setThreadName] = useState('');

  const handleNewChat = useCallback(() => {
    dispatch(clearPageConversation(currentPage));
    dispatch(resetConversationData());
    dispatch(setActiveConversation(false));
    dispatch(clearSelectedMessages());
  }, [dispatch, currentPage]);

  const handleSaveClick = () => {
    if (!selectedMessages.length) return;
    const failingMessages = selectedMessages.filter((msgId) => {
      const msg = conversationDetails.find((m) => String(m.id) === String(msgId));
      const saveThreadValue = msg?.metadata?.agent_response?.result?.save_thread;
      return saveThreadValue !== true;
    });

    if (failingMessages.length === 0) {
      setSaveDialogOpen(true);
    } else {
      dispatch(
        notifyViaSnackBar({
          message: `A thread can only be created from structured data.`,
          severity: 'warning',
          open: true,
        }),
      );
    }
  };

  const handleCancelSelect = () => {
    dispatch(clearSelectedMessages());
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
    setThreadName('');
  };

  const handleSaveConfirm = async () => {
    if (!threadName.trim() || selectedMessages.length === 0) return;
    try {
      const threadData = {
        thread_name: threadName.trim(),
        message_ids: selectedMessages,
        user_id: String(user?.userId),
        chat_id: activeConversationId,
        industry: selectedIndustryId,
        persona: selectedPersonaId,
        screen_type: currentPage,
      };
      await saveThread(threadData).unwrap();
      setSaveDialogOpen(false);
      dispatch(clearSelectedMessages());
      handleNewChat();
      setThreadName('');
      dispatch(
        notifyViaSnackBar({
          message: 'Thread saved successfully!',
          severity: 'success',
          open: true,
        }),
      );
    } catch (error) {
      console.error('Error saving thread:', error);
      dispatch(
        notifyViaSnackBar({
          message: 'Failed to save thread. Please try again.',
          severity: 'error',
          open: true,
        }),
      );
    }
  };
  // --- End: Logic for Save Thread functionality ---

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackBar());
  };

  const isFeedbackEnabled = useSelector(selectIsFeedbackEnabled);
  const handleFeedbackToggle = () => {
    dispatch(toggleFeedbackMode());
  };

  const { data: archivedData } = useFetchArchivedDataQuery(
    { page: 1, limit: 4, selectedIndustryId, selectedPersonaId },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (!socket && keycloak?.token) {
      initSocket(keycloak.token);
    }
    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    setSocketConnected(socket.connected);
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  const previousQueries = useMemo(() => {
    if (!archivedData) return [];
    const allConversations = [
      ...(archivedData['This Week'] || []),
      ...(archivedData['Last Week'] || []),
      ...(archivedData['Previous'] || []),
    ];
    return allConversations
      .filter((conv) => conv.conversation_metadata?.currentPage === currentPage && conv.title?.trim())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4)
      .map((conv) => ({
        id: conv.id,
        question: conv.title.trim().replace(/\.\.\.$/, ''),
        timestamp: conv.created_at,
        metadata: conv.conversation_metadata,
      }));
  }, [archivedData, currentPage]);

  const handleThreadsClick = useCallback(() => setIsThreadsPanelOpen(true), []);
  const handleThreadsPanelClose = useCallback(() => setIsThreadsPanelOpen(false), []);
  const handleQuerySelect = useCallback(
    (query) => {
      if (chatInputRef.current) {
        chatInputRef.current.setInputValue(query);
        dispatch(clearPageConversation(currentPage));
      }
    },
    [dispatch, currentPage],
  );

  // ✨ START: Added handler for suggested questions
  const handleSuggestedQuestionClick = useCallback((query) => {
    if (chatInputRef.current) {
      // Set the input field value
      chatInputRef.current.setInputValue(query);

      // Auto-submit the question if the function is available on the ChatInput component
      if (typeof chatInputRef.current.submitInput === 'function') {
        chatInputRef.current.submitInput(query);
      }
    }
  }, []);
  // ✨ END: Added handler for suggested questions

  const conversationKey = `conversation-${activeConversationId || 'new'}-${currentPage}`;
  const renderContent = useMemo(() => {
    if (!activeConversationId) {
      return (
        <div className={classes.chatArea}>
          <WelcomeMessage
            userName={userName}
            previousQueries={previousQueries.map((q) => q.question)}
            onQuerySelect={handleQuerySelect}
            personaId={selectedPersonaId}
            screenType={currentPage}
          />
        </div>
      );
    }
    return (
      <div className={classes.conversationArea}>
        {!socketConnected && (
          <Alert severity="warning" sx={{ m: 1, p: 0.5, fontSize: '0.75rem', borderRadius: 1 }}>
            Real-time updates unavailable
          </Alert>
        )}
        {/* ✨ Pass the handler function as a prop */}
        <ConversationScreen
          id={String(activeConversationId)}
          stableInstanceId="main-dashboard"
          key={conversationKey}
          onSuggestedQuestionClick={handleSuggestedQuestionClick}
        />
      </div>
    );
  }, [activeConversationId, userName, previousQueries, handleQuerySelect, socketConnected, conversationKey, handleSuggestedQuestionClick]); // ✨ Added handler to dependency array

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.titleSection}>
          <img src={ChatBotIcon} alt="Chat AI" />
          <Typography variant="h6" className={classes.title}>
            Chat AI
          </Typography>
        </div>
        <div className={classes.headerActions}>
          {selectedMessages.length > 0 && (
            <div className={classes.saveActions}>
              <Button
                className={classes.confirmSaveButton}
                onClick={handleSaveClick}
                startIcon={<SaveIcon />}
                disabled={!selectedMessages.length}
                size="small"
                variant="contained"
                sx={{ textTransform: 'none' }}>
                Create Thread ({selectedMessages.length})
              </Button>
              <Button
                className={classes.cancelButton}
                onClick={handleCancelSelect}
                startIcon={<CancelIcon />}
                size="small"
                sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
            </div>
          )}
          <Box className={classes.threadButton} onClick={handleThreadsClick}>
            <img src={ChatHistoryIcon} alt="ChatHistoryIcon" />
            <img src={MaxsimizeIcon} alt="MaxsimizeIcon" />
          </Box>
        </div>
      </div>
      {renderContent}
      <div className={classes.inputArea}>
        <ChatInput ref={chatInputRef} instanceId="dashboard"  onResetConversation={handleNewChat}  />
      </div>
      {isThreadsPanelOpen && (
        <ThreadsPanel
          open={isThreadsPanelOpen}
          onClose={handleThreadsPanelClose}
          userName={userName}
          previousQueries={previousQueries.map((q) => q.question)}
          onQuerySelect={handleQuerySelect}
        />
      )}
      <FeedbackDialog />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration || 4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose} className={classes.saveDialog}>
        <DialogTitle>Save Selected Messages as Thread</DialogTitle>
        <DialogContent>
          {saveError && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              Could not save thread. Please try again.
            </Typography>
          )}
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Thread Name"
            value={threadName}
            onChange={(e) => setThreadName(e.target.value)}
            placeholder="Enter a name for your thread"
            variant="outlined"
            disabled={isSaving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose} disabled={isSaving} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveConfirm}
            disabled={!threadName.trim() || isSaving}
            variant="contained"
            sx={{ textTransform: 'none' }}>
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConversationDashboard;
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Pagination,
} from '@mui/material';
import HomeIcon from '../../assets/Sidepanel/Home.png';
import ReportsIcon from '../../assets/Sidepanel/reports.png';
import InsightsIcon from '../../assets/Sidepanel/Insights.png';
import ThreadsIcon from '../../assets/Sidepanel/threads.png';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import {
  resetConversationData,
  getConversationDetails,
  setCreatingConversation,
  notifyViaSnackBar,
} from '../../redux/store/conversationSlice';
import {
  clearPageConversation,
  selectCurrentPage,
  selectUser,
  selectSelectedRole,
  selectSelectedIndustry,
} from '../../features/auth/authSlice';
import { useFetchArchivedDataQuery, useDeleteConversationByIdMutation } from '../../services/conversationApi';
import classes from './Sidebar.module.scss';
import PropTypes from 'prop-types';

const ITEMS_PER_PAGE = 10;

const getIconForPage = (page) => {
  switch (page?.toLowerCase()) {
    case 'home':
      return <img src={HomeIcon} alt="Home" className={classes.menuIconImage} />;
    case 'reports':
      return <img src={ReportsIcon} alt="Reports" className={classes.menuIconImage} />;
    case 'insight':
      return <img src={InsightsIcon} alt="Insights" className={classes.menuIconImage} />;
    case 'threads':
      return <img src={ThreadsIcon} alt="Threads" className={classes.menuIconImage} />;
    case 'gallery':
      return <CollectionsIcon className={classes.menuIconImage} />;
    default:
      return <img src={ThreadsIcon} alt="Chat" className={classes.menuIconImage} />;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};

// Utility function to generate a better chat title
const generateChatTitle = (chat) => {

  // Primary: Use the latest USER message content from API response
  // Backend filters to only include user messages, not AI responses
  const latestUserMessage = chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;
  if (latestUserMessage && latestUserMessage.message && latestUserMessage.message.trim()) {
    let content = latestUserMessage.message.trim();
    
    // Skip JSON formatted messages (these are system/AI generated)
    if (content.startsWith('{') && content.endsWith('}')) {
      // Skip this message and continue to fallbacks
    } else {
      // Clean the content more intelligently
      content = content
        .replace(/^(user:|ai:|assistant:|system:)/i, '') // Remove prefixes
        .replace(/^\d+\.\s*/, '') // Remove numbering like "1. "
        .replace(/^[-*]\s*/, '') // Remove bullet points
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\r+/g, ' ') // Replace carriage returns with spaces
        .trim();
      
      // If content is meaningful, use it as the title
      if (content.length > 1) {
        // Truncate if too long and add ellipsis
        const result = content.length > 50 ? `${content.substring(0, 50)}...` : content;
        
        return result;
      }
    }
  }

  // Secondary: If there's a custom title that's different from topic, use it
  if (chat.title && 
      chat.title !== 'New chat' && 
      chat.title.trim() && 
      chat.title !== chat.conversation_metadata?.topic) {
    return chat.title;
  }
  
  // Tertiary: Use topic from metadata with enhanced cleaning
  const topic = chat.conversation_metadata?.topic;
  if (topic && topic.trim()) {
    // Clean and format the topic more aggressively
    let cleanTopic = topic
      .replace(/^(user:|ai:|assistant:)/i, '') // Remove prefixes
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/^(how|what|where|when|why|can|could|would|should|will|do|does|did|is|are|was|were|have|has|had)\s+/i, '') // Remove question words
      .replace(/[?!.]+$/, '') // Remove trailing punctuation
      .trim();
    
    // If topic is meaningful after cleaning, use it
    if (cleanTopic.length > 5) {
      // Capitalize first letter
      cleanTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
      return cleanTopic.length > 50 ? `${cleanTopic.substring(0, 50)}...` : cleanTopic;
    }
  }
  
  // Generate contextual title based on updated date
  if (chat.updated_at) {
    const updatedDate = new Date(chat.updated_at);
    const now = new Date();
    const diffMinutes = (now - updatedDate) / (1000 * 60);
    
    if (diffMinutes < 5) {
      return 'Recent conversation';
    } else if (diffMinutes < 60) {
      return `Chat ${Math.floor(diffMinutes)}m ago`;
    } else if (diffMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffMinutes / 60);
      return `Chat ${hours}h ago`;
    } else {
      const options = { month: 'short', day: 'numeric' };
      if (updatedDate.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
      }
      return `Chat from ${updatedDate.toLocaleDateString('en-US', options)}`;
    }
  }
  
  // Final fallback
  return 'Untitled Chat';
};

const SidebarSkeleton = () => (
  <div className={classes.sidebar}>
    <div className={classes.sidebarHeader}>
      <Skeleton variant="text" width={200} height={32} />
    </div>
    <div className={classes.newChatContainer}>
      <Skeleton variant="rectangular" height={36} className={classes.newChatButton} />
    </div>
    <div className={classes.content}>
      {/* This Week Section */}
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <Skeleton variant="text" width={80} height={24} />
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={classes.chatItem}>
            <Skeleton variant="circular" width={24} height={24} className={classes.chatIcon} />
            <div className={classes.chatText} style={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </div>
          </div>
        ))}
      </div>

      <Divider className={classes.sectionDivider} />

      {/* Last Week Section */}
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <Skeleton variant="text" width={80} height={24} />
        </div>
        {[...Array(2)].map((_, index) => (
          <div key={index} className={classes.chatItem}>
            <Skeleton variant="circular" width={24} height={24} className={classes.chatIcon} />
            <div className={classes.chatText} style={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="30%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Sidebar = ({ onChatItemClick, isMenuMode = false, onNewChat }) => {
  const dispatch = useDispatch();
  const [isButtonProcessing, setIsButtonProcessing] = useState(false);
  const [deleteConversation] = useDeleteConversationByIdMutation();
  const conversationDetails = useSelector(getConversationDetails);
  const currentPage = useSelector(selectCurrentPage);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [deletingChatIds, setDeletingChatIds] = useState([]);
  const [deletingSections, setDeletingSections] = useState([]);
  const currentUser = useSelector(selectUser);
  const selectedRole = useSelector(selectSelectedRole);
  const selectedIndustry = useSelector(selectSelectedIndustry);
  const selectedIndustryId = currentUser?.industries?.find((i) => i.name === selectedIndustry)?.id;
  const selectedPersonaId = currentUser?.industries
    ?.find((i) => i.name === selectedIndustry)
    ?.personas?.find((p) => p.name === selectedRole)?.id;
  // Modify the chat click handler
  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
    onChatItemClick(chatId);
  };

  const [currentPages, setCurrentPages] = useState({
    'This Week': 1,
    'Last Week': 1,
    Previous: 1,
  });

  const {
    data: conversations,
    isLoading,
    error,
    refetch: refetchConversations,
  } = useFetchArchivedDataQuery(
    {
      page: 1,
      limit: 100,
      selectedIndustryId,
      selectedPersonaId,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true, // Add this to refetch when window gets focus
    },
  );

  useEffect(() => {
    if (conversationDetails) {
      refetchConversations();
    }
  }, [conversationDetails, refetchConversations]);

  const getPaginatedConversations = useCallback(
    (section) => {
      if (!conversations || !conversations[section]) return { items: [], total: 0 };

      // Sort conversations by updated_at timestamp (most recent first)
      const sortedItems = [...conversations[section]].sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB - dateA; // Descending order (newest first)
      });

      const startIndex = (currentPages[section] - 1) * ITEMS_PER_PAGE;
      const paginatedItems = sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      return {
        items: paginatedItems,
        total: Math.ceil(sortedItems.length / ITEMS_PER_PAGE),
      };
    },
    [conversations, currentPages],
  );

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    try {
      // Add to deletingChatIds to show loading
      setDeletingChatIds((prev) => [...prev, chatId]);

      await deleteConversation(chatId).unwrap();
      const chat = Object.values(conversations || {})
        .flat()
        .find((c) => c.id === chatId);

      if (chat?.conversation_metadata?.currentPage) {
        dispatch(clearPageConversation(chat.conversation_metadata.currentPage));
      }
      refetchConversations();

      dispatch(
        notifyViaSnackBar({
          message: 'Conversation deleted successfully',
          severity: 'success',
          open: true,
        }),
      );
    } catch (err) {
      console.error('Delete failed:', err);
      dispatch(
        notifyViaSnackBar({
          message: 'Failed to delete conversation',
          severity: 'error',
          open: true,
        }),
      );
    } finally {
      // Remove from deletingChatIds when done
      setDeletingChatIds((prev) => prev.filter((id) => id !== chatId));
    }
  };

  // Updated to delete ALL conversations in a section, not just the paginated ones
  const handleDeleteSection = async (section) => {
    try {
      // Add section to deletingSections
      setDeletingSections((prev) => [...prev, section]);

      // Get ALL conversations in this section, not just the paginated ones
      const allSectionConversations = conversations[section] || [];

      for (const chat of allSectionConversations) {
        await deleteConversation(chat.id).unwrap();
        if (chat?.conversation_metadata?.currentPage) {
          dispatch(clearPageConversation(chat.conversation_metadata.currentPage));
        }
      }
      refetchConversations();

      dispatch(
        notifyViaSnackBar({
          message: `All ${section.toLowerCase()} conversations deleted successfully`,
          severity: 'success',
          open: true,
        }),
      );
    } catch (err) {
      console.error('Bulk delete failed:', err);
      dispatch(
        notifyViaSnackBar({
          message: 'Failed to delete conversations',
          severity: 'error',
          open: true,
        }),
      );
    } finally {
      // Remove section from deletingSections when done
      setDeletingSections((prev) => prev.filter((s) => s !== section));
    }
  };

  const handleNewChat = useCallback(() => {
    if (isButtonProcessing) return;
    setIsButtonProcessing(true);
    try {
      setSelectedChatId(null); // Clear selection
      if (onNewChat) onNewChat();
      dispatch(setCreatingConversation(true));
      dispatch(clearPageConversation(currentPage));
      dispatch(resetConversationData());
      refetchConversations();
    } finally {
      dispatch(setCreatingConversation(false));
      setIsButtonProcessing(false);
    }
  }, [dispatch, isButtonProcessing, onNewChat, currentPage, refetchConversations]);

  const handlePageChange = (section, value) => {
    setCurrentPages((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const renderChatItems = (section) => {
    const { items: sectionConversations, total: totalPages } = getPaginatedConversations(section);
    if (!sectionConversations?.length) return null;

    // Check if this section is currently being deleted
    const isSectionDeleting = deletingSections.includes(section);

    return (
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <Typography variant="subtitle2" className={classes.sectionTitle}>
            {section}
          </Typography>
          {sectionConversations.length > 0 && (
            <IconButton
              onClick={() => handleDeleteSection(section)} // Changed to pass only the section name
              className={classes.deleteAllButton}
              size="small"
              disabled={isSectionDeleting}
              title={`Delete all ${section.toLowerCase()}`}>
              {isSectionDeleting ? <CircularProgress size={16} thickness={4} /> : <DeleteSweepIcon fontSize="small" />}
            </IconButton>
          )}
        </div>
        <List>
          {sectionConversations.map((chat) => {
            // Check if this chat is currently being deleted
            const isDeleting = deletingChatIds.includes(chat.id);

            return (
              <ListItem
                key={chat.id}
                button
                onClick={() => handleChatClick(chat.id)}
                className={`${classes.chatItem} ${selectedChatId === chat.id ? classes.selected : ''}`}
                disabled={isDeleting}>
                <ListItemIcon className={classes.chatIcon}>
                  {getIconForPage(chat.conversation_metadata?.currentPage)}
                </ListItemIcon>
                <ListItemText
                  primary={generateChatTitle(chat)}
                  secondary={formatTimestamp(chat.updated_at)}
                  className={classes.chatText}
                />
                <IconButton
                  onClick={(e) => handleDelete(chat.id, e)}
                  className={classes.deleteButton}
                  size="small"
                  disabled={isDeleting}
                  title="Delete conversation">
                  {isDeleting ? <CircularProgress size={16} thickness={4} /> : <DeleteOutlineIcon fontSize="small" />}
                </IconButton>
              </ListItem>
            );
          })}
        </List>
        {totalPages > 1 && (
          <div className={classes.paginationContainer}>
            <Pagination
              count={totalPages}
              page={currentPages[section]}
              onChange={(_, value) => handlePageChange(section, value)}
              size="small"
              className={classes.pagination}
            />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <SidebarSkeleton />;
  if (error) return <div className={classes.error}>Error loading conversations</div>;

  return (
    <div className={`${classes.sidebar} ${isMenuMode ? classes.menuMode : ''}`}>
      <div className={classes.sidebarHeader}>
        <Typography variant="h6" className={classes.sidebarTitle}>
          Previous Conversations
        </Typography>
      </div>

      <div className={classes.newChatContainer}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          disabled={isButtonProcessing}
          className={classes.newChatButton}>
          {isButtonProcessing ? <CircularProgress size={20} /> : 'New Conversation'}
        </Button>
      </div>

      <div className={classes.content}>
        {!conversations || Object.values(conversations).every((group) => !group?.length) ? (
          <div className={classes.noData}>No conversations found</div>
        ) : (
          <>
            {renderChatItems('This Week')}
            {conversations['Last Week']?.length > 0 && (
              <>
                <Divider className={classes.sectionDivider} />
                {renderChatItems('Last Week')}
              </>
            )}
            {conversations['Previous']?.length > 0 && (
              <>
                <Divider className={classes.sectionDivider} />
                {renderChatItems('Previous')}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onChatItemClick: PropTypes.func.isRequired,
  isMenuMode: PropTypes.bool,
  onNewChat: PropTypes.func,
};

export default Sidebar;

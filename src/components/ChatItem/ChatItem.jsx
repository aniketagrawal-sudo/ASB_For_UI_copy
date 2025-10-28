import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import classes from './ChatItem.module.scss';
import { DeleteOutline } from '@mui/icons-material';
import { useDeleteConversationByIdMutation } from '../../services/conversationApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetConversationData } from '../../redux/store/conversationSlice';
import ConfirmationDialog from '../Dialog/Dialog';
import {
  CONVERSATION_ITEM_STATUS,
  DELETE_ACKNOWLEDGEMENT_MSG,
  DELETE_CONFORMATION_MSG,
  DELETION_MSG,
} from '../../utils/constants';

/**
 * Represents a single chat item in the conversation list.
 *
 * This component displays a chat title, an options menu for deleting the chat,
 * and handles navigation logic when a chat is selected.
 *
 * @param {Object} props - Component props
 * @param {Object} props.conversation - Conversation details
 * @param {string | number} props.conversation.id - Unique ID of the conversation
 * @param {string} props.conversation.title - Title of the conversation
 * @param {string} [props.activeChat] - Currently active chat ID
 * @param {Function} props.onChatItemClick - Function to handle selecting a conversation
 * @returns {JSX.Element} ChatItem component
 */

/** changes made  
v1.1.0 :  
  => introduced spinners if the conversation is still loading    
**/
const ChatItem = ({ conversation, activeChat, onChatItemClick }) => {
  // console.log('conversatoion is ', conversation);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to handle menu anchor and visibility
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // State to handle delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // State to track loading and success messages
  const [messageState, setMessageState] = useState({
    loading: false,
    successMsg: '',
  });

  // API mutation hook for deleting a conversation
  const [deletConversationById, { isError, error }] = useDeleteConversationByIdMutation();

  // Handle menu open
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setShowMenu(true);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setShowMenu(false);
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleItemDelete = async (conversationId) => {
    try {
      //deleting  the converstion
      setMessageState({
        loading: true,
        successMsg: '',
      });
      await deletConversationById(conversationId).unwrap();
      //update the state once the deletion successfull
      setMessageState({
        loading: false,
        successMsg: 'Deleted Successfully',
      });
      // if the active chat is same as conversation to be deleted then redirect to /new
      if (parseInt(activeChat) === parseInt(conversationId)) {
        dispatch(resetConversationData());
        navigate('/conversations/new');
      }
      // for improving the UX
      await new Promise((res) => setTimeout(res, 200));
      //close the dialog
      setDeleteDialogOpen(false);
    } catch (err) {
      setMessageState({
        loading: false,
        successMsg: '',
      });
      console.error('error while deleting the convesation', err);
    }
  };
  return (
    <div
      key={conversation.id}
      className={`${classes.conversationItem} ${conversation.id == activeChat ? classes.active : ''}`}
      onClick={() => onChatItemClick(conversation.id)}>
      <div className={classes.conversationContent}>
        <div className={classes.chatTypeIcon}>
          <ChatOutlinedIcon fontSize="small" />
        </div>
        <Typography variant="body2" className={classes.conversationTitle} noWrap title={conversation.title}>
          {conversation.title}
        </Typography>
      </div>
      <div className={classes.metaContainer} onClick={(e) => e.stopPropagation()}>
        {/* v1.1.0 introduced spinners if the conversation is still loading */}
        {conversation?.status === CONVERSATION_ITEM_STATUS.IN_PROGRESS ? (
          <CircularProgress size={18} thickness={6} color="inherit" className={classes.loader} />
        ) : null}

        <IconButton
          size="small"
          className={`${classes.moreButton} ${showMenu ? classes.dispBtn : ''}`}
          onClick={handleMenuClick}
          aria-label="More options">
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          MenuListProps={{ sx: { py: 1 } }}>
          <MenuItem
            onClick={handleDeleteClick}
            sx={{ color: '#D32F2F', display: 'flex', justifyContent: 'space-around', px: 1 }}>
            <DeleteOutline className={classes.deleteIcon} />
            <Typography className={classes.MenuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
          }}
          onConfirm={() => {
            handleItemDelete(conversation.id);
          }}
          dialogContent={conversation.title}
          loading={messageState.loading}
          successMsg={messageState.successMsg}
          errorMsg={isError ? error?.data?.message || 'Something went wrong ' : ''}
          loadingIdentifier={DELETION_MSG}
          dialogTitle={DELETE_CONFORMATION_MSG}
          confirmationText={DELETE_ACKNOWLEDGEMENT_MSG}
        />
      </div>
    </div>
  );
};

// Define expected prop types for better type safety
ChatItem.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
  activeChat: PropTypes.string,
  onChatItemClick: PropTypes.func.isRequired,
};

export default ChatItem;

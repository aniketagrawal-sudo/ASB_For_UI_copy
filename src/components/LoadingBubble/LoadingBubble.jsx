import PropTypes from 'prop-types';
import React from 'react';
import classes from './LoadingBubble.module.scss';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { LOADER_MESSAGE, SENDER_TYPES_DISP_NAME } from '../../utils/constants';

const LoadingBubble = React.memo(({ isUser, message, userInitials }) => {
  return isUser ? (
    <div className={classes.userMessageContainer}>
      <div className={classes.userMessageContent}>
        <div className={classes.userMessageBubble}>
          <Typography variant="body2" className={classes.questionText}>
            {message}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
              {LOADER_MESSAGE.USER_LOADING_MESSAGE}
            </Typography>
            <CircularProgress size={16} />
          </Box>
        </div>
        <div className={classes.userAvatarContainer}>
          <Avatar className={classes.userAvatar}>{userInitials || <AccountCircleIcon fontSize="small" />}</Avatar>
          <Typography variant="caption" className={classes.messageLabel}>
            {SENDER_TYPES_DISP_NAME.USER}
          </Typography>
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.aiMessageContainer}>
      <div className={classes.aiMessageContent}>
        <div className={classes.aiAvatarContainer}>
          <Avatar className={classes.aiAvatar}>
            <SmartToyOutlinedIcon fontSize="small" />
          </Avatar>
          <Typography variant="caption" className={classes.messageLabel}>
            {SENDER_TYPES_DISP_NAME.AI}
          </Typography>
        </div>
        <div className={classes.aiMessageBubble}>
          <Typography variant="body2" className={classes.answerText}>
            {message}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
              {LOADER_MESSAGE.AI_LOADING_MESSAGE}
            </Typography>
            <CircularProgress size={16} />
          </Box>
        </div>
      </div>
    </div>
  );
});
LoadingBubble.displayName = 'LoadingBubble';

LoadingBubble.propTypes = {
  isUser: PropTypes.bool.isRequired, // Indicates if the message is from the user (required)
  message: PropTypes.string, // The message content (optional)
  userInitials: PropTypes.string, // User initials (optional, only needed if isUser is true)
};

export default LoadingBubble;

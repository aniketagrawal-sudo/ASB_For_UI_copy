import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';

const ErrorMessage = React.memo(({ errMsg }) => {
  return (
    <Alert
      severity="error"
      sx={{
        backgroundColor: 'transparent',
        color: 'rgb(211, 47, 47)',
        boxShadow: 'none',
        padding: 0,
        fontSize: '12px',
      }}
      icon={<SmsFailedIcon />}>
      Failed to send message: {errMsg}
    </Alert>
  );
});
ErrorMessage.displayName = 'ErrorMessage';

// 🔹 Define PropTypes
ErrorMessage.propTypes = {
  errMsg: PropTypes.string.isRequired, // Required error message
};

export default ErrorMessage;

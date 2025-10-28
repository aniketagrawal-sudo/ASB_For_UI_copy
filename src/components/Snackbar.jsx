import Snackbar from '@mui/material/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackBar, selectSnackbar } from '../redux/store/conversationSlice';
import { Alert } from '@mui/material';

export default function CustomSnackbar() {
  const { open, message, severity, autoHideDuration = 3000 } = useSelector(selectSnackbar);
  const dispatch = useDispatch();
  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    //dispatch close snackbar action
    dispatch(closeSnackBar());
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        key={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

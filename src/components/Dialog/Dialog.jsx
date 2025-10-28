import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';
import classes from './Dialog.module.scss';

/** changes made  
v1.1.0 :  
  => added handleConfirm and handleClose to force unfocus on dialog close  
**/
const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  dialogContent,
  dialogTitle,
  loading,
  errorMsg,
  successMsg,
  loadingIdentifier,
  confirmationText,
}) => {
  const handleConfirm = () => {
    // v1.1.0 force unfocus
    document.activeElement?.blur();
    onConfirm();
  };
  const handleClose = () => {
    // v1.1.0 force unfocus
    document.activeElement?.blur();
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: classes.dialogPaper,
        },
      }}>
      {loading ? (
        <>
          <DialogContent className={classes.dialogContentCenter}>
            <DialogContentText>{loadingIdentifier} ...</DialogContentText>
          </DialogContent>
        </>
      ) : errorMsg ? (
        <DialogContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <DialogContentText className={classes.errorMessage}>{errorMsg}</DialogContentText>
          <DialogActions>
            <Button onClick={onClose} className={classes.cancelButton}>
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      ) : successMsg ? (
        <DialogContent className={classes.dialogContentCenter}>
          <DialogContentText>{successMsg} !</DialogContentText>
        </DialogContent>
      ) : (
        <>
          <DialogTitle className={classes.dialogTitle}>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              {confirmationText} <b>{dialogContent}</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className={classes.cancelButton}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Controls dialog visibility
  onClose: PropTypes.func.isRequired, // Callback when cancel or outside click
  onConfirm: PropTypes.func.isRequired, // Callback when delete is confirmed
  dialogTitle: PropTypes.string.isRequired, // Title of the dialog
  dialogContent: PropTypes.string, // Content inside the dialog (optional)
  confirmationText: PropTypes.string, // Text before confirmation (optional)
  loading: PropTypes.bool, // Whether the action is in progress
  errorMsg: PropTypes.string, // Error message if action fails
  successMsg: PropTypes.string, // Success message if action succeeds
  loadingIdentifier: PropTypes.string, // Text shown when loading
};

export default ConfirmationDialog;

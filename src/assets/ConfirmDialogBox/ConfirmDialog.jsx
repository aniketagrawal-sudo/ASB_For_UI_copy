
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import classes from './ConfirmDialog.module.scss';

export default function ConfirmDialog({
  open,
  title = "Are you sure you want to delete?",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.confirmDialogTitle}>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions className={classes.dialogActions}>
        <Button variant="outlined" onClick={onCancel} className={classes.cancelBtn}>
          {cancelText}
        </Button>
        <Button color="error" onClick={onConfirm} className={classes.saveBtn}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

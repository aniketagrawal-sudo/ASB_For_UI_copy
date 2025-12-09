import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import classes from './UsageStatsOnBoardKPIDialog.module.scss';

export default function UsageStatsOnBoardKPIDialog({
  open,
  onClose,
  onSave,
  mode = 'create',
  initialValues,
  USER_OPTIONS,
}) {
  const [form, setForm] = useState({
    username: '',
    emailId: '',
    officerId: '',
    title: '',
    department: '',
    status: '', // 👈 NEW FIELD
  });

  useEffect(() => {
    if (open) {
      setForm({
        username: initialValues?.username || '',
        emailId: initialValues?.emailId || '',
        officerId: initialValues?.officerId || '',
        title: initialValues?.title || '',
        department: initialValues?.department || '',
        status: initialValues?.status || 'Onboarded', // 👈 default
      });
    }
  }, [open, initialValues]);

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.customDialogPaper }}>
      <DialogTitle data-testId="kpiBoardTitle" className={classes.dialogueTitle}>
        {mode === 'edit' ? 'Edit User' : 'Add New User'}
        <DialogContentText className={classes.dialogueTitleText}>
          {mode === 'edit'
            ? 'Edit any necessary User details and click on save'
            : 'Please input the necessary details and choose the Persona'}
        </DialogContentText>

        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon sx={{ fontSize: '14px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* User Name */}
          {/* <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>User Name</InputLabel>
            <Select
              data-testid="username-select"
              label="User Name"
              sx={{ fontSize: '12px', pointerEvents: "none", }}
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}>
              {USER_OPTIONS?.map((user) => (
                <MenuItem key={user} value={user} sx={{ fontSize: '12px' }}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
           <TextField
            fullWidth
            size="small"
            label="User Name"
            value={form.username || ''}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '12px',
                padding: '6px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '12px',
              },
              pointerEvents: "none",
            }}
          />

          {/* Email */}
          {/* <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "12px" }}>Email ID</InputLabel>
            <Select
              data-testid="category-select"
              label="Email ID"
              sx={{ fontSize: "12px" }}
              value={form.emailId}
              onChange={(e) => setForm((f) => ({ ...f, emailId: e.target.value }))}
            >
              {CATEGORY_OPTIONS?.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontSize: "12px" }}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <TextField
            fullWidth
            size="small"
            label="Email ID"
            value={form.emailId || ''}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '12px',
                padding: '6px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '12px',
              },
              pointerEvents: "none",
            }}
          />

          {/* Officer */}
          {/* <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>Officer ID</InputLabel>
            <Select
              data-testid="persona-select"
              label="Officer ID"
              sx={{ fontSize: '12px' }}
              value={form.officerId}
              onChange={(e) => setForm((f) => ({ ...f, officerId: e.target.value }))}>
              {PERSONA_OPTIONS?.map((role) => (
                <MenuItem key={role} value={role} sx={{ fontSize: '12px' }}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
           <TextField
            fullWidth
            size="small"
            label="Officer ID"
            value={form.officerId || ''}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '12px',
                padding: '6px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '12px',
              },
              pointerEvents: "none",
            }}
          />

          {/* Title */}
          <TextField
            data-testid="description-input"
            size="small"
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            // multiline
            minRows={3}
            fullWidth
            sx={{
              '& .MuiInputBase-input': { fontSize: '12px', padding: '6px 10px' },
              '& .MuiInputLabel-root': { fontSize: '12px' },
              pointerEvents: "none",
            }}
          />

          {/* Department */}
          <TextField
            data-testid="description-input"
            size="small"
            label="Department"
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            // multiline
            minRows={3}
            fullWidth
            sx={{
              '& .MuiInputBase-input': { fontSize: '12px', padding: '6px 10px' },
              '& .MuiInputLabel-root': { fontSize: '12px' },
              pointerEvents: "none",
            }}
          />

          {/* STATUS DROPDOWN */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>User Status</InputLabel>
            <Select
              data-testid="status-select"
              label="User Status"
              sx={{ fontSize: '12px' }}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <MenuItem value="Onboarded" sx={{ fontSize: '12px' }}>
                Onboarded
              </MenuItem>
              <MenuItem value="Offboarded" sx={{ fontSize: '12px' }}>
                Offboarded
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button data-testid="cancel-btn" onClick={onClose} variant="outlined" className={classes.cancelBtn}>
          Cancel
        </Button>
        <Button
          data-testid="save-btn"
          variant="contained"
          color="primary"
          onClick={handleSave}
          className={classes.saveBtn}>
          {mode === 'edit' ? 'Save Changes' : 'Add KPI'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UsageStatsOnBoardKPIDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']),
  initialValues: PropTypes.object,
  USER_OPTIONS: PropTypes.array,
  CATEGORY_OPTIONS: PropTypes.array,
  PERSONA_OPTIONS: PropTypes.array,
};

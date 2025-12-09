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
import classes from './OnBoardKPIDialogue.module.scss';

export default function OnBoardKPIDialogue({
  open,
  onClose,
  onSave,
  mode = 'create',
  initialValues,
  userOptions = [],
  categoryOptions = [],
  personaOptions = []
}) {
  const [form, setForm] = useState({
    username: '',
    description: '',
    category: '',
    persona: '',
  });

  // Hydrate values on open
  useEffect(() => {
    if (open) {
      setForm({
        username: initialValues?.username || '',
        description: initialValues?.description || '',
        category: initialValues?.category || '',
        persona: initialValues?.persona || '',
      });
    }
  }, [open, initialValues]);

  const handleSave = () => onSave(form);

  // Helper: ensure selected value is always shown.
  const ensureValueIncluded = (options, value) => {
    if (!value) return options;
    if (options.includes(value)) return options;
    return [value, ...options];
  };

  const mergedUsers = ensureValueIncluded(userOptions, form.username);
  const mergedCategories = ensureValueIncluded(categoryOptions, form.category);
  const mergedPersonas = ensureValueIncluded(personaOptions, form.persona);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.customDialogPaper }}>
      <DialogTitle className={classes.dialogueTitle}>
        {mode === 'edit' ? 'Edit KPI' : 'Add New KPI'}
        <DialogContentText className={classes.dialogueTitleText}>
          {mode === 'edit'
            ? 'Edit the KPI details and click save.'
            : 'Please input all necessary details to create a KPI.'}
        </DialogContentText>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon sx={{ fontSize: '14px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2 }}>

          {/* KPI Name */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>KPI Name</InputLabel>
            <Select
           InputProps={{ readOnly: true }}
              data-testid="username-select"
              sx={{ fontSize: '12px', pointerEvents: "none", }}
              value={form.username}
              label="KPI Name"
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            >
              {mergedUsers.map((user) => (
                <MenuItem key={user} value={user} sx={{ fontSize: '12px' }}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
          InputProps={{ readOnly: true }}
            data-testid="description-input"
            size="small"
            label="KPI Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
            sx={{
              pointerEvents: "none",
              '& .MuiInputBase-input': { fontSize: '12px', padding: '6px 10px' },
              '& .MuiInputLabel-root': { fontSize: '12px' },
            }}
          />

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>Category</InputLabel>
            <Select
            InputProps={{ readOnly: true }}
              data-testid="category-select"
              value={form.category}
              label="Category"
              sx={{ fontSize: '12px', pointerEvents: "none", }}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {mergedCategories.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontSize: '12px' }}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Persona */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '12px' }}>Assignment</InputLabel>
            <Select
              data-testid="persona-select"
              value={form.persona}
              label="Assignment"
              sx={{ fontSize: '12px' }}
              onChange={(e) => setForm((f) => ({ ...f, persona: e.target.value }))}
            >
              {mergedPersonas.map((role) => (
                <MenuItem key={role} value={role} sx={{ fontSize: '12px' }}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Box>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button data-testid="cancel-btn" onClick={onClose} variant="outlined" className={classes.cancelBtn}>
          Cancel
        </Button>
        <Button data-testid="save-btn" color="primary" variant="contained" className={classes.saveBtn} onClick={handleSave}>
          {mode === 'edit' ? 'Save Changes' : 'Add KPI'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OnBoardKPIDialogue.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']),
  initialValues: PropTypes.shape({
    username: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    persona: PropTypes.string,
  }),
  userOptions: PropTypes.arrayOf(PropTypes.string),
  categoryOptions: PropTypes.arrayOf(PropTypes.string),
  personaOptions: PropTypes.arrayOf(PropTypes.string),
};

OnBoardKPIDialogue.defaultProps = {
  mode: 'create',
  initialValues: undefined,
  userOptions: [],
  categoryOptions: [],
  personaOptions: [],
};

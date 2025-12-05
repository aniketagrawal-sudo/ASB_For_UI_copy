import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./UsageStatsOnBoardKPIDialog.module.scss";

export default function UsageStatsOnBoardKPIDialog({
  open,
  onClose,
  onSave,
  mode = "create",
  initialValues,
  USER_OPTIONS,
  CATEGORY_OPTIONS,
  PERSONA_OPTIONS,
}) {
  const [form, setForm] = useState({
    username: "",
    description: "",
    category: "",
    persona: "",
    status: "",   // 👈 NEW FIELD
  });

  useEffect(() => {
    if (open) {
      setForm({
        username: initialValues?.username || "",
        description: initialValues?.description || "",
        category: initialValues?.category || "",
        persona: initialValues?.persona || "",
        status: initialValues?.status || "Active",   // 👈 default
      });
    }
  }, [open, initialValues]);

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.customDialogPaper }}>
      <DialogTitle data-testId="kpiBoardTitle" className={classes.dialogueTitle}>
        {mode === "edit" ? "Edit KPI" : "Add New KPI"}
        <DialogContentText className={classes.dialogueTitleText}>
          {mode === "edit"
            ? "Edit any necessary KPI details and click on save"
            : "Please input the necessary details and choose the Persona"}
        </DialogContentText>

        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon sx={{ fontSize: "14px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>

          {/* KPI Name */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "12px" }}>KPI Name</InputLabel>
            <Select
              data-testid="username-select"
              label="User Name"
              sx={{ fontSize: "12px" }}
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            >
              {USER_OPTIONS?.map((user) => (
                <MenuItem key={user} value={user} sx={{ fontSize: "12px" }}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            data-testid="description-input"
            size="small"
            label="KPI Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
            sx={{
              "& .MuiInputBase-input": { fontSize: "12px", padding: "6px 10px" },
              "& .MuiInputLabel-root": { fontSize: "12px" },
            }}
          />

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "12px" }}>Category</InputLabel>
            <Select
              data-testid="category-select"
              label="KPI Category"
              sx={{ fontSize: "12px" }}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORY_OPTIONS?.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontSize: "12px" }}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Persona */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "12px" }}>Persona</InputLabel>
            <Select
              data-testid="persona-select"
              label="Persona"
              sx={{ fontSize: "12px" }}
              value={form.persona}
              onChange={(e) => setForm((f) => ({ ...f, persona: e.target.value }))}
            >
              {PERSONA_OPTIONS?.map((role) => (
                <MenuItem key={role} value={role} sx={{ fontSize: "12px" }}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* STATUS DROPDOWN */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "12px" }}>Status</InputLabel>
            <Select
              data-testid="status-select"
              label="Status"
              sx={{ fontSize: "12px" }}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="Active" sx={{ fontSize: "12px" }}>Active</MenuItem>
              <MenuItem value="Inactive" sx={{ fontSize: "12px" }}>Inactive</MenuItem>
            </Select>
          </FormControl>

        </Box>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button data-testid="cancel-btn" onClick={onClose} variant="outlined" className={classes.cancelBtn}>
          Cancel
        </Button>
        <Button data-testid="save-btn" variant="contained" color="primary" onClick={handleSave} className={classes.saveBtn}>
          {mode === "edit" ? "Save Changes" : "Add KPI"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UsageStatsOnBoardKPIDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
  initialValues: PropTypes.object,
  USER_OPTIONS: PropTypes.array,
  CATEGORY_OPTIONS: PropTypes.array,
  PERSONA_OPTIONS: PropTypes.array,
};

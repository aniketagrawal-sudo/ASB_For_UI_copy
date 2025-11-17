import { useEffect, useState } from "react";
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
}) {
  const [form, setForm] = useState({
    username: "",
    description: "",
    category: "",
    persona: "",
  });

  // Example dropdown options (in future you can fetch these dynamically from API)
  const USER_OPTIONS = ["John Doe", "Jane Smith", "Rahul Verma", "Priya Nair"];
  const CATEGORY_OPTIONS = ["Sales", "Finance", "Marketing", "Operations"];
  const PERSONA_OPTIONS = ["Regional Manager", "Team Leader", "Analyst"];

  // Hydrate form whenever dialog opens or initialValues change
  useEffect(() => {
    if (open) {
      setForm({
        username: initialValues?.username || "",
        description: initialValues?.description || "",
        category: initialValues?.category || "",
        persona: initialValues?.persona || "",
      });
    }
  }, [open, initialValues]);

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.customDialogPaper }}>
      <DialogTitle className={classes.dialogueTitle}>
        {mode === "edit" ? "Edit KPI" : "Add New KPI"}
        <DialogContentText sx={{ mb: 2 }}>
          {mode === "edit"
            ? "Edit any necessary KPI details and click on save"
            : "Please input the necessary details and choose the Persona"}
        </DialogContentText>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          {/* Username dropdown */}
          <FormControl fullWidth>
            <InputLabel>User Name</InputLabel>
            <Select
              label="User Name"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            >
              {USER_OPTIONS.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            label="User Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
          />

          {/* Category dropdown */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Persona dropdown */}
          <FormControl fullWidth>
            <InputLabel>Persona</InputLabel>
            <Select
              label="Persona"
              value={form.persona}
              onChange={(e) =>
                setForm((f) => ({ ...f, persona: e.target.value }))
              }
            >
              {PERSONA_OPTIONS.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} variant="outlined" className={classes.cancelBtn}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          className={classes.saveBtn}
          onClick={handleSave}
        >
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
  initialValues: PropTypes.shape({
    username: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    persona: PropTypes.string,
  }),
};

UsageStatsOnBoardKPIDialog.defaultProps = {
  mode: "create",
  initialValues: undefined,
};

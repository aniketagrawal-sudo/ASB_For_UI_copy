
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
  MobileStepper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OnBoardKPIDialogue({ open, onClose, onSave, mode = "create", initialValues }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    username: "",
    description: "",
    category: "",
    persona: "",
  });

  // hydrate form whenever dialog opens or initialValues change
  useEffect(() => {
    if (open) {
      setForm({
        username: (initialValues && initialValues.username) || "",
        description: (initialValues && initialValues.description) || "",
        category: (initialValues && initialValues.category) || "",
        persona: (initialValues && initialValues.persona) || "",
      });
      setActiveStep(0);
    }
  }, [open, initialValues]);

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {mode === "edit" ? "Edit User" : "Onboard User"}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          Please input the necessary details and choose the Persona
        </DialogContentText>

        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            fullWidth
          />
          <TextField
            label="User Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            fullWidth
          />
          <Select
            displayEmpty
            value={form.persona}
            onChange={(e) => setForm((f) => ({ ...f, persona: e.target.value }))}
            renderValue={(val) => (val ? val : "Persona")}
            fullWidth
          >
            <MenuItem value="Regional Manager">Regional Manager</MenuItem>
            <MenuItem value="Team Leader">Team Leader</MenuItem>
            <MenuItem value="Analyst">Analyst</MenuItem>
          </Select>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
        <MobileStepper
          variant="dots"
          steps={3}
          position="static"
          activeStep={activeStep}
          backButton={
            <Button size="small" onClick={() => setActiveStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
          }
          nextButton={
            <Button size="small" onClick={() => setActiveStep((s) => Math.min(2, s + 1))}>
              Next
            </Button>
          }
          sx={{ flex: 1, mr: 2 }}
        />
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OnBoardKPIDialogue.propTypes = {
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

OnBoardKPIDialogue.defaultProps = {
  mode: "create",
  initialValues: undefined,
};

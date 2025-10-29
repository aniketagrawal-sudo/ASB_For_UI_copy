import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PropTypes from 'prop-types';
import styles from './GenerateReport.module.scss'; // ✅ Import SCSS module

export default function GenerateReport({ open, onClose }) {
  const [templateType, setTemplateType] = useState('type1');
  const [isGenerated, setIsGenerated] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setTemplateType('type1');
      setIsGenerated(false);
      setPreviewText('');
      setLoading(false);
    }
  }, [open]);

  // Reset if user changes template
  const handleTemplateChange = (e) => {
    setTemplateType(e.target.value);
    setIsGenerated(false);
    setPreviewText('');
  };

  // Generate report (mock API call)
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType }),
      });

      const data = await res.json();
      setPreviewText(data.previewText || `Preview for ${templateType} generated successfully!`);
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setPreviewText('⚠️ Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download report
  const handleDownload = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${templateType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Regenerate
  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className={styles.generateReportDialog}>
      {/* Close Button */}
      <IconButton onClick={onClose} className={styles.closeBtn}>
        <CloseIcon />
      </IconButton>

      {/* Title */}
      <DialogTitle>
        <Typography variant="h6" className={styles.dialogTitle}>
          Generate Pre Meeting Snapshot
        </Typography>
        <Typography variant="body2" className={styles.dialogSubtitle}>
          Click below to generate your meeting snapshot
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Template Dropdown */}
        <Box className={styles.templateSelectWrapper}>
          <FormControl>
            <Select
              value={templateType}
              onChange={handleTemplateChange}
              className={styles.templateSelect}>
              <MenuItem value="type1">Template Type 1</MenuItem>
              <MenuItem value="type2">Template Type 2</MenuItem>
              <MenuItem value="type3">Template Type 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Preview / Generate Area */}
        <Box className={styles.previewBox}>
          {loading ? (
            <CircularProgress color="success" />
          ) : isGenerated ? (
            <Typography variant="body2" className={styles.previewText}>
              {previewText}
            </Typography>
          ) : (
            <Button variant="outlined" onClick={handleGenerate} className={styles.generateBtn}>
              Generate
            </Button>
          )}
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions className={styles.footerActions}>
        <Button
          variant="text"
          onClick={handleRegenerate}
          disabled={!isGenerated}
          startIcon={<AutorenewIcon />}
          className={`${styles.regenerateBtn} ${isGenerated ? 'enabled' : 'disabled'}`}
        >
          Regenerate
        </Button>

        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={!isGenerated}
          className={`${styles.downloadBtn} ${isGenerated ? 'enabled' : 'disabled'}`}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GenerateReport.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

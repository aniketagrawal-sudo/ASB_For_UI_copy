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
import styles from './GenerateReport.module.scss';
import reportPreview from '../../assets/reportPreview.svg';

export default function GenerateReport({ open, onClose }) {
  const [templateType, setTemplateType] = useState('');

  //once real api data will come below state we need to keep empty array
  const [templateList, setTemplateList] = useState([
    { id: 'type1', name: 'Template Type 1' },
    { id: 'type2', name: 'Template Type 2' },
  ]); // ✅ Store dropdown options

  const [isGenerated, setIsGenerated] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false); // ✅ For dropdown loading

  // ✅ Fetch template list from API once api is ready below useEffect we need to uncomment
  //   useEffect(() => {
  //     const fetchTemplates = async () => {
  //       setLoadingTemplates(true);
  //       try {
  //         const res = await fetch('http://localhost:5000/api/templates');
  //         const data = await res.json();
  //         setTemplateList(data.templates || []); // expects { templates: [ { id, name }, ... ] }
  //         if (data.templates?.length > 0) setTemplateType(data.templates[0].id); // select first one
  //       } catch (error) {
  //         console.error('Error fetching templates:', error);
  //       } finally {
  //         setLoadingTemplates(false);
  //       }
  //     };

  //     if (open) {
  //       fetchTemplates();
  //     }
  //   }, [open]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setTemplateType('');
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

  // Generate report (API call)
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
      <IconButton onClick={onClose} className={styles.closeBtn}>
        <CloseIcon />
      </IconButton>

      <DialogTitle>
        <Typography variant="h6" className={styles.dialogTitle}>
          Generate Pre Meeting Snapshot
        </Typography>
        <Typography variant="body2" className={styles.dialogSubtitle}>
          Please click on generate to get a downloadable template for meetings
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Template Dropdown */}
        <Box className={styles.templateSelectWrapper}>
          <FormControl>
            {loadingTemplates ? (
              <CircularProgress size={24} color="success" />
            ) : (
              <Select
                value={templateType}
                onChange={handleTemplateChange}
                className={styles.templateSelect}
                displayEmpty>
                <MenuItem disabled value="">
                  <span>Select</span>
                </MenuItem>
                {templateList.length === 0 ? (
                  <MenuItem disabled>No Data available</MenuItem>
                ) : (
                  templateList.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          </FormControl>
        </Box>

        {/* Preview / Generate Area */}
        {/* Preview / Generate Area */}
        <Box className={styles.previewBox}>
          {loading ? (
            <CircularProgress color="success" />
          ) : isGenerated ? (
            <Box className={styles.previewContent}>
              {/* 🔹 Image shown after generation */}
              <img src={reportPreview} alt={`${templateType} preview`} className={styles.previewImage} />
              {/* 🔹 Template info / text */}
              <Typography variant="body2" className={styles.previewText}>
                {previewText}
              </Typography>
            </Box>
          ) : (
            <Button variant="outlined" onClick={handleGenerate} className={styles.generateBtn} disabled={!templateType}>
              Generate
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions className={styles.footerActions}>
        <Button
          variant="text"
          onClick={handleRegenerate}
          disabled={!isGenerated}
          startIcon={<AutorenewIcon />}
          className={`${styles.regenerateBtn} ${isGenerated ? 'enabled' : 'disabled'}`}>
          Regenerate
        </Button>

        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={!isGenerated}
          className={`${styles.downloadBtn} ${isGenerated ? 'enabled' : 'disabled'}`}>
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

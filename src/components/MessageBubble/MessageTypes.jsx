import { useState, useRef, memo, useEffect, useMemo } from 'react'; // Added useEffect and useMemo
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import PushPinIcon from '@mui/icons-material/PushPin';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import FileViewer from './FileViewer';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import classes from './MessageBubble.module.scss';
import MessageChartComponent from './MessageChartComponent';
// Import RTK Query hooks
import { usePinArtifactMutation, useUnpinArtifactMutation, useGetArtifactsQuery } from '../../services/artifactsApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectSelectedIndustry, selectSelectedRole } from '../../features/auth/authSlice';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { notifyViaSnackBar } from '../../redux/store/conversationSlice';


// ... (Keep the rest of the file as is until VisualizationMessage)

// Store toggle states in a Map keyed by message content hash
const toggleStateMap = new Map();

// Function to generate a content hash for stable identification
const getContentHash = (content) => {
  if (!content) return '';

  const visualization = content.visualization ? 'viz' : '';
  const table = content.table ? 'table' : '';
  const insight = content.insight ? content.insight.substring(0, 20) : '';

  const tableData =
    content.table && Array.isArray(content.table) && content.table.length > 0
      ? JSON.stringify(content.table[0]).substring(0, 20)
      : '';

  return `${visualization}-${table}-${insight}-${tableData}`;
};

// Enhanced function to process text content with comprehensive HTML entity handling
const processTextContent = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&hellip;/g, '...')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .trim();
};

// Detect if string contains HTML tags
const containsHTML = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
};

// --- 🔥 NEW: Plain text → Markdown transformer ---
// const transformToMarkdown = (text) => {
//   if (!text) return "";

//   // Normalize spacing
//   let clean = text.replace(/\s+/g, " ").trim();

//   // Split into sentences (handles . ? !)
//   let sentences = clean.split(/(?<=[.?!])\s+/);

//   return sentences
//     .map((sentence, idx) => {
//       let line = sentence.trim();

//       // Headings
//       if (/^Effective TDP/i.test(line)) return `### 📊 ${line}`;
//       if (/^Promo Effectiveness/i.test(line)) return `### 🎯 ${line}`;
//       if (/^Promotion Uplift/i.test(line)) return `### 📈 ${line}`;
//       if (/^Conclusion:/i.test(line)) return `#### ✅ ${line}`;

//       // Emphasize numbers
//       line = line.replace(
//         /(\d{1,3}(?:,\d{3})*(?:\.\d+)?%?)/g,
//         "**$1**"
//       );

//       // Brand highlighting
//       line = line.replace(/\b(Brand \d+)\b/g, "👉 **$1**");

//       // Market highlighting (single capitalized words, e.g. cities)
//       line = line.replace(/\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/g, (m) =>
//         m.split(" ").length <= 2 ? `🌍 ${m}` : m
//       );

//       // Everything else → bullet
//       return `- ${line}`;
//     })
//     .join("\n");
// };

export const CombinedMessage = memo(({ content, messageId }) => {
  const contentHash = getContentHash(content);
  const contentRef = useRef(contentHash);

  const [activeView, setActiveView] = useState(() => {
    return toggleStateMap.get(contentHash) || 'visualization';
  });

  const showToggle = content.visualization && content.table;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setActiveView(newView);
      toggleStateMap.set(contentHash, newView);
    }
  };

  useEffect(() => {
    if (contentRef.current !== contentHash) {
      contentRef.current = contentHash;
      const storedView = toggleStateMap.get(contentHash);
      if (storedView && storedView !== activeView) {
        setActiveView(storedView);
      }
    }
  }, [contentHash, activeView]);

  return (
    <div className={classes.combinedMessage}>
      {content.insight && (
        <div className={classes.insightSection}>
          <InsightMessage content={content.insight} />
        </div>
      )}

      {showToggle && (
        <div className={classes.viewToggleContainer}>
          <ToggleButtonGroup
            value={activeView}
            exclusive
            onChange={handleViewChange}
            size="small"
            aria-label="data view toggle"
            className={classes.viewToggle}>
            <ToggleButton value="visualization" aria-label="visualization view">
              <Tooltip title="Show Chart">
                <BarChartIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <Tooltip title="Show Table">
                <TableChartIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}

      {content.visualization && (!showToggle || activeView === 'visualization') && (
        <div className={classes.visualizationSection}>
          <VisualizationMessage content={content.visualization} messageId={messageId}/>
        </div>
      )}

      {content.table && (!showToggle || activeView === 'table') && (
        <div className={classes.tableSection}>
          <TableMessage content={content.table} />
        </div>
      )}

      {content.fileUrl && (
        <div className={classes.fileSection}>
          <FileMessage content={content} />
        </div>
      )}
    </div>
  );
});

export const TableMessage = memo(({ content }) => {
  if (!content || !Array.isArray(content)) return null;

  const getUniqueRows = (rows) => {
    const seen = new Set();
    return rows.filter((row) => {
      const values = Object.values(row).join('|');
      if (seen.has(values)) return false;
      seen.add(values);
      return true;
    });
  };

  const uniqueContent = getUniqueRows(content);
  const headers = Object.keys(uniqueContent[0] || {});

  const downloadCSV = () => {
    if (!uniqueContent) return;

    const csvHeaders = headers.join(',');
    const csvRows = uniqueContent.map((row) =>
      headers.map((header) => `"${row[header] || ''}"`).join(',')
    );
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={classes.tableContainer}>
      <div className={classes.tableHeader}>
        <Typography variant="subtitle2" className={classes.tableTitle}>
          Data Table
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={downloadCSV}
          className={classes.downloadButton}
          size="small">
          Export CSV
        </Button>
      </div>
      <TableContainer component={Paper} className={classes.tableWrapper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  className={classes.tableHeaderCell}
                  style={{
                    backgroundColor: '#f8f9fa',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    fontWeight: 600,
                    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
                  }}>
                  {header.replaceAll('_', ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueContent.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover className={classes.tableRow}>
                {headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex} className={classes.tableCell}>
                    {row[header] !== undefined && row[header] !== null
                      ? typeof row[header] === 'object'
                        ? JSON.stringify(row[header])
                        : typeof row[header] === 'number'
                          ? Number.isInteger(row[header])
                            ? row[header].toString()
                            : Number(row[header].toFixed(4)).toString()
                          : row[header].toString()
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export const VisualizationMessage = memo(({ content, messageId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const selectedIndustryName = useSelector(selectSelectedIndustry);
  const selectedRole = useSelector(selectSelectedRole);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pinArtifact, { isLoading: isPinning }] = usePinArtifactMutation();

  // 1. GET USER AND PERSONA DETAILS FOR THE API QUERY
  const activePersona = useMemo(() => {
    return user?.industries
      ?.find(i => i.name === selectedIndustryName)
      ?.personas?.find(p => p.name === selectedRole);
  }, [user, selectedIndustryName, selectedRole]);

  const userId = user?.userId;
  const personaId = activePersona?.id;

  // 2. FETCH ALL PINNED ARTIFACTS TO CHECK GLOBAL STATE
  const { data: artifactsData } = useGetArtifactsQuery(
    { userId, personaId },
    { skip: !userId || !personaId }
  );

  // 3. CHECK IF THIS SPECIFIC MESSAGE IS ALREADY PINNED
  const isAlreadyPinned = useMemo(() => {
    const pinnedItems = artifactsData?.data || [];
    // The artifact is linked to the message by its source_id
    return pinnedItems.some(item => String(item.source_id) === String(messageId));
  }, [artifactsData, messageId]);

  // 4. MANAGE LOCAL STATE, BUT SYNCHRONIZE IT WITH GLOBAL STATE
  const [isPinned, setIsPinned] = useState(isAlreadyPinned);

  useEffect(() => {
    // This effect ensures that if the artifact data loads after the component
    // has mounted, the local state is updated to reflect the true pinned status.
    setIsPinned(isAlreadyPinned);
  }, [isAlreadyPinned]);


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!content) return null;

  const isChartConfig =
    typeof content === 'object' ||
    (typeof content === 'string' && (content.startsWith('{') || content.startsWith('[')));

  let chartTitle = '';
  if (isChartConfig) {
      try {
          const config = typeof content === 'string' ? JSON.parse(content) : content;
          chartTitle = config?.options?.plugins?.title?.text || config.title || `Chart from ${new Date().toLocaleDateString()}`;
      } catch (e) {
          console.error('Error parsing chart title:', e);
          chartTitle = `Chart from ${new Date().toLocaleDateString()}`;
      }
  }


  const handleTogglePin = async () => {
    // This check now correctly uses the synchronized state
    if (isPinned) {
      dispatch(
        notifyViaSnackBar({
          open: true,
          message: 'This item is already pinned in Artifacts.',
          severity: 'info',
        })
      );
      return;
    }

    if (isPinning || !userId || !personaId) return;

    // Optimistically update the UI
    setIsPinned(true);

    try {
      const artifactPayload = {
        user_id: userId,
        persona_id: personaId,
        source_type: 'CHAT',
        source_id: messageId,
        title: chartTitle,
        content: content,
      };
      await pinArtifact(artifactPayload).unwrap();
      dispatch(
        notifyViaSnackBar({
          open: true,
          message: 'Chart pinned to Artifacts!',
          severity: 'success',
        })
      );
    } catch (error) {
      console.error('Failed to pin artifact:', error);
      // Revert UI on error
      setIsPinned(false);
      dispatch(
        notifyViaSnackBar({
          open: true,
          message: 'Failed to pin chart. Please try again.',
          severity: 'error',
        })
      );
    }
  };

  return (
    <>
      <div className={classes.visualizationContainer}>
        <div className={classes.visActions}>
          <Tooltip title={isPinned ? 'Pinned' : 'Pin to Artifacts'}>
            {/* The disabled attribute prevents multiple clicks while an operation is in progress */}
            <IconButton onClick={handleTogglePin} disabled={isPinning} className={classes.pinButton} size="small">
              <PushPinIcon className={isPinned ? classes.pinned : ''} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Fullscreen">
            <IconButton onClick={handleOpenModal} className={classes.fullscreenButton} size="small">
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </div>

        {isChartConfig ? (
          <div className={classes.chartContainer}>
            <MessageChartComponent
              dataPoints={typeof content === 'string' ? JSON.parse(content) : content}
              type={
                (typeof content === 'object' && content.type) ||
                (typeof content === 'string' && JSON.parse(content).type) ||
                'line'
              }
              title={chartTitle}
              
            />
          </div>
        ) : (
          <img
            src={`data:image/png;base64,${content}`}
            alt="Visualization"
            className={classes.visualizationImage}
          />
        )}
      </div>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{ style: { height: '90vh' } }}
      >
        <DialogTitle>
          {chartTitle}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogChartContainer}>
          {isChartConfig && (
            <MessageChartComponent
              dataPoints={typeof content === 'string' ? JSON.parse(content) : content}
              type={
                (typeof content === 'object' && content.type) ||
                (typeof content === 'string' && JSON.parse(content).type) ||
                'line'
              }
              isFullscreen={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});

// ... (The rest of the file remains unchanged)
export const FileMessage = memo(({ content }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div className={classes.fileContainer}>
        <Button
          startIcon={<VisibilityIcon />}
          onClick={() => setIsViewerOpen(true)}
          className={classes.viewFileButton}
          disabled={!content.fileUrl}>
          View File
        </Button>
      </div>
      <FileViewer open={isViewerOpen} onClose={() => setIsViewerOpen(false)} fileUrl={content.fileUrl} />
    </>
  );
});

// --- 🔥 Updated InsightMessage ---
export const InsightMessage = memo(({ content }) => {
  if (!content) return null;

  const isHtml = containsHTML(content);
  const processedContent = processTextContent(content);

  // // if plain text → transform into Markdown
  // const markdownContent = isHtml ? processedContent : transformToMarkdown(processedContent);

  return (
    <div className={classes.answerText}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={isHtml ? [rehypeRaw] : []}
        components={{
          li: ({ node, ...props }) => <li {...props} className="enhanced-list-item" />,
          p: ({ node, ...props }) => <p {...props} className="enhanced-paragraph" />,
        }}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
});

// Display names
CombinedMessage.displayName = 'CombinedMessage';
TableMessage.displayName = 'TableMessage';
VisualizationMessage.displayName = 'VisualizationMessage';
FileMessage.displayName = 'FileMessage';
InsightMessage.displayName = 'InsightMessage';

// PropTypes
CombinedMessage.propTypes = {
  content: PropTypes.shape({
    insight: PropTypes.string,
    visualization: PropTypes.any,
    table: PropTypes.array,
    fileUrl: PropTypes.string,
  }).isRequired,
};

TableMessage.propTypes = {
  content: PropTypes.array.isRequired,
};

VisualizationMessage.propTypes = {
  content: PropTypes.any.isRequired,
};

FileMessage.propTypes = {
  content: PropTypes.shape({
    fileUrl: PropTypes.string.isRequired,
  }).isRequired,
};

InsightMessage.propTypes = {
  content: PropTypes.string.isRequired,
};

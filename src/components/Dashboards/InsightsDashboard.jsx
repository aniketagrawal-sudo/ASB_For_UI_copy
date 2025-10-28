import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography, CircularProgress, Alert, Skeleton, IconButton, Button, Tooltip } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowForward as ArrowForwardIcon,
  MoreHoriz as MoreHorizIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import Chart from 'chart.js/auto';
import {
  selectInsightsScreenData,
  selectInsightsDashboardLoading,
  selectDashboardError,
} from '../../redux/store/dashboardSlice';
import { selectUser,selectSelectedIndustry,selectSelectedRole } from '../../features/auth/authSlice';
import { useExecuteInsightQueryMutation,useDownloadInsightsAsPptMutation } from '../../services/dashboardApi';
import InsightsToggleView from './InsightsToggleView';
import InsightsDataTable from './InsightsDataTable';
import DetailsPanel from '../SummaryPanel/DetailsPanel';
import classes from './InsightsDashboard.module.scss';
import {
  notifyViaSnackBar,
} from '../../redux/store/conversationSlice';
import DescriptionIcon from '@mui/icons-material/Description';
import powerpoint from '../../assets/powerpoint.svg';

function parseJsonSafely(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
  return JSON.parse(raw);
  } catch (e) {
  try {
  const cleaned = String(raw)
  .replace(/\\r\\n/g, "\n")
  .replace(/\\n/g, "\n")
  .trim();
  return JSON.parse(cleaned);
  } catch (e2) {
  console.warn("parseJsonSafely: failed to parse", e2);
  return null;
  }
  }
  }
  
  
  const normalizeChartData = (data) => {
  if (!data || !data.labels || !data.datasets) return data;
  return {
  ...data,
  datasets: data.datasets.map((ds) => ({
  ...ds,
  data: ds.data.slice(0, data.labels.length),
  })),
  };
  };


// ENHANCED: Format insight brief to handle both HTML and escape character formats
const formatInsightBrief = (briefText) => {
  if (!briefText) return '';

  // Check if it's HTML content
  const isHTML = briefText.includes('<') && briefText.includes('>');

  if (isHTML) {
    // Handle HTML content
    let cleanedHTML = briefText
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&bull;/g, '•') // Replace HTML bullet entities
      .replace(/<br\s*\/?>/gi, '\n') // Replace <br> tags with line breaks
      .replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
      .replace(/<\/p>/gi, '\n') // Replace closing </p> tags with line breaks
      .replace(/<b[^>]*>/gi, '**') // Replace opening <b> tags with markdown bold
      .replace(/<\/b>/gi, '**') // Replace closing </b> tags with markdown bold
      .replace(/<strong[^>]*>/gi, '**') // Replace opening <strong> tags
      .replace(/<\/strong>/gi, '**') // Replace closing </strong> tags
      .replace(/\s*•\s*/g, '\n• ') // Normalize bullet points
      .replace(/^\s+/gm, '') // Remove leading whitespace from each line
      .replace(/\n+/g, '\n') // Replace multiple line breaks with single
      .trim();

    // Split by line breaks and bullet points
    const lines = cleanedHTML.split(/\n/).filter((line) => line.trim());

    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        // Check if line already starts with bullet
        const startsWithBullet = trimmedLine.startsWith('•');

        // Handle markdown bold syntax
        const processedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        return (
          <div key={index} className={classes.briefLine}>
            {!startsWithBullet && index > 0 && <span className={classes.bulletPoint}>•</span>}
            <span
              className={classes.briefText}
              dangerouslySetInnerHTML={{
                __html: startsWithBullet ? processedLine : processedLine,
              }}
            />
          </div>
        );
      })
      .filter(Boolean);
  } else {
    // Handle simple escape character format (existing logic)
    let cleanedText = briefText
      .replace(/\\r\\n/g, '\n') // Replace \r\n with actual line breaks
      .replace(/\\n/g, '\n') // Replace \n with actual line breaks
      .replace(/\\\\/g, '\\') // Replace double backslashes with single
      .replace(/\\'/g, "'") // Replace escaped quotes
      .replace(/\\"/g, '"') // Replace escaped double quotes
      .trim();

    // Split by bullet points and line breaks
    const lines = cleanedText.split(/\n|•/).filter((line) => line.trim());

    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        return (
          <div key={index} className={classes.briefLine}>
            {index > 0 && <span className={classes.bulletPoint}>•</span>}
            <span className={classes.briefText}>{trimmedLine}</span>
          </div>
        );
      })
      .filter(Boolean);
  }
};

// // OPTIMIZED: Utility function with memoization cache
// const parseJsonSafely = (() => {
//   const cache = new Map();
//   const MAX_CACHE_SIZE = 50;

//   return (data) => {
//     if (!data) return null;
//     if (typeof data === 'object') return data;

//     const cacheKey = typeof data === 'string' ? data.substring(0, 100) : String(data);

//     if (cache.has(cacheKey)) {
//       return cache.get(cacheKey);
//     }

//     try {
//       const cleanedData = data
//         .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
//         .replace(/\\n/g, '')
//         .replace(/\\/g, '')
//         .replace(/\s+/g, ' ')
//         .trim();

//       const result = JSON.parse(cleanedData);

//       if (cache.size >= MAX_CACHE_SIZE) {
//         const firstKey = cache.keys().next().value;
//         cache.delete(firstKey);
//       }
//       cache.set(cacheKey, result);

//       return result;
//     } catch (error) {
//       console.error('JSON parsing error:', error);
//       return null;
//     }
//   };
// })();

// Helper to normalize chart data to prevent Chart.js errors
// const normalizeChartData = (data) => {
//     if (!data || !data.labels || !data.datasets) return data;
//     return {
//         ...data,
//         datasets: data.datasets.map((ds) => ({
//             ...ds,
//             // Ensure data array length matches labels length
//             data: ds.data.slice(0, data.labels.length),
//         })),
//     };
// };

// Function to determine confidence color based on score
const getConfidenceColor = (score) => {
  if (score === null || score === undefined || score === 0) return '#9e9e9e';
  if (score <= 30) return '#f44336';
  if (score <= 50) return '#ff9800';
  if (score <= 70) return '#ffeb3b';
  if (score <= 85) return '#8bc34a';
  return '#4caf50';
};


// OPTIMIZED: CSV download with chunking to prevent blocking
const downloadCSV = (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for download');
    return;
  }

  // Limit data size to prevent memory issues
  const MAX_ROWS = 5000;
  const processData = data.length > MAX_ROWS ? data.slice(0, MAX_ROWS) : data;

  if (data.length > MAX_ROWS) {
    console.warn(`CSV data truncated from ${data.length} to ${MAX_ROWS} rows for performance`);
  }

  const allKeys = new Set();
  processData.forEach((row) => {
    if (row && typeof row === 'object') {
      Object.keys(row).forEach((key) => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);
  let csvContent = '';

  csvContent += headers.map((header) => `"${header.replace(/_/g, ' ')}"`).join(',') + '\n';

  // Process in chunks to prevent blocking
  const processChunk = (startIndex) => {
    const endIndex = Math.min(startIndex + 500, processData.length);

    for (let i = startIndex; i < endIndex; i++) {
      const row = processData[i];
      const values = headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return `"${value}"`;
      });
      csvContent += values.join(',') + '\n';
    }

    if (endIndex < processData.length) {
      setTimeout(() => processChunk(endIndex), 0);
    } else {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  processChunk(0);
};

const LoadingSkeleton = React.memo(() => (
  <div className={classes.loadingContainer}>
    <div className={classes.leftPaneSkeleton}>
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={400} />
    </div>
    <div className={classes.rightPaneSkeleton}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={100} style={{ marginTop: 20 }} />
      <Skeleton variant="rectangular" height={300} style={{ marginTop: 20 }} />
      <Skeleton variant="rectangular" height={200} style={{ marginTop: 20 }} />
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// OPTIMIZED: Memoized components
const ErrorMessage = React.memo(({ message }) => (
  <Box className={classes.error}>
    <Alert severity="error" variant="outlined">
      {message || 'An error occurred'}
    </Alert>
  </Box>
));

ErrorMessage.displayName = 'ErrorMessage';
ErrorMessage.propTypes = {
  message: PropTypes.string,
};
export const ChartComponent = React.memo(function ChartComponent({ dataPoints, type, chartKey }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [isChartReady, setIsChartReady] = useState(false);

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  useEffect(() => () => destroyChart(), [destroyChart]);

  useEffect(() => {
    if (!canvasRef.current) return;

    destroyChart();
    setIsChartReady(false);

    try {
      let chartData;
      let chartType = type || "bar";

      if (typeof dataPoints === "string") {
        const parsedData = parseJsonSafely(dataPoints);
        if (parsedData) {
          chartData = parsedData.data || parsedData;
          chartType = parsedData.type || chartType;
        }
      } else if (typeof dataPoints === "object" && dataPoints) {
        chartData = dataPoints.data || dataPoints;
      }

      if (!chartData) {
        console.warn("No valid chart data found");
        return;
      }

      chartData = normalizeChartData(chartData);
      // if (chartType === 'bar' && chartData?.datasets) {
      //       chartData.datasets.forEach(dataset => {
      //          if (Array.isArray(dataset.backgroundColor) && dataset.backgroundColor.length > 1) {
      //            dataset.backgroundColor = dataset.backgroundColor[0];
      //            }
      //          });
      //       }
      const ctx = canvasRef.current.getContext("2d");

      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" },
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#333",
              bodyColor: "#666",
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
              padding: 10,
              bodyFont: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" },
              titleFont: {
                family: "'Articulat CF', 'Inter', 'Poppins', sans-serif",
                weight: 600,
              },
            },
          },
          scales: {
            x: {
              ticks: { font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" } },
            },
            y: {
              beginAtZero: true,
              ticks: { font: { family: "'Articulat CF', 'Inter', 'Poppins', sans-serif" } },
            },
          },
        },
      });

      setIsChartReady(true);
    } catch (error) {
      console.error("Chart creation error:", error);
      setIsChartReady(false);
    }

    return () => destroyChart();
  }, [dataPoints, type, chartKey, destroyChart]);

  return (
    <div className={classes.chartWrapper} style={{ height: "100%", position: "relative" }}>
      {!isChartReady && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          Loading chart…
        </div>
      )}
      <canvas
        key={chartKey}
        ref={canvasRef}
        className={classes.chartCanvas}
        style={{ opacity: isChartReady ? 1 : 0 }}
      />
    </div>
  );
});

ChartComponent.displayName = "ChartComponent";

ChartComponent.propTypes = {
  dataPoints: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
  type: PropTypes.string,
  chartKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
// ------------------ ChartErrorBoundary ------------------ //
export class ChartErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false, error: null };
}


static getDerivedStateFromError(error) {
return { hasError: true, error };
}


componentDidCatch(error, errorInfo) {
console.error("ChartErrorBoundary caught an error:", error, errorInfo);
}


handleRetry = () => {
this.setState({ hasError: false, error: null });
};


render() {
if (this.state.hasError) {
return (
<Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, textAlign: "center" }}>
<Typography variant="body2" color="error" gutterBottom>
Unable to render chart.
</Typography>
<Button size="small" variant="outlined" onClick={this.handleRetry}>
Retry
</Button>
</Box>
);
}
return this.props.children;
}
}


ChartErrorBoundary.propTypes = {
children: PropTypes.node.isRequired,
};



// OPTIMIZED: Query Status Component
const QueryStatusIndicator = React.memo(({ isLoading, hasData, hasError, onRetry }) => {
  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" gap={1} padding={1}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="textSecondary">
          Loading query results...
        </Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box display="flex" alignItems="center" gap={1} padding={1}>
        <Typography variant="caption" color="error">
          Query failed
        </Typography>
        <IconButton size="small" onClick={onRetry} title="Retry query">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  if (!hasData) {
    return (
      <Box display="flex" alignItems="center" gap={1} padding={1}>
        <Typography variant="caption" color="textSecondary">
          No query results
        </Typography>
      </Box>
    );
  }

  return null;
});

QueryStatusIndicator.displayName = 'QueryStatusIndicator';
QueryStatusIndicator.propTypes = {
  isLoading: PropTypes.bool,
  hasData: PropTypes.bool,
  hasError: PropTypes.bool,
  onRetry: PropTypes.func,
};

// Error Boundary Component for table rendering
const TableErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Table rendering error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Unable to display table
        </Typography>
        <Typography variant="body2" color="textSecondary">
          The data set is too large or contains invalid data.
        </Typography>
        <Button variant="outlined" onClick={() => setHasError(false)} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return children;
};

TableErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function InsightsDashboard({ dashboardsReady }) {
  const insightsData = useSelector(selectInsightsScreenData);

  // Use the specific insights loading state selector instead of the combined one
  const isLoading = useSelector(selectInsightsDashboardLoading);
  const error = useSelector(selectDashboardError);
  const userFromState = useSelector(selectUser);

  // Get clientId from the selected industry in auth slice
  const clientId = useMemo(() => {
    if (!userFromState?.industries || !userFromState.selectedIndustry) return null;
    const industry = userFromState.industries.find((ind) => ind.name === userFromState.selectedIndustry);
    return industry?.clientId || null;
  }, [userFromState?.industries, userFromState?.selectedIndustry]);

  const [selectedInsightId, setSelectedInsightId] = useState(null);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeView, setActiveView] = useState('visualization');
  const [queryLoadingStates, setQueryLoadingStates] = useState({});
  const [queryErrors, setQueryErrors] = useState({});
  const [showExplainability] = useState(false); // Currently not toggled via UI

  // PERFORMANCE: Add state for view switching and downloading
  const [isViewSwitching, setIsViewSwitching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const dashboardRef = useRef(null);
  const viewSwitchTimeoutRef = useRef(null);

  const [executeInsightQuery] = useExecuteInsightQueryMutation();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (viewSwitchTimeoutRef.current) {
        clearTimeout(viewSwitchTimeoutRef.current);
      }
    };
  }, []);

  // Check if we should show the dashboard based on the dashboardsReady prop
  // or if insights data is already loaded and not loading
  const shouldShowDashboard = dashboardsReady?.insights || (!isLoading && insightsData?.length > 0);

  useEffect(() => {
    if (insightsData?.length && !selectedInsightId) {
      setSelectedInsightId(insightsData[0].insight_id);
    }
  }, [insightsData, selectedInsightId]);

  // OPTIMIZED: Memoized selected insight
  const selectedInsight = useMemo(
    () => insightsData?.find((insight) => insight.insight_id === selectedInsightId),
    [insightsData, selectedInsightId],
  );

  // OPTIMIZED: Enhanced table data extraction with size limits
  const selectedInsightDetailData = useMemo(() => {
    if (!selectedInsight) return [];

    try {
      let tableData = [];

      // Check for query_result first
      if (
        selectedInsight.query_result &&
        Array.isArray(selectedInsight.query_result) &&
        selectedInsight.query_result.length > 0
      ) {
        tableData = selectedInsight.query_result;
      } else if (selectedInsight.insight_anomaly_data_points) {
        const parsedData = parseJsonSafely(selectedInsight.insight_anomaly_data_points);
        if (Array.isArray(parsedData)) {
          tableData = parsedData;
        }
      }

      // Show status if query exists but no data yet
      if (tableData.length === 0 && selectedInsight.has_query) {
        const isLoading = queryLoadingStates[selectedInsightId];
        const hasError = queryErrors[selectedInsightId];

        if (isLoading) {
          return [{ Status: 'Loading query results...', '': '' }];
        } else if (hasError) {
          return [{ Status: 'Query failed', Error: hasError }];
        } else {
          return [{ Status: 'No query results available', '': '' }];
        }
      }

      // Limit data size to prevent memory issues
      const MAX_ROWS = 500;
      if (tableData.length > MAX_ROWS) {
        console.warn(`Table data truncated from ${tableData.length} to ${MAX_ROWS} rows for performance`);
        tableData = tableData.slice(0, MAX_ROWS);
      }

      return tableData;
    } catch (error) {
      console.error('Error processing insight data:', error);
      return [];
    }
  }, [selectedInsight, selectedInsightId, queryLoadingStates, queryErrors]);

  // OPTIMIZED: Memoized explainability parser
  const parseExplainabilitySummary = useCallback((summary) => {
    if (!summary) return [];

    try {
      let parsedSummary;

      if (Array.isArray(summary)) {
        parsedSummary = summary;
      } else if (typeof summary === 'string') {
        parsedSummary = parseJsonSafely(summary) || [summary];
      } else {
        parsedSummary = [summary];
      }

      return parsedSummary.map((item) => {
        if (typeof item === 'string') {
          const isHTML = item.includes('<') && item.includes('>');
          return { type: isHTML ? 'html' : 'text', content: item };
        }
        return { type: 'text', content: String(item) };
      });
    } catch (error) {
      console.error('Error parsing explainability summary:', error);
      return [];
    }
  }, []);

  // OPTIMIZED: Memoized chart type extraction
  const chartType = useMemo(() => {
    if (!selectedInsight?.data_points) return 'bar';

    try {
      const parsedData = parseJsonSafely(selectedInsight.data_points);
      return parsedData?.type || 'bar';
    } catch (error) {
      console.error('Error parsing chart type:', error);
      return 'bar';
    }
  }, [selectedInsight?.data_points]);

  // OPTIMIZED: Handle table view loading
  useEffect(() => {
    if (activeView === 'table' && selectedInsightDetailData.length > 50) {
      setTableLoading(true);
      const timer = setTimeout(() => setTableLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setTableLoading(false);
    }
  }, [activeView, selectedInsightDetailData.length]);

  // OPTIMIZED: Debounced view switching
  const handleToggleChange = useCallback(
    (view) => {
      if (isViewSwitching || !view) return;

      setIsViewSwitching(true);

      if (viewSwitchTimeoutRef.current) {
        clearTimeout(viewSwitchTimeoutRef.current);
      }

      viewSwitchTimeoutRef.current = setTimeout(() => {
        setActiveView(view);
        setIsViewSwitching(false);
      }, 100);
    },
    [isViewSwitching],
  );
  const dispatch = useDispatch();
  const selectedRole = useSelector(selectSelectedRole);
  const selectedIndustry = useSelector(selectSelectedIndustry);
  const personaId = userFromState?.industries
    ?.find((i) => i.name === selectedIndustry)
    ?.personas?.find((p) => p.name === selectedRole)?.id;
  const [downloadInsightsAsPpt, { isLoading: isDownloadingPpt }] = useDownloadInsightsAsPptMutation();
  const [downloadingInsightId, setDownloadingInsightId] = useState(null);
  const handleDownloadInsightPpt = async (insight) => {
    if (!insight) return;
    setDownloadingInsightId(insight.insight_id);
  
    const payload = {
      persona_id: personaId,
      insight_ids_lst: [insight.insight_id],
      persona: selectedRole || "Unknown Persona",
    };
  
    try {
      await downloadInsightsAsPpt(payload).unwrap();
      dispatch(
        notifyViaSnackBar({
          open: true,
          message: "📥 Your PPT download has completed!",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("❌ Error downloading PPT for insight:", err);
    } finally {
      setDownloadingInsightId(null);
    }
  };
  


  // OPTIMIZED: Async CSV download
  const handleDownloadCSV = useCallback(async () => {
    if (activeView !== 'table' || !selectedInsightDetailData.length || !selectedInsight || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const filename = selectedInsight.insight_title
        ? selectedInsight.insight_title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')
        : 'insight_data';

      await new Promise((resolve) => {
        downloadCSV(selectedInsightDetailData, filename);
        setTimeout(resolve, 1000);
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [activeView, selectedInsightDetailData, selectedInsight, isDownloading]);

  // OPTIMIZED: Query execution function
  const handleExecuteQuery = useCallback(
    async (insightId) => {
      const insight = insightsData?.find((i) => i.insight_id === insightId);
      if (!insight?.sql_query) return;

      setQueryLoadingStates((prev) => ({ ...prev, [insightId]: true }));
      setQueryErrors((prev) => ({ ...prev, [insightId]: null }));

      try {
        const result = await executeInsightQuery({
          insightId,
          sql_query: insight.sql_query,
        }).unwrap();

        if (result.success) {
          console.log('Query executed successfully for insight:', insightId);
        }
      } catch (error) {
        console.error('Query execution failed:', error);
        setQueryErrors((prev) => ({ ...prev, [insightId]: error.message || 'Query failed' }));
      } finally {
        setQueryLoadingStates((prev) => ({ ...prev, [insightId]: false }));
      }
    },
    [insightsData, executeInsightQuery],
  );

  const handleViewDetails = useCallback(() => {
    if (selectedInsightId) {
      setIsDetailsOpen(true);
    }
  }, [selectedInsightId]);

  const parseFaqs = useCallback((faqString) => {
    if (!faqString) return [];

    const parsedFaqs = parseJsonSafely(faqString);
    return Array.isArray(parsedFaqs) ? parsedFaqs : [];
  }, []);

  const toggleFaq = useCallback((index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  useEffect(() => {
    setIsDetailsOpen(false);
    if (selectedInsightId) {
      setExpandedFaqs({});
    }
  }, [selectedInsightId]);

  // OPTIMIZED: Memoized brief section render
  const renderBriefSection = useMemo(() => {
    if (!selectedInsight?.insight_brief) return null;

    const explainabilitySummary = parseExplainabilitySummary(selectedInsight.explainability_summary);
    const formattedBrief = formatInsightBrief(selectedInsight.insight_brief);

    return (
      <div className={`${classes.brief} ${showExplainability ? classes.showExplainability : ''}`}>
        <div className={classes.briefContentWrapper}>
          <div className={`${classes.briefContent} ${showExplainability ? classes.withExplainability : ''}`}>
            {formattedBrief.length > 0 ? (
              <div className={classes.briefContainer}>{formattedBrief}</div>
            ) : (
              selectedInsight.insight_brief
            )}
          </div>
          {showExplainability && explainabilitySummary.length > 0 && (
            <div className={classes.explainabilitySummary}>
              {explainabilitySummary.map((item, index) => (
                <div key={index} className={classes.explainabilityItem}>
                  {item.type === 'html' ? (
                    <div className={classes.htmlContent} dangerouslySetInnerHTML={{ __html: item.content }} />
                  ) : (
                    <Typography variant="body2" className={classes.textContent}>
                      {item.content}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }, [
    selectedInsight?.insight_brief,
    selectedInsight?.explainability_summary,
    showExplainability,
    parseExplainabilitySummary,
  ]);

  if (!shouldShowDashboard && isLoading) {
    return <LoadingSkeleton />;
  }

  if (error && !insightsData?.length) {
    return <ErrorMessage message={error} />;
  }

  if (!insightsData?.length && !isLoading) {
    return (
      <Box className={classes.noData}>
        <Typography variant="h6" gutterBottom>
          No insights available
        </Typography>
        <Typography variant="body2" color="textSecondary">
          There are no insights to display at this time.
        </Typography>
      </Box>
    );
  }

  return (
    <div className={classes.container} ref={dashboardRef}>
      <Paper elevation={0} className={classes.leftPane}>
        <div className={classes.insightsList}>
          {insightsData.map((insight) => (
            <div
              key={insight.insight_id}
              className={`${classes.insightItem} ${selectedInsightId === insight.insight_id ? classes.selected : ''}`}
              onClick={() => setSelectedInsightId(insight.insight_id)}>
              <Typography>{insight.insight_title}</Typography>
              {queryLoadingStates[insight.insight_id] && <CircularProgress size={16} style={{ marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
      </Paper>

      <Paper elevation={0} className={classes.rightPane}>
        {selectedInsight && (
          <>
            <div className={classes.header}>
              <div className={classes.headerContent}>
                <Typography variant="h5" className={classes.title}>
                  {selectedInsight.insight_title}
                </Typography>
                <Tooltip title="Download as PPT">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleDownloadInsightPpt(selectedInsight)}
                      disabled={isDownloadingPpt}
                    >
                      {isDownloadingPpt && downloadingInsightId === selectedInsight.insight_id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <img src={powerpoint} alt="ppt" style={{ width: 20, height: 20 }} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>

                {clientId !== 4 &&
                  selectedInsight.confidence_score !== undefined &&
                  selectedInsight.confidence_score !== null &&
                  (selectedInsight.confidence_score > 0 && selectedInsight.explainability_summary ? (
                    <Tooltip
                      title={
                        <div className={classes.explainabilityContent}>
                          <Typography variant="subtitle2" className={classes.explainabilityTitle}>
                            <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
                            Explainability Summary
                          </Typography>
                          <div className={classes.explainabilityTextContainer}>
                            <div className={classes.explainabilityList}>
                              {parseExplainabilitySummary(selectedInsight.explainability_summary).map((item, index) => (
                                <div key={index} className={classes.explainabilityItem}>
                                  {item.type === 'html' ? (
                                    <div
                                      className={classes.htmlContent}
                                      dangerouslySetInnerHTML={{ __html: item.content }}
                                    />
                                  ) : (
                                    <Typography variant="body1" className={classes.textContent}>
                                      {item.content}
                                    </Typography>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      }
                      interactive={true}
                      enterDelay={100}
                      leaveDelay={300}
                      placement="bottom-start"
                      classes={{ tooltip: classes.explainabilityPopover, popper: classes.explainabilityPopper }}>
                      <div className={classes.confidenceIndicator}>
                        <div className={classes.confidenceScoreContainer}>
                          <CircularProgress
                            variant="determinate"
                            value={selectedInsight.confidence_score || 0}
                            size={40}
                            thickness={6}
                            sx={{
                              color: getConfidenceColor(selectedInsight.confidence_score),
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                              },
                            }}
                          />
                          <div className={classes.confidenceScoreValue}>
                            <Typography variant="caption" component="div" style={{ fontWeight: 500 }}>
                              <strong style={{ fontWeight: 600 }}>
                                {Math.round(selectedInsight.confidence_score || 0)}%
                              </strong>
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  ) : (
                    <div className={classes.confidenceIndicator}>
                      <div className={classes.confidenceScoreContainer}>
                        <CircularProgress
                          variant="determinate"
                          value={selectedInsight.confidence_score || 0}
                          size={40}
                          thickness={6}
                          sx={{
                            color: getConfidenceColor(selectedInsight.confidence_score),
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            },
                          }}
                        />
                        <div className={classes.confidenceScoreValue}>
                          <Typography variant="caption" component="div" style={{ fontWeight: 500 }}>
                            <strong style={{ fontWeight: 600 }}>
                              {Math.round(selectedInsight.confidence_score || 0)}%
                            </strong>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {renderBriefSection}
            <div className={classes.toggleContainer}>
              <InsightsToggleView activeView={activeView} onChange={handleToggleChange} />
                
                

              <Button
                variant="outlined"
                size="small"
                startIcon={isDownloading ? <CircularProgress size={12} /> : <DownloadIcon />}
                onClick={handleDownloadCSV}
                disabled={isDownloading || isViewSwitching}
                className={classes.downloadButton}
                sx={{
                  marginLeft: '8px',
                  textTransform: 'none',
                  fontSize: '0.5rem',
                  padding: '1px 2px',
                  minWidth: 'auto',
                  borderColor: 'transparent !important',
                  color: '#f7901d',
                  visibility: activeView === 'table' && selectedInsightDetailData.length > 0 ? 'visible' : 'hidden',
                  '&:hover': {
                    backgroundColor: 'transparent !important',
                  },
                }}>
                {isDownloading ? 'Downloading...' : ''}
              </Button>
            </div>
            <div className={`${classes.chartSection} ${activeView === 'table' ? classes.tableView : ''}`}>
              <QueryStatusIndicator
                isLoading={queryLoadingStates[selectedInsightId] || tableLoading}
                hasData={selectedInsight.query_result && selectedInsight.query_result.length > 0}
                hasError={queryErrors[selectedInsightId]}
                onRetry={() => handleExecuteQuery(selectedInsightId)}
              />

              {activeView === 'visualization' ? (
                 <div className={classes.chartWrapper}>
                   <ChartErrorBoundary>
                    <ChartComponent
                      dataPoints={selectedInsight.data_points}
                      type={chartType}
                      chartKey={selectedInsight.insight_id} // Pass a unique key to ensure re-mount
                  />
                   </ChartErrorBoundary>
                 
             
                 {/* Floating download button */}
                 {/* <Tooltip title="Download as PPT">
                   <span>
                     <IconButton
                       size="small"
                       className={classes.downloadButton}
                       onClick={() => handleDownloadInsightPpt(selectedInsight)}
                       disabled={isDownloadingPpt && downloadingInsightId === selectedInsight.insight_id}
                     >
                       {isDownloadingPpt && downloadingInsightId === selectedInsight.insight_id ? (
                         <CircularProgress size={16} color="inherit" />
                       ) : (
                         <DescriptionIcon fontSize="small" />
                       )}
                     </IconButton>
                   </span>
                 </Tooltip> */}
               </div>
              ) : (
                <TableErrorBoundary>
                  {!isViewSwitching && !tableLoading ? (
                    <InsightsDataTable
                      dataPoints={selectedInsightDetailData}
                      isLoading={queryLoadingStates[selectedInsightId]}
                      onRetryQuery={() => handleExecuteQuery(selectedInsightId)}
                    />
                  ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                      <CircularProgress />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Loading table view...
                      </Typography>
                    </Box>
                  )}
                </TableErrorBoundary>
              )}
            </div>
            
            {/* Only show Details button for clientIds other than 4 (Pharmaceutical) */}
            {clientId !== 4 && (
              <div className={classes.detailsButtonContainer}>
                <Button
                  variant="outlined"
                  className={classes.viewDetailsButton}
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewDetails}>
                  View Details
                </Button>
              </div>
            )}
            <div className={classes.dividerContainer}>
              <div className={classes.divider} />
              <MoreHorizIcon className={classes.dividerIcon} />
              <div className={classes.divider} />
            </div>
            <div className={classes.faqSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                FAQs
              </Typography>
              <div className={classes.faqList}>
                {parseFaqs(selectedInsight.insight_faqs).map((faq, index) => (
                  <Paper key={index} elevation={0} className={classes.faqItem}>
                    <div className={classes.faqQuestion} onClick={() => toggleFaq(index)}>
                      <Typography variant="subtitle1">{faq.question}</Typography>
                      <IconButton size="small" className={classes.expandButton}>
                        {expandedFaqs[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </div>
                    {expandedFaqs[index] && <Typography className={classes.faqAnswer}>{faq.answer}</Typography>}
                  </Paper>
                ))}
              </div>
            </div>
          </>
        )}
      </Paper>

      {/* Only render DetailsPanel for clientIds other than 4 (Pharmaceutical) */}
      {clientId !== 4 && (
        <DetailsPanel
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          selectedInsightId={selectedInsightId}
        />
      )}
    </div>
  );
}

InsightsDashboard.propTypes = {
  dashboardsReady: PropTypes.object,
  dashboardsLoading: PropTypes.object,
  executingQueries: PropTypes.bool,
  currentProcessingInsight: PropTypes.string,
};

export default InsightsDashboard;


import { useMemo, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { Box, Typography, Paper, Alert, Button, CircularProgress , IconButton, Tooltip} from '@mui/material';
import PropTypes from 'prop-types';
import {useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { Skeleton } from '@mui/material';
import jsPDF from 'jspdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UpdateIcon from '@mui/icons-material/Update';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; 
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import { useDownloadDashboardAsPptMutation } from '../../services/dashboardApi';
import {
  notifyViaSnackBar,
} from '../../redux/store/conversationSlice';

import powerpoint from '../../assets/powerpoint.svg';
import {
  selectHomeScreenData,
  selectHomeDashboardLoading,
  selectDashboardError,
} from '../../redux/store/dashboardSlice';
import { selectUser, selectSelectedIndustry, selectSelectedRole } from '../../features/auth/authSlice';
import classes from './HomeDashboard.module.scss';
import ChartComponent from './ChartComponent';

/**
 * Error message component with retry action
 */
const ErrorMessage = ({ message, onRetry }) => (
  <Box className={classes.error}>
    <Alert
      severity="error"
      variant="outlined"
      icon={<ErrorOutlineIcon />}
      action={
        onRetry && (
          <Button color="error" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }>
      <Typography variant="subtitle2">{message || 'An error occurred'}</Typography>
    </Alert>
  </Box>
);

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

/**
 * Enhanced modern loading skeleton optimized for progressive loading
 */
const LoadingSkeleton = ({ dashboardsReady }) => (
  <div className={classes.container}>
    <Box className={classes.loadingOverlay}>
      <CircularProgress size={48} thickness={4} sx={{ color: '#f7901d', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        {dashboardsReady?.home ? 'Dashboard Ready' : 'Loading Dashboard'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {dashboardsReady?.home ? 'Rendering your personalized insights...' : 'Preparing your personalized insights...'}
      </Typography>
    </Box>

    <div className={classes.dashboardContent}>
      {/* Trend Section */}
      <div className={classes.section}>
        <div className={classes.trendGrid}>
          {[...Array(3)].map((_, index) => (
            <Paper key={`trend-${index}`} className={`${classes.card} ${classes.trendCard}`} elevation={0}>
              <div className={classes.cardHeader}>
                <Skeleton variant="text" width="60%" height={20} />
              </div>
              <div className={classes.trendCardContent}>
                <div className={classes.statsSection}>
                  <Skeleton variant="text" width="80%" height={32} className={classes.mainValue} />
                  <div className={classes.trendIndicator}>
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="text" width="30%" height={16} />
                  </div>
                </div>
                <div className={classes.chartSection}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </div>

      {/* Normal Sections */}
      {[...Array(2)].map((_, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className={classes.section}>
          <div className={classes.normalGrid} data-items="2">
            {[...Array(2)].map((_, cardIndex) => (
              <Paper
                key={`normal-${sectionIndex}-${cardIndex}`}
                className={`${classes.card} ${classes.normalCard}`}
                elevation={0}>
                <div className={classes.cardHeader}>
                  <Skeleton variant="text" width="70%" height={20} />
                </div>
                <div className={classes.cardBody}>
                  <Skeleton variant="rectangular" width="100%" height="100%" className={classes.chartSkeleton} />
                </div>
              </Paper>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

LoadingSkeleton.propTypes = {
  dashboardsReady: PropTypes.object,
};

/**
 * No data available component with refresh action
 */
const NoDataAvailable = ({ onRefresh }) => (
  <Box className={classes.noDataContainer}>
    <DataUsageIcon sx={{ fontSize: 64, color: '#f7901d', opacity: 0.6, mb: 2 }} />
    <Typography variant="h5" gutterBottom>
      No Dashboard Data Available
    </Typography>
    <Typography variant="body1" color="textSecondary" paragraph>
      We couldn&apos;t find any data to display for your current selection.
    </Typography>
    {onRefresh && (
      <Button variant="outlined" color="primary" startIcon={<RefreshIcon />} onClick={onRefresh} sx={{ mt: 2 }}>
        Refresh Dashboard
      </Button>
    )}
  </Box>
);

NoDataAvailable.propTypes = {
  onRefresh: PropTypes.func,
};

const formatDate = () => {
  try {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formattedDate} - ${formattedTime}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

const triggerFileDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const HomeDashboard = forwardRef((props, ref) => {
  const { dashboardsReady, isLoading: externalLoading, isReady } = props;

  const dashboardRef = useRef(null);
  const chartRefs = useRef({});
  const dashboardData = useSelector(selectHomeScreenData);
  // Use specific loading state for home dashboard
  const isHomeLoading = useSelector(selectHomeDashboardLoading);
  const error = useSelector(selectDashboardError);
  const user = useSelector(selectUser);
  const selectedIndustry = useSelector(selectSelectedIndustry);
  const selectedRole = useSelector(selectSelectedRole);
  const [isExporting, setIsExporting] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); 
  const [dynamicChartTitles, setDynamicChartTitles] = useState({});

  const [downloadChartAsPpt, { isLoading: isDownloadingPpt }] = useDownloadDashboardAsPptMutation();
  const [downloadingChartId, setDownloadingChartId] = useState(null);

  const personaId = user?.industries
    ?.find((i) => i.name === selectedIndustry)
    ?.personas?.find((p) => p.name === selectedRole)?.id;
  

  // Use both external and internal loading states
  // External loading comes from props (parent component)
  // Internal loading comes from Redux state (API calls)
  const isLoading = externalLoading !== undefined ? externalLoading : isHomeLoading;

  // Determine if dashboard should be shown based on multiple factors
  const shouldShowDashboard =
    (isReady !== undefined ? isReady : dashboardsReady?.home) ||
    (!isLoading && !localLoading && dashboardData?.length > 0);

  const handleChartFilterChange = useCallback((visualId, newTitle) => {
    setDynamicChartTitles(prev => ({
      ...prev,
      [visualId]: newTitle,
    }));
  },[]);;

  const handleRefresh = async () => {
    try {
      if (!personaId) return;

      setLocalLoading(true);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  

  // Enhanced PDF export function
  const handleExportPDF = async () => {
    if (!dashboardRef.current || isExporting) return;

    setIsExporting(true);

    try {
      // Wait for any pending renders or animations
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the dashboard container
      const dashboardElement = dashboardRef.current;

      // Ensure all charts are rendered before capturing
      const chartElements = dashboardElement.querySelectorAll('canvas');
      await Promise.all(
        Array.from(chartElements).map((canvas) => {
          return new Promise((resolve) => {
            if (canvas.complete !== false) {
              resolve();
            } else {
              canvas.onload = resolve;
              canvas.onerror = resolve;
            }
          });
        }),
      );

      // Scroll to top to ensure full capture
      const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo(0, 0);

      // Wait for scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Configure html2canvas with optimized settings for dashboard capture
      const canvas = await html2canvas(dashboardElement, {
        scale: 2, // High quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        width: dashboardElement.scrollWidth,
        height: dashboardElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        ignoreElements: (element) => {
          // Ignore loading overlays, tooltips, and other non-essential elements
          return (
            element.classList?.contains('loading-overlay') ||
            element.classList?.contains('tooltip') ||
            element.getAttribute('role') === 'tooltip'
          );
        },
      });

      // Restore original scroll position
      window.scrollTo(0, originalScrollTop);

      const imgData = canvas.toDataURL('image/png', 1.0);

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit the page while maintaining aspect ratio
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth, imgHeight, x, y;

      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider than PDF page
        imgWidth = pdfWidth - 20; // 10mm margin on each side
        imgHeight = imgWidth / imgAspectRatio;
        x = 10;
        y = (pdfHeight - imgHeight) / 2;
      } else {
        // Image is taller than PDF page
        imgHeight = pdfHeight - 20; // 10mm margin on top and bottom
        imgWidth = imgHeight * imgAspectRatio;
        x = (pdfWidth - imgWidth) / 2;
        y = 10;
      }

      // Add header with dashboard info
      pdf.setFontSize(16);
      pdf.setTextColor(247, 144, 29); // Orange color
      pdf.text('Dashboard Export', 10, 15);

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Generated: ${formatDate()}`, 10, 22);
      pdf.text(`User: ${user?.preferred_username || 'Unknown'}`, 10, 27);
      pdf.text(`Industry: ${selectedIndustry || 'N/A'}`, 10, 32);
      pdf.text(`Role: ${selectedRole || 'N/A'}`, 10, 37);

      // Adjust y position to account for header
      y = Math.max(y, 45);
      imgHeight = Math.min(imgHeight, pdfHeight - y - 10);
      imgWidth = imgHeight * imgAspectRatio;

      // Add the dashboard image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');

      // Generate filename with timestamp and user info
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Dashboard-${selectedIndustry || 'Dashboard'}-${timestamp}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      // You could add a toast notification here
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  

  const dispatch = useDispatch();
  const fetchAndDownload = (blobLink, fallbackName = "dashboard.pptx") => {
    dispatch(
      notifyViaSnackBar({
        open: true,
        message: "📥 Your PPT download has completed!",
        severity: "success",
      })
    );
    const a = document.createElement("a");
    a.href = blobLink;
    a.download = fallbackName; // Browser may ignore if server sets filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  
  const handleDownloadChart = async (visual) => {
    if (!personaId || !selectedRole) {
      alert("Cannot download: Missing persona information.");
      return;
    }
  
    setDownloadingChartId(visual.visual_id);
  
    try {
      const payload = {
        persona_id: String(personaId),
        visual_ids_lst: [String(visual.visual_id)],
        persona: selectedRole,
        filters: visual.filters || {},
      };
  
      const response = await downloadChartAsPpt(payload).unwrap();
  
      if (response?.status !== "success" || !response?.blob_link) {
        throw new Error("Server did not return a PPT link.");
      }
  
      await fetchAndDownload(response.blob_link, `${visual.visual_title || "chart"}.pptx`);
  
    } catch (err) {
      console.error("❌ Failed to download chart:", err);
      alert("Sorry, the chart download failed. Please try again.");
    } finally {
      setDownloadingChartId(null);
    }
  };
  
  

  useImperativeHandle(ref, () => ({
    handleRefresh,
    handleExportPDF,
  }));

  const formatPercentChange = (change) => {
    if (!change && change !== 0) return '';
    const value = Number(change).toFixed(2);
    return value > 0 ? `+${value}%` : `${value}%`;
  };

  // Update the organizedData useMemo
  const organizedData = useMemo(() => {
    if (!dashboardData?.length) return {};

    // Separate trend charts and normal charts
    const trendCharts = dashboardData.filter((item) => item.visual_type == 'trend');
    const normalCharts = dashboardData.filter((item) => item.visual_type !== 'trend');

    // Initialize organized object
    const organized = {};

    // Handle trend charts first
    if (trendCharts.length > 0) {
      // Check if all trend charts have same priority
      const allSamePriority = trendCharts.every((chart) => chart.priority === trendCharts[0].priority);

      if (allSamePriority) {
        organized[trendCharts[0].priority] = new Array(Math.max(...trendCharts.map((c) => c.preference))).fill(null);
        trendCharts.forEach((chart) => {
          organized[chart.priority][chart.preference - 1] = chart;
        });
      } else {
        // Different priorities - organize in column
        const trendPriorities = [...new Set(trendCharts.map((c) => c.priority))].sort();
        trendPriorities.forEach((priority) => {
          const priorityCharts = trendCharts.filter((c) => c.priority === priority);
          organized[priority] = new Array(Math.max(...priorityCharts.map((c) => c.preference))).fill(null);
          priorityCharts.forEach((chart) => {
            organized[priority][chart.preference - 1] = chart;
          });
        });
      }
    }

    // Handle normal charts
    normalCharts.forEach((chart) => {
      if (!organized[chart.priority]) {
        organized[chart.priority] = new Array(
          Math.max(...normalCharts.filter((c) => c.priority === chart.priority).map((c) => c.preference)),
        ).fill(null);
      }
      organized[chart.priority][chart.preference - 1] = chart;
    });

    return organized;
  }, [dashboardData]);

  // Render states with improved hierarchy based on dashboard readiness
  if (!shouldShowDashboard && (isLoading || localLoading)) {
    return <LoadingSkeleton dashboardsReady={dashboardsReady} />;
  }

  if (error && !dashboardData?.length) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  // Show no data only if we have no data and we're not loading
  if (!dashboardData?.length && !isLoading && !localLoading) {
    return <NoDataAvailable onRefresh={handleRefresh} />;
  }

  // Render the actual dashboard content
  return (
    <div className={classes.container}>
      {/* Export status indicator */}
      {isExporting && (
        <Box className={classes.loadingOverlay} style={{ zIndex: 9999 }}>
          <CircularProgress size={48} thickness={4} sx={{ color: '#f7901d', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Exporting Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please wait while we generate your PDF...
          </Typography>
        </Box>
      )}

      <div className={classes.dashboardContent} ref={dashboardRef}>
        {Object.entries(organizedData)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([priority, items]) => {
            const isTrendSection = items.some((item) => item.visual_type == 'trend');
            const validItems = items.filter(Boolean);
            const isVerticalLayout =
              isTrendSection && validItems.some((item) => item.priority !== validItems[0].priority);

            return (
              <div
                key={priority}
                className={`${classes.section} ${isTrendSection ? classes.trendSection : classes.normalSection}`}
                data-layout={isVerticalLayout ? 'vertical' : 'horizontal'}>
                <div
                  className={`${classes.grid} ${isTrendSection ? classes.trendGrid : classes.normalGrid}`}
                  data-items={validItems.length}>
                  {items.map((item, index) =>
                    item ? (
                      <Paper
                        key={item.visual_id}
                        elevation={0}
                        className={`${classes.card} ${
                          item.visual_type == 'trend' ? classes.trendCard : classes.normalCard
                        }`}>
                        <div className={classes.cardHeader}>
                          <Typography className={classes.cardTitle}>{dynamicChartTitles[item.visual_id] || item.visual_title}</Typography>
                          <div className={classes.downloadButton}>
                            <Tooltip title="Download as PPT">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadChart(item)}
                                  disabled={isDownloadingPpt}
                                  sx={{ color: '#888' }}
                                >
                                  {downloadingChartId === item.visual_id ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : (
                                    <img src={powerpoint} alt="ppt" style={{ width: 20, height: 20 }} />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            
                            <Tooltip title="Fullscreen">
                              <IconButton
                                size="small"
                                onClick={() => chartRefs.current[item.visual_id]?.toggleFullscreen()}
                                sx={{ color: '#888' }}
                              >
                                <FullscreenIcon style={{ width: 20, height: 20 }} />
                              </IconButton>
                            </Tooltip>
                            
                          </div>
                        </div>
                        {item.visual_type == 'trend' ? (
                          <div className={classes.trendCardContent}>
                            <div className={classes.statsSection}>
                              <Typography variant="h4" className={classes.mainValue}>
                                {item.current_value}
                              </Typography>
                              <div className={classes.trendIndicator}>
                                <Typography
                                  className={
                                    item.is_positive_trend !== null
                                      ? item.is_positive_trend
                                        ? classes.positiveChange
                                        : classes.negativeChange
                                      : classes.normalChange
                                  }>
                                  {formatPercentChange(item.percent_change)}
                                </Typography>
                                <Typography variant="body2" className={classes.periodType}>
                                  ({item.period_type})
                                </Typography>
                              </div>
                            </div>
                            <div className={classes.chartSection}>
                              <ChartComponent
                                ref={el => (chartRefs.current[item.visual_id] = el)}
                                dataPoints={item.data_points}
                                type={item.visual_type}
                                isPositive={item.is_positive_trend}
                                visualTitle={item.visual_title}
                                personaId={personaId} 
                                visualId={String(item.visual_id)} 
                                onFilterChange={handleChartFilterChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className={classes.cardBody}>
                            <ChartComponent
                              ref={el => (chartRefs.current[item.visual_id] = el)}
                              dataPoints={item.data_points}
                              type={item.visual_type}
                              visualTitle={item.visual_title}
                              personaId={personaId} 
                              visualId={String(item.visual_id)} 
                              onFilterChange={handleChartFilterChange}
                            />
                          </div>
                        )}
                      </Paper>
                    ) : (
                      <div key={`empty-${priority}-${index}`} className={classes.emptySlot} />
                    ),
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
});

HomeDashboard.displayName = 'HomeDashboard';

HomeDashboard.propTypes = {
  dashboardsReady: PropTypes.object,
  isLoading: PropTypes.bool, // Added prop for external loading state
  isReady: PropTypes.bool, // Added prop for external ready state
};

export default HomeDashboard;

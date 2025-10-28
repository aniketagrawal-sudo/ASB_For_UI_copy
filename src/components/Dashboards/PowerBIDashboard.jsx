import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import {
  useGetPowerBIConfigQuery,
  useGetPowerBIEmbedTokenQuery,
  useGetPowerBIReportsQuery,
  useTrackPowerBIUsageMutation,
} from '../../services/dashboardApi';
import classes from './PowerBIDashboard.module.scss';

/**
 * PowerBI Dashboard Component with Azure AD support
 * Optimized for error handling and CSP compatibility
 */
const PowerBIDashboard = forwardRef(({ hideControls = false, industryId, personaId }, ref) => {
  // Core state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [reportName, setReportName] = useState('Power BI Reports');

  // UI state
  const [directLinkDialogOpen, setDirectLinkDialogOpen] = useState(false);
  const [directReportLink, setDirectReportLink] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [reportMenuAnchor, setReportMenuAnchor] = useState(null);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  // Current report state for token management
  const [currentReportId, setCurrentReportId] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  // SDK state
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [modelsInitialized, setModelsInitialized] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);

  // Enhanced error tracking state
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState(null);

  // Refs for better state management
  const reportContainerRef = useRef(null);
  const currentReportRef = useRef(null);
  const tokenTimerRef = useRef(null);
  const componentMountedRef = useRef(true);
  const configRef = useRef(null);
  const tokenProcessingRef = useRef(false);
  const embedTimeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Storage key for recent reports
  const RECENT_REPORTS_KEY = 'powerbi_recent_reports';
  const MAX_RETRY_ATTEMPTS = 3;

  // API data fetching with RTK Query
  const {
    data: powerbiConfig,
    isLoading: configLoading,
    error: configError,
    refetch: refetchConfig,
  } = useGetPowerBIConfigQuery({
    industryId,
    personaId,
  });

  // Get configuration derived values
  const DEFAULT_REPORT_ID = powerbiConfig?.data?.demoReports?.[0]?.id || 'f0ffd399-cafd-47a9-a404-8b75c92d93eb';
  const DEFAULT_WORKSPACE_ID = powerbiConfig?.data?.workspaceId || 'ab6e20ca-bbb6-41cc-a814-5c030242f8b1';

  // Update group ID when config is loaded
  useEffect(() => {
    if (powerbiConfig?.data?.workspaceId && !currentGroupId) {
      setCurrentGroupId(powerbiConfig.data.workspaceId);
    }
  }, [powerbiConfig, currentGroupId]);

  // Make sure group ID is set
  useEffect(() => {
    if (!currentGroupId) {
      setCurrentGroupId(DEFAULT_WORKSPACE_ID);
    }
  }, [currentGroupId, DEFAULT_WORKSPACE_ID]);

  const {
    data: availableReports,
    isLoading: reportsLoading,
  } = useGetPowerBIReportsQuery(undefined, {
    skip: !reportsDialogOpen, // Only fetch when dialog is open
  });

  const {
    data: embedTokenData,
    error: tokenError,
    refetch: refetchToken,
  } = useGetPowerBIEmbedTokenQuery(
    { reportId: currentReportId, groupId: currentGroupId },
    { skip: !currentReportId || !currentGroupId }, // Skip until we have a report ID and group ID
  );

  // Mutation for tracking usage
  const [trackUsage] = useTrackPowerBIUsageMutation();

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    refresh: handleRefresh,
  }));

  // Save a report to recent reports
  const saveToRecentReports = useCallback((report) => {
    if (!report || !report.id || !report.name) return;

    setRecentReports((prevReports) => {
      // Create updated list with the current report at the top
      const newReport = {
        ...report,
        lastViewed: new Date().toISOString(),
      };

      // Remove any existing instance of this report
      const filtered = prevReports.filter((r) => r.id !== report.id);

      // Add to beginning, limit to 10 reports
      const updated = [newReport, ...filtered].slice(0, 10);

      // Save to localStorage
      try {
        localStorage.setItem(RECENT_REPORTS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving recent reports to localStorage:', err);
      }

      return updated;
    });
  }, []);

  // Function to create the necessary models object with numeric values
  const createModelsObject = useCallback(() => {
    if (window.powerbi && !window.powerbi.models) {
      window.powerbi.models = {
        TokenType: { Aad: 0, Embed: 1 }, // Using numeric values
        Permissions: { Read: 1, ReadWrite: 2 },
        ViewMode: { View: 0, Edit: 1 },
        BackgroundType: { Default: 1, Transparent: 0 },
        LayoutType: { Master: 0, Custom: 1 },
      };
      setModelsInitialized(true);
    }
  }, []);

  // Menu handlers
  const handleOpenReportMenu = useCallback((event) => {
    setReportMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseReportMenu = useCallback(() => {
    setReportMenuAnchor(null);
  }, []);

  // Dialog handlers
  const handleOpenDirectLinkDialog = useCallback(() => {
    setDirectLinkDialogOpen(true);
    handleCloseReportMenu();
  }, [handleCloseReportMenu]);

  // Open reports browser dialog
  const openReportsBrowser = useCallback(() => {
    handleCloseReportMenu();
    setReportsDialogOpen(true);
    setError(null);

    // Track usage event
    trackUsage({
      event: 'browse_reports_open',
      details: { source: 'menu' },
    }).catch((err) => console.error('Error tracking usage:', err));
  }, [handleCloseReportMenu, trackUsage]);

  // Clear all retry-related state
  const clearRetryState = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Enhanced retry logic with exponential backoff
  const scheduleRetry = useCallback(
    (errorInfo, shouldRetry = false) => {
      if (!shouldRetry || retryCount >= MAX_RETRY_ATTEMPTS || !componentMountedRef.current) {
        return false;
      }

      const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds

      setRetryCount((prev) => prev + 1);
      setLastError(errorInfo);

      retryTimeoutRef.current = setTimeout(() => {
        if (componentMountedRef.current && currentReportRef.current) {
          tokenProcessingRef.current = false;
          refetchToken();
        }
      }, backoffDelay);

      return true;
    },
    [retryCount, refetchToken],
  );

  // Embed report using token data with comprehensive error handling
  const embedReportWithToken = useCallback(
    (reportData, tokenData) => {
      if (!sdkLoaded || !reportData || !tokenData) {
        console.warn('Cannot embed: missing dependencies', {
          sdkLoaded,
          hasReportData: !!reportData,
          hasTokenData: !!tokenData,
        });
        return;
      }

      // Clear retry state on successful token receipt
      clearRetryState();

      // Validate token - handle demo token specially
      if (tokenData.token === 'demo-token-for-fallback-only' || tokenData.isDemoMode) {
        setError('Note: Using demo mode. Some features may be limited.');
        setDemoMode(true);
        setLoading(false);
        saveToRecentReports(reportData);
        return;
      }

      try {
        // Clean up any existing report
        if (report) {
          try {
            report.off('loaded');
            report.off('error');
            report.off('rendered');
            setReport(null);
          } catch (err) {
            console.warn('Error cleaning up previous report:', err);
          }
        }

        // Make sure container is available
        const container = reportContainerRef.current;
        if (!container) {
          throw new Error('Report container not found');
        }

        // Clear existing content
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        // Ensure powerbi and models are available
        const powerbi = window.powerbi;
        if (!powerbi) {
          throw new Error('PowerBI SDK not found. Please refresh the page.');
        }

        // Create models object if not available
        if (!powerbi.models) {
          createModelsObject();
        }

        // ENHANCED: Create embed configuration with better error handling for schema issues
        const config = {
          type: 'report',
          id: reportData.id,
          embedUrl: tokenData.embedUrl,
          accessToken: tokenData.token,
          tokenType: 1, // FIXED: Use explicit numeric value (1 = Embed)
          permissions: 1, // FIXED: Use explicit numeric value (1 = Read)
          viewMode: 0, // FIXED: Use explicit numeric value (0 = View)
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: true,
            background: 1, // FIXED: Use explicit numeric value (1 = Default)
            layoutType: 0, // FIXED: Use explicit numeric value (0 = Master)
            // CRITICAL: Add settings to handle schema loading issues
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
              pageNavigation: {
                visible: true,
              },
            },
            // Enhanced timeout and retry settings for problematic datasets
            loadTimeout: 45000, // Increased to 45 seconds for Pharma dataset
            retryCount: 3,
            // Add specific settings for RLS datasets
            customLayout: {
              displayOption: 1, // FitToPage
            },
          },
        };

        // Special handling for Pharma dataset
        if (tokenData.datasetId === 'a6d449e3-f528-4ac1-b3f2-21a38b86dcac') {
          config.settings.loadTimeout = 60000; // Extended timeout for Pharma
          config.settings.retryCount = 5; // More retries for Pharma

          // Add error recovery settings
          config.settings.errorRecovery = {
            enabled: true,
            maxAttempts: 3,
          };
        }

        // Add data attributes to help with embedding
        container.setAttribute('data-powerbi-embed-type', 'report');
        container.setAttribute('data-powerbi-report-id', reportData.id);
        container.setAttribute('data-powerbi-group-id', reportData.groupId || '');
        container.setAttribute('data-powerbi-dataset-id', tokenData.datasetId || '');

        // ENHANCED: Better error handling for schema loading issues
        const reportLoadedHandler = () => {
          if (componentMountedRef.current) {
            setLoading(false);
            setError(null);
            clearRetryState(); // Clear any retry state on success
            saveToRecentReports(reportData);
          }
        };

        const reportErrorHandler = (event) => {
          console.error('Error loading report:', event);

          // Extract detailed error info
          let errorMessage = 'Failed to load report: Unknown error';
          let errorDetail = null;
          let shouldRetry = false;
          let isSchemaError = false;

          if (event.detail) {
            if (typeof event.detail === 'string') {
              errorMessage = `Failed to load report: ${event.detail}`;
            } else if (event.detail.message) {
              errorDetail = event.detail;

              // CRITICAL: Handle specific schema loading errors
              if (
                event.detail.message.includes('ExplorationContainer_FailedToLoadModel') ||
                event.detail.detailedMessage?.includes("Couldn't load the model schema")
              ) {
                isSchemaError = true;

                // Check if this is the Pharma dataset
                if (tokenData.datasetId === 'a6d449e3-f528-4ac1-b3f2-21a38b86dcac') {
                  errorMessage = `Pharma dataset schema error. The dataset security configuration may need adjustment. Contact your PowerBI administrator.`;

                  // For Pharma dataset, we might retry with different approach
                  if (retryCount < 2) {
                    shouldRetry = true;
                    errorMessage += ` Retrying with alternative configuration...`;
                  }
                } else {
                  errorMessage = `Dataset security configuration issue. This report requires special permissions or the dataset schema is incompatible.`;
                }
              } else if (
                event.detail.message.includes('TokenExpired') ||
                event.detail.message.includes('Unauthorized') ||
                event.detail.message.includes('401')
              ) {
                errorMessage = `Authentication expired. Refreshing token...`;
                shouldRetry = true;
              } else if (
                event.detail.message.includes('NetworkError') ||
                event.detail.message.includes('Failed to fetch') ||
                event.detail.detailedMessage?.includes('connection') ||
                event.detail.message.includes('500') ||
                event.detail.message.includes('503')
              ) {
                errorMessage = `Network connection issue. Retrying...`;
                shouldRetry = true;
              } else if (event.detail.message.includes('Timeout') || event.detail.message.includes('timeout')) {
                errorMessage = `Report loading timed out. Retrying...`;
                shouldRetry = true;
              } else {
                errorMessage = `Failed to load report: ${event.detail.detailedMessage || event.detail.message}`;
                // For unknown errors, allow limited retries
                if (retryCount < 1) {
                  shouldRetry = true;
                }
              }
            }
          }

          console.error('Detailed error info:', {
            errorDetail: errorDetail || 'No details available',
            shouldRetry,
            isSchemaError,
            retryCount,
            datasetId: tokenData.datasetId,
          });

          if (componentMountedRef.current) {
            setLoading(false);
            setError(errorMessage);

            // Enhanced retry logic
            if (shouldRetry && !tokenProcessingRef.current) {
              console.log('Scheduling retry for error type:', event.detail?.message);

              const retryScheduled = scheduleRetry(
                {
                  message: errorMessage,
                  detail: errorDetail,
                  isSchemaError,
                  timestamp: new Date().toISOString(),
                },
                true,
              );

              if (!retryScheduled) {
                // Max retries reached
                if (isSchemaError && tokenData.datasetId === 'a6d449e3-f528-4ac1-b3f2-21a38b86dcac') {
                  setError(
                    `Pharma dataset failed to load after ${MAX_RETRY_ATTEMPTS} attempts. This dataset may require special configuration in PowerBI. Please contact your administrator.`,
                  );
                } else {
                  setError(`Report failed to load after ${MAX_RETRY_ATTEMPTS} attempts: ${errorMessage}`);
                }
              }
            }
          }
        };

        const reportRenderedHandler = () => {
          console.log('Report rendered successfully');
          if (componentMountedRef.current) {
            setLoading(false);
            setError(null);
            clearRetryState(); // Clear retry state on successful render
          }
        };

        // Create the embed instance with enhanced error handling
        if (embedTimeoutRef.current) {
          clearTimeout(embedTimeoutRef.current);
        }

        embedTimeoutRef.current = setTimeout(() => {
          if (!componentMountedRef.current) return;

          try {
            console.log('Creating PowerBI embed instance...');
            const reportInstance = powerbi.embed(container, config);

            // Attach event handlers with enhanced logging
            console.log('Attaching event handlers to report instance...');
            reportInstance.on('loaded', reportLoadedHandler);
            reportInstance.on('error', reportErrorHandler);
            reportInstance.on('rendered', reportRenderedHandler);

            // Add additional event handlers for better debugging
            reportInstance.on('dataSelected', (event) => {
              console.log('Data selected in report:', event);
            });

            reportInstance.on('pageChanged', (event) => {
              console.log('Page changed in report:', event);
            });

            // Store reference to report
            setReport(reportInstance);

            // Set up token refresh timer if we have an expiration
            if (tokenData.expiration) {
              const expirationTime = new Date(tokenData.expiration).getTime();
              const currentTime = Date.now();
              // Refresh 10 minutes before expiration
              const timeToExpiration = expirationTime - currentTime - 600000;

              if (timeToExpiration > 0) {
                // Clear any existing timer first
                if (tokenTimerRef.current) {
                  clearTimeout(tokenTimerRef.current);
                  tokenTimerRef.current = null;
                }

                console.log(`Setting token refresh timer for ${timeToExpiration}ms`);
                tokenTimerRef.current = setTimeout(() => {
                  if (componentMountedRef.current && currentReportRef.current) {
                    console.log('Refreshing report token...');
                    tokenProcessingRef.current = false;
                    clearRetryState(); // Clear retry state before refresh
                    refetchToken();
                  }
                }, timeToExpiration);
              }
            }
          } catch (embedError) {
            // Special handling for embedding errors
            console.error('Error during PowerBI embed operation:', embedError);

            let errorMessage = `Failed to embed report: ${embedError.message || 'Unknown error'}`;
            let shouldRetryEmbed = false;

            // Check for specific error types
            if (embedError.toString().includes('tokenType')) {
              errorMessage = 'TokenType error: Invalid token configuration. Please refresh the page and try again.';
            } else if (
              embedError.toString().includes('SecurityError') ||
              embedError.toString().includes('CORS') ||
              embedError.toString().includes('cross-origin')
            ) {
              errorMessage =
                'Security error: This may be due to Content Security Policy restrictions. Please check your browser console.';
            } else if (embedError.toString().includes('Network')) {
              errorMessage = 'Network error during embedding. Retrying...';
              shouldRetryEmbed = true;
            }

            if (componentMountedRef.current) {
              setLoading(false);
              setError(errorMessage);

              if (shouldRetryEmbed) {
                scheduleRetry(
                  {
                    message: errorMessage,
                    error: embedError.toString(),
                    timestamp: new Date().toISOString(),
                  },
                  true,
                );
              }
            }
          }
        }, 250); // 250ms delay to ensure iframe is ready
      } catch (err) {
        console.error('Error in embedReportWithToken:', err);
        if (componentMountedRef.current) {
          setError(`Error loading report: ${err.message || 'Unknown error'}`);
          setLoading(false);
        }
      }
    },
    [
      report,
      sdkLoaded,
      saveToRecentReports,
      refetchToken,
      createModelsObject,
      retryCount,
      clearRetryState,
      scheduleRetry,
    ],
  );

  // Load a specific report
  const loadReport = useCallback(
    (reportData) => {
      console.log('loadReport called with:', reportData);

      if (!sdkLoaded) {
        console.error('SDK not loaded when trying to load report');
        setError('PowerBI SDK not loaded yet. Please wait or refresh the page.');
        return;
      }

      if (!reportData || !reportData.id) {
        console.error('Invalid report data:', reportData);
        setError('Invalid report data. Missing report ID.');
        return;
      }

      setLoading(true);
      setError(null);
      setDemoMode(false);
      setReportName(reportData.name || 'Power BI Report');
      currentReportRef.current = reportData;

      // Reset all retry-related state when loading a new report
      clearRetryState();
      tokenProcessingRef.current = false;

      // Track report viewing
      trackUsage({
        event: 'report_view',
        reportId: reportData.id,
        details: { name: reportData.name },
      }).catch((err) => console.error('Error tracking report view:', err));

      console.log('Loading report:', reportData, 'Models initialized:', modelsInitialized);

      // Check if models is initialized
      if (!modelsInitialized) {
        createModelsObject();
      }

      // Set current report ID and group ID to trigger the useGetPowerBIEmbedTokenQuery hook
      setCurrentReportId(reportData.id);
      setCurrentGroupId(reportData.groupId || currentGroupId);
    },
    [sdkLoaded, trackUsage, modelsInitialized, currentGroupId, createModelsObject, clearRetryState],
  );

  // Handle selecting a report from browse dialog
  const handleSelectReport = useCallback(
    (report) => {
      setReportsDialogOpen(false);
      loadReport(report);
    },
    [loadReport],
  );

  // Handle selecting a recent report
  const handleSelectRecentReport = useCallback(
    (reportData) => {
      handleCloseReportMenu();
      loadReport(reportData);
    },
    [handleCloseReportMenu, loadReport],
  );

  // Load report from direct link
  const handleLoadDirectLink = useCallback(() => {
    if (!directReportLink) return;

    setDirectLinkDialogOpen(false);

    try {
      // Parse the URL to extract report ID and group ID
      const url = new URL(directReportLink);
      const path = url.pathname.split('/');

      // Try to extract report ID and group ID from URL
      let reportId = '';
      let groupId = currentGroupId;

      // Typical format: /groups/groupId/reports/reportId/...
      const groupsIndex = path.indexOf('groups');
      const reportsIndex = path.indexOf('reports');

      if (groupsIndex !== -1 && groupsIndex + 1 < path.length) {
        groupId = path[groupsIndex + 1];
      }

      if (reportsIndex !== -1 && reportsIndex + 1 < path.length) {
        reportId = path[reportsIndex + 1];
      }

      if (!reportId) {
        throw new Error('Could not extract report ID from URL');
      }

      // Create a report object and load it
      const reportData = {
        id: reportId,
        name: 'Custom Report',
        groupId: groupId,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
      };

      loadReport(reportData);
    } catch (err) {
      console.error('Error parsing report URL:', err);
      setError(`Invalid report URL: ${err.message}`);
    }
  }, [directReportLink, loadReport, currentGroupId]);

  // Handle refresh with retry state reset
  const handleRefresh = useCallback(() => {
    if (!report && !demoMode) return;

    // Reset all retry-related state on manual refresh
    clearRetryState();
    tokenProcessingRef.current = false;

    // Track refresh action
    trackUsage({
      event: 'report_refresh',
      reportId: currentReportRef.current?.id,
      details: { name: currentReportRef.current?.name },
    }).catch((err) => console.error('Error tracking refresh:', err));

    try {
      setLoading(true);
      setError(null);
      setDemoMode(false);

      // For complete refresh, reload the report with current data
      if (currentReportRef.current) {
        loadReport(currentReportRef.current);
      } else {
        report
          .refresh()
          .then(() => {
            if (componentMountedRef.current) {
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error('Error refreshing report:', err);
            if (componentMountedRef.current) {
              setError(`Error refreshing report: ${err.message}`);
              setLoading(false);
            }
          });
      }
    } catch (err) {
      console.error('Error refreshing report:', err);
      if (componentMountedRef.current) {
        setError(`Error refreshing report: ${err.message}`);
        setLoading(false);
      }
    }
  }, [report, trackUsage, loadReport, demoMode, clearRetryState]);

  // Load a demo report
  const loadDemoReport = useCallback(() => {
    handleCloseReportMenu();

    // Track demo report usage
    trackUsage({
      event: 'demo_report_view',
      details: { source: 'menu' },
    }).catch((err) => console.error('Error tracking demo report view:', err));

    // Get the demo report from config if available, otherwise use default
    const demoReport = powerbiConfig?.data?.demoReports?.[0] || {
      id: DEFAULT_REPORT_ID,
      name: 'Rec Demo',
      groupId: currentGroupId,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${DEFAULT_REPORT_ID}&groupId=${currentGroupId}`,
    };

    loadReport(demoReport);

    if (reportsDialogOpen) {
      setReportsDialogOpen(false);
    }
  }, [
    handleCloseReportMenu,
    loadReport,
    reportsDialogOpen,
    trackUsage,
    currentGroupId,
    powerbiConfig,
    DEFAULT_REPORT_ID,
  ]);

  // Load PowerBI SDK with direct script injection
  useEffect(() => {
    if (window.powerbi || loadingScript) {
      if (window.powerbi) {
        console.log('PowerBI SDK already available');
        setSdkLoaded(true);

        if (window.powerbi.models) {
          console.log('PowerBI models already available');
          setModelsInitialized(true);
        } else {
          createModelsObject();
        }
      }
      return;
    }

    setLoadingScript(true);
    console.log('Loading PowerBI SDK from CDN...');

    const sdkUrl =
      powerbiConfig?.data?.sdkUrl || 'https://cdn.jsdelivr.net/npm/powerbi-client@2.22.3/dist/powerbi.min.js';

    const script = document.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.id = 'powerbi-sdk-script';

    let retryCount = 0;
    const maxRetries = 2;

    const loadSdk = () => {
      script.onload = () => {
        console.log('PowerBI SDK loaded successfully');
        setSdkLoaded(true);
        setLoadingScript(false);

        if (!window.powerbi.models) {
          createModelsObject();
        } else {
          setModelsInitialized(true);
        }
      };

      script.onerror = (error) => {
        console.error('Failed to load PowerBI SDK from CDN:', error);

        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying SDK load (${retryCount}/${maxRetries})...`);

          if (retryCount === 1) {
            script.src = 'https://cdn.jsdelivr.net/npm/powerbi-client@2.18.6/dist/powerbi.min.js';
          } else if (retryCount === 2) {
            script.src = 'https://microsoft.github.io/PowerBI-JavaScript/dist/powerbi.min.js';
          }

          setTimeout(() => {
            if (document.body.contains(script)) {
              document.body.removeChild(script);
            }
            document.body.appendChild(script);
          }, 1000);
        } else {
          setError('Failed to load PowerBI SDK. Please check your network connection and try again.');
          setLoadingScript(false);
        }
      };
    };

    loadSdk();
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script) && !window.powerbi) {
        document.body.removeChild(script);
      }
    };
  }, [powerbiConfig, createModelsObject]);

  // Keep config in ref for access in callbacks
  useEffect(() => {
    if (powerbiConfig) {
      configRef.current = powerbiConfig.data;
      console.log('PowerBI Config loaded successfully');
    }
  }, [powerbiConfig]);

  // Handle token errors
  useEffect(() => {
    if (tokenError) {
      console.error('Error getting embed token:', tokenError);
      setError(`Failed to get authorization token: ${tokenError.message || 'Unknown error'}`);
      setLoading(false);
    }
  }, [tokenError]);

  // Effect to handle embed token data changes
  useEffect(() => {
    if (
      !embedTokenData ||
      !currentReportRef.current ||
      !sdkLoaded ||
      !modelsInitialized ||
      tokenProcessingRef.current
    ) {
      return;
    }

    tokenProcessingRef.current = true;
    setTokenDetails(embedTokenData);

    if (embedTokenData.isDemoMode) {
      console.log('Demo mode detected, showing demo UI');
      setDemoMode(true);
      setLoading(false);
      saveToRecentReports(currentReportRef.current);
      return;
    }

    console.log('Embed token received, embedding report...');

    setTimeout(() => {
      if (componentMountedRef.current) {
        embedReportWithToken(currentReportRef.current, embedTokenData);
      }
    }, 100);
  }, [embedTokenData, sdkLoaded, modelsInitialized, saveToRecentReports, embedReportWithToken]);

  // Load recent reports from localStorage
  useEffect(() => {
    try {
      const savedReports = localStorage.getItem(RECENT_REPORTS_KEY);
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        if (Array.isArray(parsed)) {
          setRecentReports(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading recent reports from localStorage:', err);
    }
  }, []);

  // Auto-load the default report after initialization
  useEffect(() => {
    if (sdkLoaded && modelsInitialized && !currentReportId && !report && powerbiConfig) {
      console.log('Auto-loading default report');

      setTimeout(() => {
        if (componentMountedRef.current) {
          const defaultReport = powerbiConfig?.data?.demoReports?.[0] || {
            id: DEFAULT_REPORT_ID,
            name: 'Rec Demo',
            groupId: currentGroupId,
            embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${DEFAULT_REPORT_ID}&groupId=${currentGroupId}`,
          };
          loadReport(defaultReport);
        }
      }, 500);
    }
  }, [
    sdkLoaded,
    modelsInitialized,
    currentReportId,
    report,
    powerbiConfig,
    DEFAULT_REPORT_ID,
    currentGroupId,
    loadReport,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    componentMountedRef.current = true;

    return () => {
      componentMountedRef.current = false;

      // Clean up all timers
      if (tokenTimerRef.current) {
        console.log('Cleaning up token refresh timer on unmount');
        clearTimeout(tokenTimerRef.current);
        tokenTimerRef.current = null;
      }

      if (embedTimeoutRef.current) {
        clearTimeout(embedTimeoutRef.current);
        embedTimeoutRef.current = null;
      }

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Clean up report
      if (report) {
        try {
          console.log('Cleaning up report on unmount');
          report.off('loaded');
          report.off('error');
          report.off('rendered');

          try {
            if (reportContainerRef.current) {
              while (reportContainerRef.current.firstChild) {
                reportContainerRef.current.removeChild(reportContainerRef.current.firstChild);
              }
            }

            if (window.powerbi && typeof window.powerbi.reset === 'function') {
              console.log('Resetting PowerBI instance on unmount');
              window.powerbi.reset(reportContainerRef.current);
            }
          } catch (cleanupErr) {
            console.warn('Non-critical error during thorough cleanup:', cleanupErr);
          }
        } catch (err) {
          console.warn('Error cleaning up report events:', err);
        }
      }
    };
  }, [report]);

  // Handle retry for configuration loading failures
  const handleRetryConfigLoad = useCallback(() => {
    setError(null);
    clearRetryState();
    refetchConfig();
  }, [refetchConfig, clearRetryState]);

  // Debug token information when there's an error
  const showTokenDebug = useCallback(() => {
    if (!tokenDetails) return;

    console.log('Token details for debugging:', {
      token: tokenDetails.token ? `${tokenDetails.token.substring(0, 10)}...` : 'No token',
      tokenType: tokenDetails.tokenType,
      expires: tokenDetails.expiration,
      embedUrl: tokenDetails.embedUrl,
      datasetId: tokenDetails.datasetId,
      isDemoMode: tokenDetails.isDemoMode,
      metadata: tokenDetails.metadata,
    });

    alert(`Token information:
Type: ${tokenDetails.tokenType}
Expiration: ${tokenDetails.expiration ? new Date(tokenDetails.expiration).toLocaleString() : 'None'}
URL: ${tokenDetails.embedUrl || 'Not available'}
Dataset ID: ${tokenDetails.datasetId || 'Not available'}
Demo Mode: ${tokenDetails.isDemoMode ? 'Yes' : 'No'}
Token length: ${tokenDetails.token ? tokenDetails.token.length : 0} characters
Has RLS: ${tokenDetails.metadata?.hasRLS ? 'Yes' : 'No'}
Token Strategy: ${tokenDetails.metadata?.tokenStrategy || 'Unknown'}
Retry Count: ${retryCount}/${MAX_RETRY_ATTEMPTS}
Last Error: ${lastError?.message || 'None'}
    `);
  }, [tokenDetails, retryCount, lastError]);

  // Show configuration loading error
  if (configError && !powerbiConfig) {
    return (
      <Box p={3} className={classes.errorBox}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetryConfigLoad}>
              Retry
            </Button>
          }>
          Failed to load PowerBI configuration: {configError.message || 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      {/* Header is shown only when hideControls is false */}
      {!hideControls && (
        <Box className={classes.header}>
          <Box className={classes.reportSelector}>
            <Typography variant="h5" component="h2" className={classes.title} onClick={handleOpenReportMenu}>
              {reportName}
              <ArrowDropDownIcon className={classes.dropdownIcon} />
            </Typography>

            <Menu
              anchorEl={reportMenuAnchor}
              open={Boolean(reportMenuAnchor)}
              onClose={handleCloseReportMenu}
              className={classes.reportsMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}>
              <MenuItem onClick={openReportsBrowser}>
                <FormatListBulletedIcon fontSize="small" sx={{ mr: 1 }} />
                Browse All Reports
              </MenuItem>

              <MenuItem onClick={handleOpenDirectLinkDialog}>Enter Report URL</MenuItem>

              <MenuItem onClick={loadDemoReport}>
                <InsertChartIcon fontSize="small" sx={{ mr: 1 }} />
                Load Demo Report
              </MenuItem>

              {recentReports.length > 0 && (
                <>
                  <Divider />
                  <Box sx={{ px: 2, py: 1, typography: 'body2', color: 'text.secondary' }}>Recent Reports</Box>
                  {recentReports.map((report) => (
                    <MenuItem key={report.id} onClick={() => handleSelectRecentReport(report)}>
                      <InsertChartIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      {report.name}
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu>
          </Box>
        </Box>
      )}

      <Paper className={classes.dashboardWrapper} elevation={2}>
        {(loading || configLoading) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 3,
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '80%',
                textAlign: 'center',
              }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="h6">Loading PowerBI Dashboard...</Typography>
              {sdkLoaded ? (
                modelsInitialized ? (
                  <Typography variant="body2" color="text.secondary">
                    Connecting to Power BI...
                    {retryCount > 0 && ` (Retry ${retryCount}/${MAX_RETRY_ATTEMPTS})`}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Initializing Power BI models...
                  </Typography>
                )
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading Power BI SDK...
                </Typography>
              )}

              {sdkLoaded && !modelsInitialized && (
                <Button variant="outlined" color="primary" size="small" sx={{ mt: 2 }} onClick={createModelsObject}>
                  Continue Anyway
                </Button>
              )}
            </Box>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
            <Alert
              severity={error.includes('demo mode') ? 'info' : 'error'}
              sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
              {error}
              {retryCount > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Retry attempt: {retryCount}/{MAX_RETRY_ATTEMPTS}
                </Typography>
              )}
            </Alert>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                Try Again
              </Button>

              {error && !error.includes('demo mode') && (
                <Button variant="outlined" color="secondary" onClick={loadDemoReport} startIcon={<InsertChartIcon />}>
                  Try Demo Report
                </Button>
              )}

              {tokenDetails && (
                <Button variant="outlined" color="secondary" onClick={showTokenDebug}>
                  Debug Token
                </Button>
              )}
            </Box>
          </Box>
        )}

        {demoMode && !loading && !error && (
          <Box
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
            <Alert severity="info" sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
              This is a demo report. Full functionality is limited due to authentication constraints.
            </Alert>

            <Typography variant="h4" sx={{ mb: 3 }}>
              {reportName}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, textAlign: 'center' }}>
              This report would normally show interactive Power BI content. Demo mode is shown when your account
              doesn&apos;t have access to the underlying data.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={openReportsBrowser}>
                Browse Other Reports
              </Button>

              <Button variant="outlined" onClick={handleRefresh}>
                Refresh
              </Button>
            </Box>
          </Box>
        )}

        {!report && !demoMode && !loading && !error && (
          <Box
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Select a Power BI Report
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
              Click on the dropdown above to select from your recent reports, or use one of the options below:
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={openReportsBrowser}
                startIcon={<FormatListBulletedIcon />}>
                Browse All Reports
              </Button>

              <Button variant="outlined" color="primary" onClick={handleOpenDirectLinkDialog}>
                Enter Report URL
              </Button>

              <Button variant="outlined" color="secondary" onClick={loadDemoReport} startIcon={<InsertChartIcon />}>
                Load Demo Report
              </Button>
            </Box>

            {recentReports.length > 0 && (
              <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
                  Recent Reports:
                </Typography>
                <List>
                  {recentReports.slice(0, 5).map((report) => (
                    <ListItem key={report.id} button onClick={() => handleSelectRecentReport(report)} divider>
                      <ListItemText
                        primary={report.name}
                        secondary={
                          report.lastViewed ? `Last viewed: ${new Date(report.lastViewed).toLocaleDateString()}` : ''
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Dialog open={directLinkDialogOpen} onClose={() => setDirectLinkDialogOpen(false)}>
          <DialogTitle component="div">Enter Power BI Report URL</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Paste the URL of a Power BI report you want to view. This should be in the format:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              https://app.powerbi.com/groups/me/reports/[report-id]/[page-id]
            </Typography>
            <input
              type="text"
              value={directReportLink}
              onChange={(e) => setDirectReportLink(e.target.value)}
              placeholder="https://app.powerbi.com/groups/me/reports/..."
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDirectLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLoadDirectLink} variant="contained" color="primary" disabled={!directReportLink}>
              Load Report
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={reportsDialogOpen}
          onClose={() => setReportsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          aria-labelledby="reports-dialog-title">
          <DialogTitle
            component="div"
            id="reports-dialog-title"
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Browse Power BI Reports</Typography>
            <IconButton onClick={() => setReportsDialogOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {reportsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : availableReports?.data?.length > 0 ? (
              <Grid container spacing={3}>
                {availableReports.data.map((report) => (
                  <Grid item xs={12} sm={6} md={4} key={report.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardActionArea onClick={() => handleSelectReport(report)}>
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {report.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {report.description || 'No description available'}
                            {report.isDemoReport && ' (Demo)'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {report.id}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ p: 4, textAlign: 'center' }}>
                No reports found. Try the demo report or enter a report URL directly.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportsDialogOpen(false)}>Cancel</Button>
            <Button onClick={loadDemoReport} color="secondary">
              Load Demo Report
            </Button>
          </DialogActions>
        </Dialog>

        <div
          ref={reportContainerRef}
          className="powerbi-report-container"
          data-powerbi-embed-type="report"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '700px',
            display: error || demoMode ? 'none' : 'block',
          }}
        />
      </Paper>
    </Box>
  );
});

PowerBIDashboard.displayName = 'PowerBIDashboard';

PowerBIDashboard.propTypes = {
  hideControls: PropTypes.bool,
  industryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  personaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PowerBIDashboard;

import { useState, useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, Alert } from '@mui/material';
import classes from './MicroStrategyDashboard.module.scss';
import { useMicroStrategy } from '../../contexts/MicroStrategyContext';
import { isIncognitoMode as checkIncognitoMode } from '../../utils/microStrategyLoader';
import { useGetMicroStrategyConfigQuery } from '../../services/dashboardApi';
import PropTypes from 'prop-types';

/**
 * MicroStrategy Dashboard Component with state persistence
 * Optimized for Azure with incognito mode support
 */
const MicroStrategyDashboard = forwardRef(({ hideControls = false, industryId, personaId }, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const dashboardIdRef = useRef('mstr-reports-dashboard');
  const iframeKeyRef = useRef(Date.now());
  const componentMountedRef = useRef(true);

  // Dashboard title state to capture actual dashboard title
  const [dashboardTitle, setDashboardTitle] = useState('Analytics Reports');

  // Authentication state
  // const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Unused variables
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const loginAttemptsRef = useRef(0);

  // Get MicroStrategy context for state persistence
  const { getDashboard, registerDashboard } = useMicroStrategy();
  const {
    data: mstrConfig,
    // isLoading: configLoading, // Unused variable
    // error: configError, // Unused variable
  } = useGetMicroStrategyConfigQuery({
    industryId,
    personaId,
  });
  // MicroStrategy configuration - No hardcoded credentials
  const msConfig = useMemo(
    () => ({
      baseUrl:
        mstrConfig?.data?.baseUrl ||
        import.meta.env.VITE_MICROSTRATEGY_BASE_URL ||
        'https://demo.microstrategy.com/MicroStrategyLibrary',
      projectId:
        mstrConfig?.data?.projectId ||
        import.meta.env.VITE_MICROSTRATEGY_PROJECT_ID ||
        'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      dashboardId:
        mstrConfig?.data?.dashboardId ||
        import.meta.env.VITE_MICROSTRATEGY_DASHBOARD_ID ||
        '43CDADC942EA17F40F7629BE9D48861B',
    }),
    [mstrConfig],
  );

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    refresh: handleRefresh,
  }));

  // Component lifecycle tracking - CRITICAL for Azure environments
  useEffect(() => {
    componentMountedRef.current = true;

    // Reset initial load state when component first mounts to prevent navigation issues
    setInitialLoadComplete(false);

    return () => {
      componentMountedRef.current = false;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, []);

  // Detect incognito mode
  useEffect(() => {
    const detectIncognito = async () => {
      try {
        const isInIncognito = await checkIncognitoMode();
        setIsIncognitoMode(isInIncognito);
      } catch (e) {
        console.warn('Could not detect incognito mode:', e);
        setIsIncognitoMode(false);
      }
    };

    detectIncognito();
  }, []);

  // Create dashboard URL with parameters optimized for Azure environments
  // CRITICAL FIX: Ensure consistent auth parameters across environments
  const getDashboardUrl = useCallback(() => {
    try {
      // Begin URL creation
      const url = new URL(`${msConfig.baseUrl}/app/${msConfig.projectId}/${msConfig.dashboardId}`);

      // Essential parameters
      url.searchParams.set('isEmbed', 'true');
      url.searchParams.set('enableResponsive', 'true');
      url.searchParams.set('disableNotifications', 'true');

      // ===== CRITICAL AUTH PARAMETERS =====
      // ALWAYS include these parameters in BOTH environments
      url.searchParams.set('showLoginPage', 'true');
      url.searchParams.set('promptAnswerMode', 'alwaysPrompt');
      url.searchParams.set('authMode', 'forms');

      // Azure AD integration parameters
      url.searchParams.set('enableAzureAD', 'true');
      url.searchParams.set('azureEnvType', 'AzureGlobal');
      url.searchParams.set('azureAppRedirect', window.location.origin);

      // Security parameters
      url.searchParams.set('preventXSiteAccess', 'false');
      url.searchParams.set('disableCrossDomainWarnings', 'true');
      url.searchParams.set('allowCrossOrigin', 'true');

      // Performance parameters
      url.searchParams.set('visualizationMode', 'simple');
      url.searchParams.set('resourceCaching', 'true');

      // Cache control - add timestamp to avoid caching
      url.searchParams.set('_ts', Date.now().toString());
      url.searchParams.set('X-Azure-Ref', `ref-${Date.now()}`);

      // Log final URL to identify any issues
      const finalUrl = url.toString();

      return finalUrl;
    } catch (error) {
      console.error('Error constructing dashboard URL:', error);
      // Fallback URL if URL construction fails
      // CRITICAL: Include auth parameters in fallback too
      const fallbackUrl = `${msConfig.baseUrl}/app/${msConfig.projectId}/${msConfig.dashboardId}?isEmbed=true&showLoginPage=true&promptAnswerMode=alwaysPrompt&authMode=forms&_ts=${Date.now()}`;
      return fallbackUrl;
    }
  }, [msConfig]);

  // Handle refresh - explicitly reload the dashboard
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    iframeKeyRef.current = Date.now();
    loginAttemptsRef.current = 0;

    try {
      if (iframeRef.current) {
        // Clear src first to ensure a complete refresh
        iframeRef.current.src = 'about:blank';

        // Set a brief timeout before loading new URL
        setTimeout(() => {
          if (componentMountedRef.current && iframeRef.current) {
            const newUrl = getDashboardUrl();
            iframeRef.current.src = newUrl;
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error during refresh:', err);
      setError('Failed to refresh dashboard. Please try again.');
      setLoading(false);
    }
  };

  // Try to extract title from iframe content
  const extractDashboardTitle = useCallback(() => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Try to access title - may fail due to CORS
        const iframeTitle = iframeRef.current.contentDocument?.title;
        if (iframeTitle && iframeTitle.trim() !== '' && !iframeTitle.includes('Error')) {
          setDashboardTitle(iframeTitle.replace(' - MicroStrategy', ''));
        }
      }
    } catch {
      // Silent catch - CORS will prevent this in most cases
    }
  }, []);

  // Handle iframe load event with incognito mode support
  const handleIframeLoad = () => {
    if (!iframeRef.current || iframeRef.current.src === 'about:blank') {
      return;
    }

    setLoading(false);
    setInitialLoadComplete(true);

    // Try to extract dashboard title
    extractDashboardTitle();

    // Check for authentication issues on load
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Try to detect login page or errors - may fail due to CORS
        const currentUrl = iframeRef.current.contentWindow.location.href;
        if (currentUrl.includes('login') || currentUrl.includes('auth')) {
          loginAttemptsRef.current += 1;
        }
      }
    } catch {
      // This is expected due to CORS - silent catch
    }

    // Register this iframe in the context for persistence
    if (iframeRef.current) {
      registerDashboard(dashboardIdRef.current, {
        url: iframeRef.current.src,
        element: iframeRef.current,
      });
    }

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  };

  // Initialize or restore the dashboard state
  useEffect(() => {
    // Skip initialization if component is unmounted
    if (!componentMountedRef.current) return;

    // Check if we have a cached dashboard
    const cachedDashboard = getDashboard(dashboardIdRef.current);

    // If we have a cached dashboard with a valid URL, use it
    if (cachedDashboard && iframeRef.current && cachedDashboard.url && cachedDashboard.url.trim() !== '') {
      // Make sure cached URL has auth parameters (backwards compatibility fix)
      const cachedUrl = new URL(cachedDashboard.url);
      if (
        !cachedUrl.searchParams.has('showLoginPage') ||
        !cachedUrl.searchParams.has('promptAnswerMode') ||
        !cachedUrl.searchParams.has('authMode')
      ) {
        // Get a fresh URL with all parameters
        const newUrl = getDashboardUrl();
        iframeRef.current.src = newUrl;
      } else if (iframeRef.current.src !== cachedDashboard.url) {
        iframeRef.current.src = cachedDashboard.url;
      } else {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    } else {
      const url = getDashboardUrl();

      if (iframeRef.current) {
        // Set load timeout for fallback
        loadTimeoutRef.current = setTimeout(() => {
          if (componentMountedRef.current && !initialLoadComplete) {
            // Try one more time with a fresh URL on timeout
            if (iframeRef.current) {
              const freshUrl = getDashboardUrl();
              iframeRef.current.src = freshUrl;
            }
          }
        }, 20000); // 20 second timeout

        // Set the URL
        iframeRef.current.src = url;
      }
    }

    // Cleanup function
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
    // IMPORTANT: Remove loading from dependencies to prevent infinite loop
  }, [getDashboard, msConfig.dashboardId, registerDashboard, initialLoadComplete, getDashboardUrl]);

  // Additional effect specifically for Azure navigation handling
  useEffect(() => {
    return () => {
      // Critical fix for Azure: Reset state when navigating away
      setInitialLoadComplete(false);

      // Reset iframe URL to prevent CORS issues on revisit
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    };
  }, []);

  // Azure telemetry integration
  useEffect(() => {
    // Setup window unload handler for Azure telemetry
    const handleBeforeUnload = () => {
      console.log('Window unloading - dashboard session ending');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [initialLoadComplete, loading, error, msConfig.dashboardId, isIncognitoMode]);

  return (
    <Box className={classes.container}>
      {/* Header is shown only when hideControls is false */}
      {!hideControls && (
        <Box className={classes.header}>
          <Typography variant="h5" component="h2" className={classes.title}>
            {dashboardTitle}
          </Typography>
        </Box>
      )}

      <Paper className={classes.dashboardWrapper} elevation={2}>
        {/* Simple loading overlay */}
        {loading && (
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
              }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="h6">Loading Dashboard...</Typography>
            </Box>
          </Box>
        )}

        {/* Error display */}
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
            <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
              {error}
            </Alert>
            <Button variant="contained" color="primary" onClick={handleRefresh}>
              Try Again
            </Button>
          </Box>
        )}

        {/* Azure-optimized iframe with correct sandbox attributes */}
        <iframe
          key={iframeKeyRef.current}
          ref={iframeRef}
          src={initialLoadComplete ? undefined : getDashboardUrl()}
          onLoad={handleIframeLoad}
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            minHeight: '700px',
            display: error ? 'none' : 'block',
          }}
          title="MicroStrategy Dashboard"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-downloads"
          allow="fullscreen"
          importance="high"
          loading="eager"
          fetchPriority="high"
          referrerPolicy="origin-when-cross-origin"
        />
      </Paper>
    </Box>
  );
});

MicroStrategyDashboard.displayName = 'MicroStrategyDashboard';
MicroStrategyDashboard.propTypes = {
  hideControls: PropTypes.bool,
  industryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  personaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default MicroStrategyDashboard;

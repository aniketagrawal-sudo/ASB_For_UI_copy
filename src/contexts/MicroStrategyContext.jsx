import { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { preloadMicroStrategyLibrary } from '../utils/microStrategyLoader';

const MicroStrategyContext = createContext(null);

/**
 * Provider component that persists MicroStrategy dashboard state across navigation
 * Optimized for Azure environments with proper caching mechanisms and CORS handling
 */
export const MicroStrategyProvider = ({ children }) => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(window.microstrategy && window.mstrPreloaded);
  const [dashboardInstances, setDashboardInstances] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const initAttemptRef = useRef(0);

  // Handle successful library loading
  const handleLibraryLoaded = useCallback(() => {
    setIsLibraryLoaded(true);
    setIsInitializing(false);
    setLoadError(null);
  }, []);

  // Handle library loading failure
  const handleLibraryFailed = useCallback(() => {
    console.error('MicroStrategy library failed to load');
    setIsInitializing(false);
    setLoadError('Failed to load MicroStrategy library');

    // Auto-retry once after a short delay
    if (initAttemptRef.current < 2) {
      setTimeout(() => {
        initAttemptRef.current++;
        loadLibrary();
      }, 3000);
    }
  }, []);

  // Load the MicroStrategy library
  const loadLibrary = useCallback(() => {
    // Check if library is already loaded
    if (window.microstrategy && window.mstrPreloaded) {
      setIsLibraryLoaded(true);
      return;
    }

    // Mark as initializing
    setIsInitializing(true);
    setLoadError(null);

    // Load the library
    try {
      preloadMicroStrategyLibrary();
    } catch (error) {
      console.error('Error initializing MicroStrategy library:', error);
      setLoadError(`Library initialization error: ${error.message}`);
      setIsInitializing(false);
    }
  }, []);

  // Initial load of the library
  useEffect(() => {
    // If already initializing, don't start another initialization
    if (isInitializing) return;

    // Add event listeners for library loading events
    window.addEventListener('mstr-library-loaded', handleLibraryLoaded);
    window.addEventListener('mstr-library-failed', handleLibraryFailed);

    // Only load if not already loaded
    if (!(window.microstrategy && window.mstrPreloaded)) {
      loadLibrary();
    } else {
      setIsLibraryLoaded(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener('mstr-library-loaded', handleLibraryLoaded);
      window.removeEventListener('mstr-library-failed', handleLibraryFailed);
    };
  }, [isInitializing, handleLibraryLoaded, handleLibraryFailed, loadLibrary]);

  // Function to register a dashboard instance
  const registerDashboard = useCallback((id, instance) => {
    setDashboardInstances((prev) => ({
      ...prev,
      [id]: instance,
    }));
  }, []);

  // Function to get a dashboard instance
  const getDashboard = useCallback(
    (id) => {
      return dashboardInstances[id] || null;
    },
    [dashboardInstances],
  );

  // Function to remove a dashboard instance (when no longer needed)
  const removeDashboard = useCallback((id) => {
    setDashboardInstances((prev) => {
      const newInstances = { ...prev };
      delete newInstances[id];
      return newInstances;
    });
  }, []);

  // Function to retry loading if it failed
  const retryLoading = useCallback(() => {
    if (loadError) {
      initAttemptRef.current = 0;
      loadLibrary();
    }
  }, [loadError, loadLibrary]);

  // Clean up all dashboard instances when the app is unloaded
  useEffect(() => {
    return () => {
      // Destroy all dashboard instances to prevent memory leaks
      Object.values(dashboardInstances).forEach((instance) => {
        try {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (e) {
          console.warn('Error destroying dashboard instance during cleanup', e);
        }
      });
    };
  }, [dashboardInstances]);

  // Context value
  const value = {
    isLibraryLoaded,
    registerDashboard,
    getDashboard,
    removeDashboard,
    dashboardInstances,
    loadError,
    retryLoading,
    isInitializing,
  };

  return <MicroStrategyContext.Provider value={value}>{children}</MicroStrategyContext.Provider>;
};

MicroStrategyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using the MicroStrategy context
export const useMicroStrategy = () => {
  const context = useContext(MicroStrategyContext);
  if (!context) {
    throw new Error('useMicroStrategy must be used within a MicroStrategyProvider');
  }
  return context;
};

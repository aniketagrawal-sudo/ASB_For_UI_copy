/**
 * Azure-optimized MicroStrategy integration with incognito mode support
 */

/**
 * Preloads the MicroStrategy embedding library
 */
export const preloadMicroStrategyLibrary = () => {
  // Skip if already loaded
  if (window.microstrategy || window.mstrPreloading) {
    window.mstrPreloaded = true;
    return;
  }

  window.mstrPreloading = true;
  const baseUrl = import.meta.env.VITE_MICROSTRATEGY_BASE_URL || 'https://demo.microstrategy.com/MicroStrategyLibrary';

  const script = document.createElement('script');
  script.src = `${baseUrl}/javascript/embeddinglib.js`;
  script.async = true;
  script.id = 'mstr-embedding-script';
  script.crossOrigin = 'anonymous';

  // Azure optimization
  script.importance = 'high';

  script.onload = () => {
    window.mstrPreloaded = true;
    window.mstrPreloading = false;
    window.dispatchEvent(new CustomEvent('mstr-library-loaded'));
  };

  script.onerror = (error) => {
    console.warn('Failed to preload MicroStrategy library:', error);
    window.mstrPreloading = false;
    window.dispatchEvent(new CustomEvent('mstr-library-failed'));
  };

  document.body.appendChild(script);
};

/**
 * Uses direct login instead of token-based authentication for better
 * compatibility with incognito mode and Azure security practices
 */
export const getAuthToken = async () => {
  console.warn('DEPRECATED: Programmatic authentication is disabled due to security concerns');
  console.warn('Using direct user authentication instead - programmatic auth not supported in incognito mode');

  // Throw error to prevent usage of this function
  throw new Error('Programmatic authentication disabled. Use direct user authentication instead.');
};

/**
 * Creates an embedded dashboard within a container
 * Modified to work in incognito mode by using direct authentication
 *
 * @param {HTMLElement} container The HTML element to place the dashboard in
 * @param {Object} config Configuration options
 * @returns {Promise<Object>} The dashboard instance
 */
export const embedDashboard = async (container, config = {}) => {
  if (!window.microstrategy || !window.microstrategy.dossier) {
    throw new Error('MicroStrategy library not loaded');
  }

  try {
    const msConfig = {
      baseUrl: import.meta.env.VITE_MICROSTRATEGY_BASE_URL || 'https://demo.microstrategy.com/MicroStrategyLibrary',
      projectId: import.meta.env.VITE_MICROSTRATEGY_PROJECT_ID || 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      dashboardId: import.meta.env.VITE_MICROSTRATEGY_DASHBOARD_ID || '43CDADC942EA17F40F7629BE9D48861B',
    };

    // Direct URL to dashboard with authentication parameters
    const url = new URL(
      `${msConfig.baseUrl}/app/${config.projectId || msConfig.projectId}/${config.dashboardId || msConfig.dashboardId}`,
    );
    url.searchParams.set('isEmbed', 'true');
    url.searchParams.set('showLoginPage', 'true'); // Enable login page
    url.searchParams.set('authMode', 'forms'); // Use forms auth for incognito compatibility
    url.searchParams.set('enableResponsive', 'true');
    url.searchParams.set('_ts', Date.now());

    // Create embedding configuration optimized for incognito mode
    const embeddingConfig = {
      placeholder: container,
      url: url.toString(),
      containerStyle: {
        height: '100%',
        width: '100%',
        minHeight: '500px',
      },
      disableNotification: true,
      enableResponsive: true,

      // NO programmatic authentication for incognito compatibility
      enableCustomAuthentication: false,

      // Disable features that cause issues in incognito
      shareFeature: {
        enabled: false,
      },
      navigationBar: {
        enabled: false,
      },

      // Critical for incognito mode
      disableCustomErrorHandlerOnCreate: true,
    };

    try {
      return await window.microstrategy.dossier.create(embeddingConfig);
    } catch (err) {
      console.error('Error in dossier.create:', err);

      // Try with even simpler config for incognito
      const simpleConfig = {
        placeholder: container,
        url: url.toString(),
        containerStyle: {
          height: '800px',
          width: '100%',
        },
        enableCustomAuthentication: false,
      };

      return await window.microstrategy.dossier.create(simpleConfig);
    }
  } catch (error) {
    console.error('Error embedding dashboard:', error);
    throw error;
  }
};

/**
 * Detects if the current browser session is in incognito/private mode
 * @returns {Promise<boolean>} True if in incognito mode
 */
export const isIncognitoMode = async () => {
  try {
    // Try to use localStorage as a test
    const testKey = 'mstr_incognito_test';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);

    // Additional checks that might indicate incognito mode
    const isPrivate = !window.indexedDB || (navigator.userAgent.includes('Firefox') && !navigator.serviceWorker);

    return isPrivate;
  } catch (e) {
    // If localStorage fails, likely in incognito mode
    return true;
  }
};

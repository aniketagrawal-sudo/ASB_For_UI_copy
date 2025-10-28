import Keycloak from 'keycloak-js';
import { validateKeyCloakRealm } from './validator';
import { disconnectSocket, initSocket } from './socket';

/**
 * Azure-optimized Keycloak integration
 * - Enhanced token refresh with socket reconnection
 * - Improved error handling and retry logic
 * - Better logging for Azure Application Insights
 *
 * @version 1.2.0
 */

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_SERVER_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

// Initialize Keycloak instance
const keycloak = validateKeyCloakRealm() ? new Keycloak(keycloakConfig) : null;

// Track token refresh operations
let isRefreshing = false;
let refreshCallbacks = [];

/**
 * Initialize Keycloak with Azure-optimized settings
 * @returns {Promise<Object>} Keycloak instance
 */
export const initializeKeycloak = async () => {
  if (!keycloak) {
    return Promise.reject(new Error('Keycloak not initialized due to missing configuration'));
  }

  const BASE_PATH = import.meta.env.VITE_BASE_PATH || '';

  try {
    // Initialize with Azure-optimized settings
    await keycloak.init({
      // authenticated variable unused
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + `${BASE_PATH}` + '/silent-check-sso.html',
      checkLoginIframe: false,
      enableLogging: true,
      responseMode: 'fragment', // More reliable in Azure environments
      flow: 'standard', // Standard flow works better with Azure AD
      pkceMethod: 'S256', // PKCE for better security
    });

    // Token expiration handler with Azure-optimized settings
    keycloak.onTokenExpired = async () => {
      try {
        // Prevent multiple simultaneous refresh attempts
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshCallbacks.push(resolve);
          });
        }

        isRefreshing = true;

        // Use a longer minValidity in Azure due to potential latency
        const refreshed = await keycloak.updateToken(30);

        if (refreshed) {

          // Reconnect socket with new token
          try {
            const currentSocket = window.socketInstance;
            if (currentSocket) {
              disconnectSocket();
              const newSocket = initSocket(keycloak.token);
              // Store for reference
              window.socketInstance = newSocket;
            }
          } catch (socketError) {
            console.error('Socket reconnection error:', socketError);
          }

          // Execute any pending callbacks
          refreshCallbacks.forEach((callback) => callback(true));
        }

        // Reset refresh state
        refreshCallbacks = [];
        isRefreshing = false;
      } catch (error) {
        console.error('Token refresh failed:', error);

        // Notify waiting operations that refresh failed
        refreshCallbacks.forEach((callback) => callback(false));
        refreshCallbacks = [];
        isRefreshing = false;

        // If refresh fails repeatedly, trigger logout after 3 failures
        keycloak._tokenRefreshFailCount = (keycloak._tokenRefreshFailCount || 0) + 1;
        if (keycloak._tokenRefreshFailCount > 3) {
          console.error('Multiple token refresh failures, logging out');
          keycloak.logout();
        }
      }
    };

    // Standard event handlers
    keycloak.onAuthSuccess = () => {
      keycloak._tokenRefreshFailCount = 0; // Reset failure counter on success
    };

    keycloak.onAuthRefreshSuccess = () => {
      keycloak._tokenRefreshFailCount = 0; // Reset failure counter on success
    };

    keycloak.onAuthLogout = () => {
      // Clean up socket on logout
      disconnectSocket();
    };

    return keycloak;
  } catch (error) {
    console.error('Keycloak initialization failed:', error);
    throw {
      error: error,
    };
  }
};

/**
 * Manual token refresh with socket reconnection
 * @param {number} minValidity - Minimum validity in seconds
 * @returns {Promise<boolean>} Whether token was refreshed
 */
export const refreshTokenWithSocketUpdate = async (minValidity = 30) => {
  try {
    const refreshed = await keycloak.updateToken(minValidity);

    if (refreshed) {

      // Reconnect socket with new token
      try {
        disconnectSocket();
        initSocket(keycloak.token);
      } catch (socketError) {
        console.error('Manual socket reconnection error:', socketError);
      }
    }

    return refreshed;
  } catch (error) {
    console.error('Manual token refresh failed:', error);
    return false;
  }
};

export default keycloak;

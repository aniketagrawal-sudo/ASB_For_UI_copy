import { OktaAuth } from '@okta/okta-auth-js';
import { validateOktaConfig } from './validator';
import { disconnectSocket, initSocket } from './socket';

/**
 * Azure-optimized Okta authentication integration
 * - Token refresh with socket reconnection
 * - Improved error handling and retry logic
 * - Better logging for Azure Application Insights
 *
 * @version 1.0.0
 */

const oktaConfig = {
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI || `${window.location.origin}${import.meta.env.VITE_BASE_PATH || ''}/callback`,
  scopes: ['openid', 'profile', 'email'],
  responseType: ['code'],
  responseMode: 'fragment',
  pkce: true,
};

// Initialize Okta instance
let oktaAuth = null;

// Track token refresh operations
let isRefreshing = false;
let refreshCallbacks = [];

/**
 * Initialize Okta Auth
 * @returns {Promise<OktaAuth>} Okta Auth instance
 */
export const initializeOkta = async () => {
  // if (!validateOktaConfig()) {
  //   return Promise.reject(new Error('Okta not initialized due to missing configuration'));
  // }

  try {
    if (!oktaAuth) {
      oktaAuth = new OktaAuth(oktaConfig);

      // Setup token expiration handler
      oktaAuth.tokenManager.on('error', async (err) => {
        console.error('Token manager error:', err);

        // If it's an expiration error, try to refresh
        if (err.errorCode === 'E_REFRESH_STATE_NOT_FOUND') {
          // Force logout and redirect to login
          await oktaAuth.signOut();
          window.location.href = `/login`;
        }
      });

      // Listen for token renewal
      oktaAuth.tokenManager.on('renewed', () => {
        console.log('Token renewed successfully');
        handleTokenRenewal();
      });
    }

    // Handle callback from Okta redirect
    // If we're on the callback route, process the authorization code
    if (window.location.pathname.includes('/callback')) {
      console.log('Processing Okta callback...');
      try {
        // This will parse the authorization code from the URL and exchange it for tokens
        await oktaAuth.authStateManager.updateAuthState();
        console.log('Okta callback processed successfully');
      } catch (err) {
        console.error('Okta callback processing error:', err);
      }
    }

    // Check if user is already authenticated
    const authState = await oktaAuth.authStateManager.getAuthState();
    if (authState && authState.isAuthenticated) {
      // Ensure valid access token exists
      try {
        await oktaAuth.tokenManager.get('accessToken');
      } catch (err) {
        console.error('Failed to get access token:', err);
        throw new Error('Unable to retrieve access token');
      }
    }

    return oktaAuth;
  } catch (error) {
    console.error('Okta initialization failed:', error);
    throw {
      error: error,
    };
  }
};

/**
 * Handle token renewal and socket reconnection
 */
const handleTokenRenewal = async () => {
  try {
    // Reconnect socket with new token
    const accessToken = await oktaAuth.tokenManager.get('accessToken');
    if (accessToken) {
      try {
        const currentSocket = window.socketInstance;
        if (currentSocket) {
          disconnectSocket();
          const newSocket = initSocket(accessToken.accessToken);
          window.socketInstance = newSocket;
        }
      } catch (socketError) {
        console.error('Socket reconnection error:', socketError);
      }
    }
  } catch (error) {
    console.error('Token renewal error:', error);
  }
};

/**
 * Get the current authenticated user info
 * @returns {Promise<Object>} User object
 */
export const getOktaUser = async () => {
  try {
    if (!oktaAuth) {
      throw new Error('Okta Auth not initialized');
    }

    const user = await oktaAuth.getUser();
    return user;
  } catch (error) {
    console.error('Failed to get Okta user:', error);
    throw error;
  }
};

/**
 * Get auth state
 * @returns {Promise<Object>} Auth state
 */
export const getOktaAuthState = async () => {
  try {
    if (!oktaAuth) {
      throw new Error('Okta Auth not initialized');
    }

    return await oktaAuth.authStateManager.getAuthState();
  } catch (error) {
    console.error('Failed to get auth state:', error);
    throw error;
  }
};

/**
 * Get access token
 * @returns {Promise<string>} Access token
 */
export const getOktaAccessToken = async () => {
  try {
    if (!oktaAuth) {
      throw new Error('Okta Auth not initialized');
    }

    const accessToken = await oktaAuth.tokenManager.get('accessToken');
    return accessToken?.accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
};

/**
 * Login to Okta
 * @returns {Promise<void>}
 */
export const oktaLogin = async () => {
  try {
    if (!oktaAuth) {
      throw new Error('Okta Auth not initialized');
    }

    await oktaAuth.signInWithRedirect();
  } catch (error) {
    console.error('Okta login failed:', error);
    throw error;
  }
};

/**
 * Logout from Okta
 * @returns {Promise<void>}
 */
export const oktaLogout = async () => {
  try {
    if (!oktaAuth) {
      throw new Error('Okta Auth not initialized');
    }

    // Disconnect socket before logout
    disconnectSocket();

    await oktaAuth.signOut();
  } catch (error) {
    console.error('Okta logout failed:', error);
    throw error;
  }
};

/**
 * Manual token refresh with socket reconnection
 * @returns {Promise<boolean>} Whether token was refreshed
 */
export const refreshOktaTokenWithSocketUpdate = async () => {
  try {
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshCallbacks.push(resolve);
      });
    }

    isRefreshing = true;

    // Okta SDK automatically refreshes tokens when needed
    await oktaAuth.tokenManager.renew('accessToken');

    // Execute pending callbacks
    refreshCallbacks.forEach((callback) => callback(true));
    refreshCallbacks = [];
    isRefreshing = false;

    // Reconnect socket with new token
    await handleTokenRenewal();

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);

    // Notify waiting operations that refresh failed
    refreshCallbacks.forEach((callback) => callback(false));
    refreshCallbacks = [];
    isRefreshing = false;

    return false;
  }
};

export default oktaAuth;

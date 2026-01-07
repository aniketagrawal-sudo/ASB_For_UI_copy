import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initializeApp, getCurrentUser, logout } from '../../utils/okta';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import LinearLoader from '../../components/LinearLoader';
import { useDispatch } from 'react-redux';
import { initSocket } from '../../utils/socket';
import { setupSocketListeners } from '../../utils/socket/socketEvents';
import { notifyViaSnackBar } from '../../redux/store/conversationSlice';
import { setUser } from '../auth/authSlice';

/**
 * AuthProvider component for MPA (Multi-Page Application) authentication
 * 
 * Changes from SPA:
 * - Backend handles all authentication via HTTPOnly cookies
 * - Frontend only checks if user has valid session
 * - No token management needed
 * - Simplified initialization logic
 * - Socket authentication uses session cookies instead of tokens
 *
 * @version 2.0.0 - MPA Architecture
 */
const AuthProvider = ({ children }) => {
  const [initializationLoading, setInitializationLoading] = useState(true);
  const [authError, setAuthError] = useState();
  const socketInitializedRef = useRef(false);
  const connectionTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const disableLoading = () => {
    setInitializationLoading(false);
  };

  const enableLoading = () => {
    setInitializationLoading(true);
  };

  const cleanupApp = () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
  };

  /**
   * Extract groups/roles from user object
   */
  const extractUserRoles = (user) => {
    let userRoles = [];

    // Check for groups in user object
    if (user?.groups && Array.isArray(user.groups)) {
      userRoles = user.groups;
    }

    // Check for roles in user object
    if (user?.roles && Array.isArray(user.roles)) {
      userRoles = [...userRoles, ...user.roles];
    }

    // Remove duplicates
    userRoles = [...new Set(userRoles)];

    return userRoles;
  };

  /**
   * Initialize socket connection and set up event listeners
   * Uses session cookies for authentication (no token needed)
   */
  const handleUserAuthenticatedEvents = async (user) => {
    if (socketInitializedRef.current) {
      return;
    }

    try {
      // Extract roles from user object
      const userRoles = extractUserRoles(user);

      // Dispatch user info and roles to Redux
      dispatch(
        setUser({
          sub: user.sub || user.id,
          email: user.email,
          name: user.name,
          given_name: user.given_name || user.firstName,
          family_name: user.family_name || user.lastName,
          locale: user.locale,
          groups: userRoles,
          roles: userRoles,
        }),
      );

      // Initialize socket connection
      // In MPA mode, socket will use session cookies for authentication
      const socket = initSocket();
      socketInitializedRef.current = true;

      // Setup socket event listeners
      setupSocketListeners(socket, dispatch, disableLoading);

      // Monitor initial connection - timeout check
      const connectionTimeout = setTimeout(() => {
        if (socket && !socket.connected) {
          console.warn('Socket connection timeout - forcing initialization to complete');
          disableLoading();

          // Notify user about connection issues
          dispatch(
            notifyViaSnackBar({
              message: 'WebSocket connection timeout. Some real-time features may be unavailable.',
              severity: 'warning',
              open: true,
            }),
          );
        }
      }, 7000); // 7 second timeout for initial connection

      connectionTimeoutRef.current = connectionTimeout;

      // Verify connection occurs within timeout period
      socket.on('connect', () => {
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        disableLoading();
      });

      // Handle initial connection error
      socket.on('connect_error', (error) => {
        console.error('Socket connection error on initialization:', error.message);
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
          disableLoading();
        }

        // Notify user about connection issues
        dispatch(
          notifyViaSnackBar({
            message: `Socket connection error: ${error.message}. Some real-time features may be unavailable.`,
            severity: 'warning',
            open: true,
          }),
        );
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      disableLoading();
    }
  };

  /**
   * Initialize app by checking if user has valid session
   */
  const handleAppInitialization = async () => {
    try {
      enableLoading();

      // Check if user has valid session
      const user = await initializeApp();

      if (user) {
        // User has valid session
        await handleUserAuthenticatedEvents(user);
        setAuthError('');
      } else {
        // No valid session - redirect to login
        navigate('/login', { replace: true });
      }

      disableLoading();
    } catch (err) {
      console.error('Error in application initialization:', err);

      let errStr = 'Failed to connect. Please refresh! If issue still persists, please contact admin.';
      if (typeof err === 'string') {
        errStr = err + errStr;
      } else if (typeof err === 'object') {
        if (err?.message) {
          errStr = err.message + ' - ' + errStr;
        } else {
          errStr = JSON.stringify(err) + errStr;
        }
      }

      setAuthError(errStr);
      disableLoading();
    }
  };

  useEffect(() => {
    handleAppInitialization();
    return () => {
      cleanupApp();
    };
  }, []);

  // Handle login page errors
  useEffect(() => {
    if (location.pathname === '/login') {
      const searchParams = new URLSearchParams(location.search);
      const error = searchParams.get('error');
      const reason = searchParams.get('reason');
      let msg = '';
      if (error || reason) {
        msg = `${reason || error || ''}`.trim();
        setAuthError(msg);

        // Clean up query params from URL
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  if (initializationLoading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LinearLoader />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        initializationLoading: initializationLoading,
        authError: authError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

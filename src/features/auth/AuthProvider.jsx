import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { initializeKeycloak } from '../../utils/keycloak';
import PropTypes from 'prop-types';
import { validateKeyCloakRealm } from '../../utils/validator';
import { AuthContext } from './AuthContext';
import LinearLoader from '../../components/LinearLoader';
import { useDispatch } from 'react-redux';
import { disconnectSocket, initSocket } from '../../utils/socket';
import { setupSocketListeners } from '../../utils/socket/socketEvents';
import { notifyViaSnackBar } from '../../redux/store/conversationSlice';
import {setUser} from '../auth/authSlice';
import { KEYCLOAK } from '../../utils/constants';
/**
 * AuthProvider component handling Keycloak authentication and socket connection
 * with Azure-optimized settings for WebSockets
 *
 * Changes:
 * - Improved socket initialization with connection verification
 * - Added timeout handling for socket connection
 * - Added reconnection logic for socket
 * - Token refresh handling for socket authentication
 * - Better error handling
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
    disconnectSocket();
  };

  // Handle all events requiring user authentication
  const handleUserAuthenticatedEvents = (keycloak) => {
    if (socketInitializedRef.current) {
      return;
    }

    // Extract roles from keycloak resource access
    let userRoles = [];
    if (keycloak.resourceAccess) {
      // Combine all roles from all resources
      userRoles = Object.values(keycloak.resourceAccess).flatMap((resource) => resource.roles || []);
    }

    // Dispatch the roles to Redux
    if (userRoles.length > 0) {
      dispatch(
        setUser({
          ...keycloak.idTokenParsed,
          roles: userRoles,
        }),
      );
    }

    try {
      const socket = initSocket(keycloak.token);
      socketInitializedRef.current = true;

      // Setup socket event listeners
      setupSocketListeners(socket, dispatch, disableLoading);

      // Monitor initial connection - Azure WebSocket timeout check
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

      // Setup token refresh to update socket connection
      const originalUpdateToken = keycloak.updateToken;
      keycloak.updateToken = async (minValidity) => {
        try {
          const refreshed = await originalUpdateToken.call(keycloak, minValidity);
          if (refreshed) {
            disconnectSocket();
            socketInitializedRef.current = false;
            const newSocket = initSocket(keycloak.token);
            setupSocketListeners(newSocket, dispatch, disableLoading);
          }
          return refreshed;
        } catch (error) {
          console.error('Token refresh error:', error);
          return false;
        }
      };

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

  const initializeApp = async () => {
    try {
      if (!validateKeyCloakRealm()) {
        throw new Error('Invalid realm values');
      }

      enableLoading();
      const keycloak = await initializeKeycloak();

      if (keycloak?.authenticated) {
        const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
        const resourceAccess = keycloak?.tokenParsed?.resource_access?.[clientId];
        const hasRequiredRole = resourceAccess?.roles?.includes(`${clientId}-USER`);
        if (hasRequiredRole) {
          handleUserAuthenticatedEvents(keycloak);
          setAuthError('');
        } else {
          keycloak.authenticated = false;
          setAuthError('Failed to authenticate');
        }
        
      } 
      disableLoading();

    } catch (err) {
      console.error('Error in application initialization:', err);

      let errStr = 'Failed to connect. Please refresh! If issue still persists, please contact admin.';
      if (typeof err === 'string') {
        errStr = err + errStr;
      } else if (typeof err === 'object') {
        if (err?.error?.error) {
          errStr = err.error.error + errStr;
        } else if (err?.message) {
          errStr = err.message + errStr;
        } else {
          errStr = JSON.stringify(err) + errStr;
        }
      }

      setAuthError(errStr);
      disableLoading();
    }
  };
  

  useEffect(() => {
    initializeApp();
    return () => {
      cleanupApp();
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      const searchParams = new URLSearchParams(location.search);
      const error = searchParams.get('error');
      const reason = searchParams.get('reason');
      let msg = '';
      if (error || reason) {
        if (reason === 'missing_group') {
          msg = KEYCLOAK.MISSING_GROUP_ERROR;
        } else {
          msg = `${reason || ''}`.trim();
        }
        setAuthError(msg);

        // optional: clean up query params from URL
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

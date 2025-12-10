import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LinearLoader from './LinearLoader';
import { Box } from '@mui/material';
import backgroundImage from '../assets/bg-image.png';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { setLoading } from '../features/auth/authSlice';
import { getOktaAuthState } from '../utils/okta';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authState = await getOktaAuthState();
        setIsAuthenticated(authState?.isAuthenticated || false);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthState();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate(`/login`, { replace: true });
    }
    if (isAuthenticated && loading) {
      dispatch(setLoading(false));
    }
  }, [isAuthenticated, loading, navigate, dispatch]);

  // Still checking auth state
  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}>
        <LinearLoader />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}>
        <LinearLoader />
      </Box>
    );
  }

  if (isAuthenticated) {
    return children;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node, // Ensures children is a valid React node and required
};

export default ProtectedRoute;

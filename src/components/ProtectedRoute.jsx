import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LinearLoader from './LinearLoader';
import { Box } from '@mui/material';
import backgroundImage from '../assets/bg-image.png';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setLoading } from '../features/auth/authSlice';
import keycloak from '../utils/keycloak';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!keycloak?.authenticated) {
      navigate(`/login`, { replace: true });
    }
    if (keycloak?.authenticated && loading) {
      dispatch(setLoading(false));
    }
  }, [keycloak?.authenticated]);

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
  if (keycloak?.authenticated) {
    return children;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node, // Ensures children is a valid React node and required
};

export default ProtectedRoute;

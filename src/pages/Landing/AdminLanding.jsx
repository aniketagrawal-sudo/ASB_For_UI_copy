import { useEffect } from 'react';
import { Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser, setCurrentPage } from '../../features/auth/authSlice';
import classes from './AdminLanding.module.scss';
import AdminMainPanel from './Components/AdminLanding/AdminMainPanel';
import AdminSidePanel from './Components/AdminLanding/AdminSidePanel';
import { ADMIN_MENU_CONFIG } from './Components/AdminLanding/adminMenuConfig';

function AdminLanding() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const normalizedRole = user?.selectedRole?.toLowerCase() || '';

  const isAdmin =
    normalizedRole.includes('admin') || normalizedRole.includes('administrator');

  // 🟢 Default page set dynamically from config
  useEffect(() => {
    dispatch(setCurrentPage(ADMIN_MENU_CONFIG[0].id));
  }, [dispatch]);

  if (!isAdmin) {
    console.warn('Access denied for non-admin. Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      <div className={classes.contentWrapper}>
        <div className={classes.sidePanel}>
          <AdminSidePanel />
        </div>
        <div className={classes.mainPanel}>
          <AdminMainPanel />
        </div>
      </div>
    </Container>
  );
}

export default AdminLanding;

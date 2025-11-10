import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser, setCurrentPage } from '../../features/auth/authSlice';
import SidePanel from './Components/SidePanel';
import classes from './AdminLanding.module.scss';
import AdminMainPanel from './Components/AdminMainPanel';

function AdminLanding() {
  const dispatch = useDispatch();
  const userFromState = useSelector(selectUser);

  useEffect(() => {
    dispatch(setCurrentPage('kpi'));
  }, [dispatch]);

  // Normalize the role
  const normalizedRole = userFromState?.selectedRole?.toLowerCase() || '';

  // ✅ Redirect if user is not admin
  const isAdmin =
    normalizedRole.includes('admin') || normalizedRole.includes('administrator');

  if (!isAdmin) {
    console.warn('Access denied for non-admin. Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Dynamic Role Label for UI display
  const displayRole = normalizedRole.includes('admin')
    ? 'Admin Persona'
    : userFromState?.selectedRole;

  // ✅ Reuse common layout with sidebar
  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      <div className={classes.contentWrapper}>
        {/* ✅ Left Side Panel */}
        <div className={classes.sidePanel}>
          <SidePanel
            selectedRole={userFromState.selectedRole}
            onRefresh={() => {}}
            isPolling={false}
            executingQueries={false}
            dashboardsReady={{ home: true, insights: true }}
            dashboardsLoading={{ home: false, insights: false }}
          />
        </div>

        {/* ✅ Main Admin Content */}
        <div className={classes.mainPanel}>
          <AdminMainPanel />
        </div>
      </div>
    </Container>
  );
}

export default AdminLanding;

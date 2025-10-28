import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import {
  useGetAdminPersonasQuery,
  useGetAdminBiDashboardsQuery,
  useGetAdminDbTablesQuery,
  useGetAdminUsersQuery,
  useGetSystemStatusQuery,
  useGetRecentActivitiesQuery,
  useGetAppConfigQuery,
} from '../../services/adminService';
import {
  selectActiveSection,
  setLoading,
  setPersonas,
  setBiDashboards,
  setDbTables,
  setUsers,
  setSystemStatus,
  setRecentActivities,
  setAppConfig,
  setError,
  setActiveSection,
} from '../../redux/store/adminSlice';
import { selectUser, selectIsAdmin } from '../../features/auth/authSlice';
import AdminSidePanel from './Components/AdminSidePanel';
import AdminMainPanel from './Components/AdminMainPanel';
import classes from './AdminLanding.module.scss';

function AdminLanding() {
  const dispatch = useDispatch();
  const userFromState = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const activeSection = useSelector(selectActiveSection);

  // Get the selected industry ID from user state
  const selectedIndustryId = userFromState?.selectedIndustry?.id;
  const selectedIndustryName = userFromState?.selectedIndustry?.name;
  // Fetch admin data using RTK Query hooks with industryId
  const {
    data: personasData,
    isLoading: isPersonasLoading,
    error: personasError,
  } = useGetAdminPersonasQuery(selectedIndustryId, {
    skip: activeSection !== 'personas' && activeSection !== 'home',
    refetchOnMountOrArgChange: true,
  });

  const {
    data: biDashboardsData,
    isLoading: isBiDashboardsLoading,
    error: biDashboardsError,
  } = useGetAdminBiDashboardsQuery(selectedIndustryId, {
    skip: activeSection !== 'bi-dashboards' && activeSection !== 'home',
    refetchOnMountOrArgChange: true,
  });

  const {
    data: dbTablesData,
    isLoading: isDbTablesLoading,
    error: dbTablesError,
  } = useGetAdminDbTablesQuery(selectedIndustryId, {
    skip: activeSection !== 'db-tables' && activeSection !== 'home',
    refetchOnMountOrArgChange: true,
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useGetAdminUsersQuery(selectedIndustryId, {
    skip: activeSection !== 'users' && activeSection !== 'home',
    refetchOnMountOrArgChange: true,
  });

  const {
    data: systemStatusData,
    isLoading: isSystemStatusLoading,
    error: systemStatusError,
  } = useGetSystemStatusQuery(selectedIndustryId, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000, // Poll every minute for system status
  });

  const {
    data: recentActivitiesData,
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useGetRecentActivitiesQuery(selectedIndustryId, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: appConfigData,
    isLoading: isAppConfigLoading,
    error: appConfigError,
  } = useGetAppConfigQuery(selectedIndustryId, {
    refetchOnMountOrArgChange: true,
  });

  // Update Redux store when data is fetched
  useEffect(() => {
    // Update loading states
    dispatch(setLoading({ entity: 'personas', isLoading: isPersonasLoading }));
    dispatch(setLoading({ entity: 'biDashboards', isLoading: isBiDashboardsLoading }));
    dispatch(setLoading({ entity: 'dbTables', isLoading: isDbTablesLoading }));
    dispatch(setLoading({ entity: 'users', isLoading: isUsersLoading }));
    dispatch(setLoading({ entity: 'systemStatus', isLoading: isSystemStatusLoading }));
    dispatch(setLoading({ entity: 'recentActivities', isLoading: isActivitiesLoading }));
    dispatch(setLoading({ entity: 'appConfig', isLoading: isAppConfigLoading }));

    // Store data in Redux when it's available
    if (personasData?.data) {
      dispatch(setPersonas(personasData.data));
    }

    if (biDashboardsData?.data) {
      dispatch(setBiDashboards(biDashboardsData.data));
    }

    if (dbTablesData?.data) {
      dispatch(setDbTables(dbTablesData.data));
    }

    if (usersData?.data) {
      dispatch(setUsers(usersData.data));
    }

    if (systemStatusData?.data) {
      dispatch(setSystemStatus(systemStatusData.data));
    }

    if (recentActivitiesData?.data) {
      dispatch(setRecentActivities(recentActivitiesData.data));
    }

    if (appConfigData?.data) {
      dispatch(setAppConfig(appConfigData.data));
    }
  }, [
    dispatch,
    personasData,
    biDashboardsData,
    dbTablesData,
    usersData,
    systemStatusData,
    recentActivitiesData,
    appConfigData,
    isPersonasLoading,
    isBiDashboardsLoading,
    isDbTablesLoading,
    isUsersLoading,
    isSystemStatusLoading,
    isActivitiesLoading,
    isAppConfigLoading,
  ]);

  // Handle errors
  useEffect(() => {
    if (personasError) {
      dispatch(setError({ entity: 'personas', error: personasError.data?.message || 'Error loading personas' }));
    }

    if (biDashboardsError) {
      dispatch(
        setError({ entity: 'biDashboards', error: biDashboardsError.data?.message || 'Error loading BI dashboards' }),
      );
    }

    if (dbTablesError) {
      dispatch(setError({ entity: 'dbTables', error: dbTablesError.data?.message || 'Error loading database tables' }));
    }

    if (usersError) {
      dispatch(setError({ entity: 'users', error: usersError.data?.message || 'Error loading users' }));
    }

    if (systemStatusError) {
      dispatch(
        setError({
          entity: 'systemStatus',
          error: systemStatusError.data?.message || 'Error loading system status',
        }),
      );
    }

    if (activitiesError) {
      dispatch(
        setError({
          entity: 'recentActivities',
          error: activitiesError.data?.message || 'Error loading recent activities',
        }),
      );
    }

    if (appConfigError) {
      dispatch(
        setError({ entity: 'appConfig', error: appConfigError.data?.message || 'Error loading application config' }),
      );
    }
  }, [
    dispatch,
    personasError,
    biDashboardsError,
    dbTablesError,
    usersError,
    systemStatusError,
    activitiesError,
    appConfigError,
  ]);

  // Handle section change
  const handleSectionChange = (section) => {
    dispatch(setActiveSection(section));
  };

  // Only allow access if user has the ADMINISTRATOR role
  if (!isAdmin || !userFromState?.selectedRole || userFromState.selectedRole !== 'ADMINISTRATOR') {
    return <Navigate to="/dashboard" replace />;
  }

  // Create adminData object to pass to components
  const adminData = {
    loading:
      isPersonasLoading ||
      isBiDashboardsLoading ||
      isDbTablesLoading ||
      isUsersLoading ||
      isSystemStatusLoading ||
      isActivitiesLoading ||
      isAppConfigLoading,
    error:
      personasError ||
      biDashboardsError ||
      dbTablesError ||
      usersError ||
      systemStatusError ||
      activitiesError ||
      appConfigError
        ? 'Failed to load admin data'
        : null,
    personas: personasData?.data || [],
    biDashboards: biDashboardsData?.data || [],
    dbTables: dbTablesData?.data || [],
    users: usersData?.data || [],
    systemStatus: systemStatusData?.data || {},
    recentActivities: recentActivitiesData?.data || [],
    appConfig: appConfigData?.data || {},
    selectedIndustryName,
  };

  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      <div className={classes.contentWrapper}>
        <div className={classes.sidePanel}>
          <AdminSidePanel selectedSection={activeSection} onSectionChange={handleSectionChange} adminData={adminData} />
        </div>
        <div className={classes.mainPanel}>
          <AdminMainPanel selectedSection={activeSection} adminData={adminData} />
        </div>
      </div>
    </Container>
  );
}

export default AdminLanding;

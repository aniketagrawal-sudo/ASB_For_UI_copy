import { useState, useEffect, useRef } from 'react';
import { Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import MicroStrategyDashboard from './MicroStrategyDashboard';
import PowerBIDashboard from './PowerBIDashboard';
import { getDashboardConfigForClient } from '../../config/clientDashboardMapping';
import classes from './ReportsDashboard.module.scss';

/**
 * Reports Dashboard with dynamic tab visibility based on client mapping
 * Shows only the dashboards available for the current client/industry
 */
const ReportsDashboard = () => {
  const userFromState = useSelector(selectUser);

  // Get client ID from current selected industry
  const currentIndustry = userFromState?.industries?.find((ind) => ind.name === userFromState.selectedIndustry);
  const clientId = currentIndustry?.clientId;

  // Get dashboard configuration for current client
  const dashboardConfig = getDashboardConfigForClient(clientId);

  // Set initial dashboard based on what's available
  const getInitialDashboard = () => {
    if (dashboardConfig.defaultDashboard === 'powerbi' && dashboardConfig.powerbi) {
      return 'powerbi';
    }
    if (dashboardConfig.defaultDashboard === 'mstr' && dashboardConfig.microstrategy) {
      return 'mstr';
    }
    // Fallback to first available
    if (dashboardConfig.microstrategy) return 'mstr';
    if (dashboardConfig.powerbi) return 'powerbi';
    return 'mstr'; // Final fallback
  };

  const [activeDashboard, setActiveDashboard] = useState(getInitialDashboard());
  const [isLoading] = useState(false);

  // Extract industry and persona IDs
  const industryId = currentIndustry?.id;
  const personaId = userFromState?.industries
    ?.flatMap((industry) => industry.personas.filter((p) => p.name === userFromState.selectedRole))
    .find((p) => p)?.id;

  // Refs to access child component methods
  const mstrDashboardRef = useRef(null);
  const powerbiDashboardRef = useRef(null);

  // Reset dashboard when client changes
  useEffect(() => {
    const newInitialDashboard = getInitialDashboard();
    setActiveDashboard(newInitialDashboard);
  }, [clientId, dashboardConfig]);

  // Handle dashboard type change with loading state
  const handleDashboardChange = (event, newValue) => {
    setActiveDashboard(newValue);
  };

  // If no dashboards are available for this client
  if (!dashboardConfig.microstrategy && !dashboardConfig.powerbi) {
    return (
      <Box className={classes.container}>
        <Box className={classes.modernHeader}>
          <Typography variant="h6" className={classes.noReportsMessage}>
            No reports available for {userFromState.selectedIndustry}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Check available dashboards
  const availableDashboards = [
    ...(dashboardConfig.microstrategy ? ['mstr'] : []),
    ...(dashboardConfig.powerbi ? ['powerbi'] : []),
  ];

  // Show headers when there are available dashboards
  const showHeaders = availableDashboards.length > 0;

  return (
    <Box className={classes.container}>
      {/* Show header with tabs when dashboards are available */}
      {showHeaders && (
        <Box className={classes.modernHeader}>
          <div className={classes.headerContent}>
            <Tabs
              value={activeDashboard}
              onChange={handleDashboardChange}
              className={classes.modernTabs}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#f7901d',
                },
              }}>
              {dashboardConfig.microstrategy && (
                <Tab value="mstr" label="MicroStrategy" className={classes.modernTab} />
              )}
              {dashboardConfig.powerbi && <Tab value="powerbi" label="Power BI" className={classes.modernTab} />}
            </Tabs>
          </div>
        </Box>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className={classes.loadingContainer}>
          <CircularProgress className={classes.spinner} />
          <Typography className={classes.loadingText}>
            Loading {activeDashboard === 'mstr' ? 'MicroStrategy' : 'Power BI'} Dashboard...
          </Typography>
        </div>
      )}

      {/* Dashboard content */}
      <Box className={classes.dashboardContent}>
        {activeDashboard === 'mstr' && dashboardConfig.microstrategy ? (
          <MicroStrategyDashboard
            ref={mstrDashboardRef}
            hideControls={true}
            industryId={industryId}
            personaId={personaId}
          />
        ) : (
          <PowerBIDashboard
            ref={powerbiDashboardRef}
            hideControls={true}
            industryId={industryId}
            personaId={personaId}
          />
        )}
      </Box>
    </Box>
  );
};

export default ReportsDashboard;

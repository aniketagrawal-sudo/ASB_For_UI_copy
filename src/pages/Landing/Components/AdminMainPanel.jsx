import { Typography, Box, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectCurrentPage } from '../../../features/auth/authSlice';
import classes from './AdminMainPanel.module.scss';
import KpiRepository from '../../../components/AdminPersona/KpiRepository';
import UsageStats from '../../../components/AdminPersona/UsageStats';

function AdminMainPanel() {
  const currentPage = useSelector(selectCurrentPage) || 'kpi';
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  // ✅ Header
  const renderHeaderBar = () => (
    <Box
      className={classes.headerBar}
      sx={{
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        fontFamily: 'Roboto, sans-serif',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: isSmallScreen ? '14px' : '16px',
        }}
      >
        {currentPage === 'usage' ? 'Usage Stats' : 'KPI Repository'}
      </Typography>
    </Box>
  );

  // ✅ Dynamic content
  const renderMainContent = () => {
    switch (currentPage) {
      case 'usage':
        return (
          <div className={classes.panelContent}>
            <UsageStats />
          </div>
        );
      case 'kpi':
      default:
        return (
          <div className={classes.panelContent}>
            <KpiRepository />
          </div>
        );
    }
  };

  return (
    <div className={classes.mainPanelContainer}>
      {renderHeaderBar()}
      <div className={classes.mainContentWrapper}>{renderMainContent()}</div>
    </div>
  );
}

AdminMainPanel.propTypes = {
  dashboardsReady: PropTypes.object,
  dashboardsLoading: PropTypes.object,
  executingQueries: PropTypes.bool,
  currentProcessingInsight: PropTypes.string,
};

export default AdminMainPanel;

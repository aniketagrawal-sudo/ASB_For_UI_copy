import { useSelector } from 'react-redux';
import classes from './AdminMainPanel.module.scss';
import KpiRepository from '../../../../components/AdminPersona/KpiRepository';
import UsageStats from '../../../../components/AdminPersona/UsageStats';
import { selectCurrentPage } from '../../../../features/auth/authSlice';
import { ADMIN_MENU_CONFIG } from './adminMenuConfig';

// Create a lookup map for dynamic rendering
const COMPONENT_MAP = {
  KpiRepository,
  UsageStats,
};

function AdminMainPanel() {
  const currentPage = useSelector(selectCurrentPage) || ADMIN_MENU_CONFIG[0].id;
  const activeConfig = ADMIN_MENU_CONFIG.find((m) => m.id === currentPage);

  const ActiveComponent = activeConfig
    ? COMPONENT_MAP[activeConfig.component]
    : KpiRepository;

  return (
    <div className={classes.mainPanelContainer}>
      <div className={classes.headerBar}>
        <h3>{activeConfig?.label || 'KPI Repository'}</h3>
      </div>
      <div className={classes.mainContentWrapper}>
        <ActiveComponent />
      </div>
    </div>
  );
}

export default AdminMainPanel;

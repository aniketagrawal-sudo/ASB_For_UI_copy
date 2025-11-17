// src/pages/AdminLanding/Components/adminMenuConfig.js

import DashboardIcon from '../../../../assets/Sidepanel/DashboardIcon.svg';
import InsightsIcon from '../../../../assets/Sidepanel/InsightsIcon.svg';

export const ADMIN_MENU_CONFIG = [
  {
    id: 'kpi',
    label: 'KPI Repository',
    icon: DashboardIcon,
    component: 'KpiRepository', // reference by name
  },
  {
    id: 'usage',
    label: 'Usage Stats',
    icon: InsightsIcon,
    component: 'UsageStats',
  },
];

// You can easily add new pages later:
// {
//   id: 'userManagement',
//   label: 'User Management',
//   icon: UserIcon,
//   component: 'UserManagement',
// }

// src/pages/AdminLanding/Components/adminMenuConfig.js

import InsightsIcon from '../../../../assets/Sidepanel/InsightsIcon.svg';
import KpiRepository from '../../../../assets/Sidepanel/KpiRepository.png';

export const ADMIN_MENU_CONFIG = [
  {
    id: 'kpi',
    label: 'KPI Repository',
    icon: KpiRepository,
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

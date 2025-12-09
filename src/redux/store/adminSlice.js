import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminKPIList: [
    {
      title: "Total KPI",
      value: 25,
      changeText: "3 more than Previous Month",
      isPositive: true,
    },
    {
      title: "Assigned KPIs",
      value: 19,
      changeText: "3 more than Previous Month",
      isPositive: true,
    },
    {
      title: "Unassigned KPIs",
      value: 6,
      changeText: "2 less than Previous Month",
      isPositive: false,
    },
    {
      title: "Categories",
      value: 3,
      changeText: "No New Categories since March",
      isPositive: false,
    },
  ],
  adminKpiTableList: [
  {
    id: '1',
    username: "Total Loan Portfolio",
    description: "Tracks the total value of loans managed by R...",
    category: 'OKR',
    persona: "Assign",
  },
  {
    id: '2',
    username: "New Accounts Opened",
    description: "Measures the number of new client account...",
    category: 'Widget',
    persona: "unAssign",
  },
  {
    id: '3',
    username: "Customer Retention Rate",
    description: "Percentage of clients retained over a define...",
    category: 'Chart',
    persona: "Assign",
  },
  {
    id: '4',
    username: "Cross-Sell Ratio",
    description: "Ratio of additional products sold to existing...",
    category: 'Dashboard Metric',
    persona: "unAssign",
  },
],
adminUsageStatsKPIList: [
    {
      title: "Total Users", 
      value: "1247", 
      changeText: "10 new users ", 
      isPositive: true,
    },
    {
      title: "Avg Time Spent", 
      value: "6.5Hrs", 
      changeText: "1.5% MoM", 
      isPositive: true,
    },
    {
      title: "Active Users", 
      value: "923", 
      changeText: "-10 users", 
      isPositive: false,
    },
    {
      title: "Unique Logins", 
      value: "124", 
      changeText: "4 new unique logins", 
      isPositive: true, 
    },
  ],
adminUsageStatsTableList: [
  {
    id: '1',
    username: 'William Anderson',
      activeSince: '06/07/24',
    avgTimeSpent: '5 Min',
    description: 'VP - Commercial Banking',
    category: 'OKR',
    persona: 'Manager',
    status: 'In-Active',
  },
  {
    id: '2',
    username: 'Mia White',
     activeSince: '06/08/25',
    avgTimeSpent: '10 Min',
    description: 'VP - Commercial Banking',
    category: 'Widget',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '3',
    username: 'Neha Kapoor',
      activeSince: '12/03/26',
    avgTimeSpent: '3 Min',
    description: 'Team Leader',
    category: 'Chart',
    persona: 'Regional Manager',
    status: 'Active',
  },
  {
    id: '4',
    username: 'Emily Johnson',
      activeSince: '02/07/24',
    avgTimeSpent: '12 Min',
    description: 'Team Leader',
    category: 'Dashboard Metric',
    persona: 'Regional Manager',
    status: 'Active',
  },
],
adminUsageStatsLoginTrends: {
  '6 Months': [
    { month: 'Jan', 'Persona 1': 800, 'Persona 2': 900, 'Persona 3': 400 },
    { month: 'Feb', 'Persona 1': 600, 'Persona 2': 800, 'Persona 3': 500 },
    { month: 'Mar', 'Persona 1': 700, 'Persona 2': 950, 'Persona 3': 600 },
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '3 Months': [
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '1 Month': [{ month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 }],
},
adminUsageStatsTimeSpentBar: {
  Day: [
    { name: "Persona 1", hours: 7,   avgTimeSpent: 1.4, activeUsers: 120 },
    { name: "Persona 2", hours: 9,   avgTimeSpent: 1.8, activeUsers: 95 },
    { name: "Persona 3", hours: 12,  avgTimeSpent: 2.4, activeUsers: 140 },
  ],

  Week: [
    { name: "Persona 1", hours: 45,  avgTimeSpent: 6.4, activeUsers: 780 },
    { name: "Persona 2", hours: 52,  avgTimeSpent: 7.4, activeUsers: 680 },
    { name: "Persona 3", hours: 68,  avgTimeSpent: 9.7, activeUsers: 820 },
  ],

  Month: [
    { name: "Persona 1", hours: 168, avgTimeSpent: 42.0, activeUsers: 3000 },
    { name: "Persona 2", hours: 200, avgTimeSpent: 50.0, activeUsers: 2800 },
    { name: "Persona 3", hours: 240, avgTimeSpent: 60.0, activeUsers: 3500 },
  ],
},
adminUsageStatsChartThreeBar: [
  { name: "Persona 1", value: 7, avgTimeSpent: 1.4, users: 120, status: "Active" },
  { name: "Persona 2", value: 9, avgTimeSpent: 1.8, users: 95, status: "Inactive" },
  { name: "Persona 3", value: 12, avgTimeSpent: 2.4, users: 140, status: "Active" }
],
  // Personas management
  personas: [],
  selectedPersona: null,

  // BI dashboards ma
  // nagement
  biDashboards: [],
  selectedBiDashboard: null,

  // Database tables management
  dbTables: [],
  selectedTable: null,

  // User management
  users: [],
  selectedUser: null,

  // System status and monitoring
  systemStatus: {
    apiServerStatus: null, // "online", "degraded", "offline"
    databaseStatus: null, // "connected", "disconnected", "error"
    azureAdStatus: null, // "active", "inactive", "error"
    biServicesStatus: null, // "online", "offline", "degraded"
  },

  // Recent activities log
  recentActivities: [],

  // Application configuration
  appConfig: null,

  // UI state management
  activeSection: 'home', // 'home', 'personas', 'bi-dashboards', 'db-tables', 'users'
  activeSectionDetail: null, // For storing IDs of selected items within sections

  // Loading and error states
  loading: {
    personas: false,
    biDashboards: false,
    dbTables: false,
    users: false,
    systemStatus: false,
    recentActivities: false,
    appConfig: false,
  },

  errors: {
    personas: null,
    biDashboards: null,
    dbTables: null,
    users: null,
    systemStatus: null,
    recentActivities: null,
    appConfig: null,
  },

  // Status tracking for mutations
  updateStatus: {
    pending: false,
    success: false,
    error: null,
    lastUpdated: null,
    entityType: null, // 'persona', 'biDashboard', 'user', 'config'
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Section navigation actions
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
      // Reset detail selection when changing sections
      state.activeSectionDetail = null;
    },

    setActiveSectionDetail: (state, action) => {
      state.activeSectionDetail = action.payload;
    },

    // Data storage actions - for storing API responses
    setPersonas: (state, action) => {
      state.personas = action.payload;
      state.loading.personas = false;
      state.errors.personas = null;
    },

    setBiDashboards: (state, action) => {
      state.biDashboards = action.payload;
      state.loading.biDashboards = false;
      state.errors.biDashboards = null;
    },

    setDbTables: (state, action) => {
      state.dbTables = action.payload;
      state.loading.dbTables = false;
      state.errors.dbTables = null;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading.users = false;
      state.errors.users = null;
    },

    setSystemStatus: (state, action) => {
      state.systemStatus = action.payload;
      state.loading.systemStatus = false;
      state.errors.systemStatus = null;
    },

    setRecentActivities: (state, action) => {
      state.recentActivities = action.payload;
      state.loading.recentActivities = false;
      state.errors.recentActivities = null;
    },

    setAppConfig: (state, action) => {
      state.appConfig = action.payload;
      state.loading.appConfig = false;
      state.errors.appConfig = null;
    },
 
      setAdminKPIList: (state, action) => {
      state.adminKPIList = action.payload;
    },

      setAdminKpiTableList: (state, action) => {
      state.adminKpiTableList = action.payload;
    },

      setAdminUsageStatsKPIList: (state, action) => {
      state.adminUsageStatsKPIList = action.payload;
    },

      setAdminUsageStatsTableList: (state, action) => {
      state.adminUsageStatsTableList = action.payload;
    },
      setAdminUsageStatsLoginTrends: (state, action) => {
      state.adminUsageStatsLoginTrends = action.payload;
    },
      setAdminUsageStatsTimeSpentBar: (state, action) => {
      state.adminUsageStatsTimeSpentBar = action.payload;
    },
      setAdminUsageStatsChartThreeBar: (state, action) => {
      state.adminUsageStatsChartThreeBar = action.payload;
    },
  
    // Selection actions - for setting selected items
    selectPersona: (state, action) => {
      state.selectedPersona = action.payload;
    },

    selectBiDashboard: (state, action) => {
      state.selectedBiDashboard = action.payload;
    },

    selectTable: (state, action) => {
      state.selectedTable = action.payload;
    },

    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },



    // Loading state actions
    setLoading: (state, action) => {
      const { entity, isLoading } = action.payload;
      if (state.loading.hasOwnProperty(entity)) {
        state.loading[entity] = isLoading;

        // Clear error when starting to load
        if (isLoading) {
          state.errors[entity] = null;
        }
      }
    },

    // Error state actions
    setError: (state, action) => {
      const { entity, error } = action.payload;
      if (state.errors.hasOwnProperty(entity)) {
        state.errors[entity] = error;
        state.loading[entity] = false;
      }
    },

    // Update status actions
    setUpdatePending: (state, action) => {
      state.updateStatus = {
        ...state.updateStatus,
        pending: true,
        success: false,
        error: null,
        entityType: action.payload,
      };
    },

    setUpdateSuccess: (state, action) => {
      state.updateStatus = {
        pending: false,
        success: true,
        error: null,
        lastUpdated: new Date().toISOString(),
        entityType: action.payload,
      };
    },

    setUpdateError: (state, action) => {
      const { entityType, error } = action.payload;
      state.updateStatus = {
        pending: false,
        success: false,
        error,
        lastUpdated: new Date().toISOString(),
        entityType,
      };
    },

    resetUpdateStatus: (state) => {
      state.updateStatus = {
        pending: false,
        success: false,
        error: null,
        lastUpdated: null,
        entityType: null,
      };
    },

    // Reset action to clear all admin data
    resetAdminData: () => initialState,
  },
});

// Export actions
export const {
  setActiveSection,
  setActiveSectionDetail,
  setPersonas,
  setBiDashboards,
  setDbTables,
  setUsers,
  setSystemStatus,
  setRecentActivities,
  setAppConfig,
  selectPersona,
  selectBiDashboard,
  selectTable,
  selectUser,
  setLoading,
  setError,
  setUpdatePending,
  setUpdateSuccess,
  setUpdateError,
  resetUpdateStatus,
  resetAdminData,
  setAdminKPIList,
  setAdminKpiTableList,
  setAdminUsageStatsTableList,
  setAdminUsageStatsKPIList,
  setAdminUsageStatsChartThreeBar,
  setAdminUsageStatsTimeSpentBar,
  setAdminUsageStatsLoginTrends
} = adminSlice.actions;

// Export selectors
export const selectActiveSection = (state) => state.admin.activeSection;
export const selectActiveSectionDetail = (state) => state.admin.activeSectionDetail;
export const selectAdminPersonas = (state) => state.admin.personas;
export const selectAdminBiDashboards = (state) => state.admin.biDashboards;
export const selectAdminDbTables = (state) => state.admin.dbTables;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminSystemStatus = (state) => state.admin.systemStatus;
export const selectAdminRecentActivities = (state) => state.admin.recentActivities;
export const selectAdminAppConfig = (state) => state.admin.appConfig;
export const selectSelectedPersona = (state) => state.admin.selectedPersona;
export const selectSelectedBiDashboard = (state) => state.admin.selectedBiDashboard;
export const selectSelectedTable = (state) => state.admin.selectedTable;
export const selectSelectedUser = (state) => state.admin.selectedUser;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminErrors = (state) => state.admin.errors;
export const selectAdminUpdateStatus = (state) => state.admin.updateStatus;

export const selectAdminKPIList = (state) => {
  return state.admin?.adminKPIList || [];
};

export const selectAdminKpiTableList = (state) => {
  return state.admin?.adminKpiTableList || [];
};

export const selectAdminUsageStatsTableList = (state) => {
  return state.admin?.adminUsageStatsTableList || [];
};
export const selectAdminUsageStatsLoginTrends = (state) => {
  return state.admin?.adminUsageStatsLoginTrends || [];
};
export const selectAdminUsageStatsTimeSpentBar = (state) => {
  return state.admin?.adminUsageStatsTimeSpentBar || [];
};
export const selectAdminUsageStatsChartThreeBar = (state) => {
  return state.admin?.adminUsageStatsChartThreeBar || [];
};

export const selectAdminUsageStatsKPIList = (state) => {
  return state.admin?.adminUsageStatsKPIList || [];
};

// Helper selectors for specific loading states
export const selectPersonasLoading = (state) => state.admin.loading.personas;
export const selectBiDashboardsLoading = (state) => state.admin.loading.biDashboards;
export const selectDbTablesLoading = (state) => state.admin.loading.dbTables;
export const selectUsersLoading = (state) => state.admin.loading.users;
export const selectSystemStatusLoading = (state) => state.admin.loading.systemStatus;
export const selectRecentActivitiesLoading = (state) => state.admin.loading.recentActivities;
export const selectAppConfigLoading = (state) => state.admin.loading.appConfig;

// Helper selectors for specific error states
export const selectPersonasError = (state) => state.admin.errors.personas;
export const selectBiDashboardsError = (state) => state.admin.errors.biDashboards;
export const selectDbTablesError = (state) => state.admin.errors.dbTables;
export const selectUsersError = (state) => state.admin.errors.users;
export const selectSystemStatusError = (state) => state.admin.errors.systemStatus;
export const selectRecentActivitiesError = (state) => state.admin.errors.recentActivities;
export const selectAppConfigError = (state) => state.admin.errors.appConfig;

export default adminSlice.reducer;

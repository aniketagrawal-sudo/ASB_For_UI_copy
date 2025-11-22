import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  homeScreenData: null,
  homeSummary: null,
  insightDetails: null,
  insightsScreenData: null,
  reportsData: null,
  loading: {
    home: true,
    insights: true,
  },
  error: null,
  chartFilters: {},
  dashboardCount: {
    insight: 0,
    reports: 0,
    artifacts: 0,
  },
  lastRefreshed: {
    home: null,
    insight: null,
  },
  queryResults: {},
  queryExecutionStates: {
    batchExecuting: false,
    totalQueries: 0,
    completedQueries: 0,
    failedQueries: 0,
  },
  dashboardReadiness: {
    home: false,
    insights: false,
  },
  KpiDashboardData: {
    kpis: [
      { clientId: 1, title: 'Deposit Balance', value: '$10M', sub: '(+3.2% of LY Avg)', trend: 'up' },
      { clientId: 1, title: 'Loan Outstanding', value: '$1.2M', sub: '(Out of $10M)' },
      { clientId: 1, title: 'Credit Utilisation', value: '60%', sub: '(Out of $22M)' },
      { clientId: 1, title: 'Net Profit', value: '$2.4M', sub: '(+5% YoY)', trend: 'up' },
      { clientId: 2, title: 'Credit Utilisation', value: '60%', sub: '(Out of $22M)' },
      { clientId: 2, title: 'Net Profit', value: '$2.4M', sub: '(+5% YoY)', trend: 'up' },
    ],
    score: [
      {
        clientId: 1,
        title: 'Financial Score',
        value: '8.1/10',
        sub: '(+0.5 of MoM)',
        badge: 'Good',
        badgeColor: 'yellow',
        trend: 'up',
      },
      {
        clientId: 1,
        title: 'Relationship Score',
        value: '8.6/10',
        sub: '(+1.5% MoM)',
        badge: 'Great',
        badgeColor: 'green',
        trend: 'up',
      },
      {
        clientId: 1,
        title: 'Risk and Stability Score',
        value: '7.2/10',
        sub: '(-0.5% MoM)',
        badge: 'Low Risk',
        badgeColor: 'lightGreen',
        trend: 'down',
      },
      {
        clientId: 2,
        title: 'Risk and Stability Score',
        value: '7.2/10',
        sub: '(-0.5% MoM)',
        badge: 'Low Risk',
        badgeColor: 'lightGreen',
        trend: 'down',
      },
    ],
  },
  depositLoanDetails: {
    MoM: [
      {
        clientId: 1,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.65, 0.6, 0.62, 0.7, 0.78, 0.88, 0.98, 1.02, 1.05, 1.1, 0.9, 0.6],
      },
      {
        clientId: 2,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.6, 0.61, 0.4, 0.8, 0.12, 0.44, 0.45, 1.08, 1.98, 1.2, 0.2, 0.7],
      },
    ],
    YoY: [
      {
        clientId: 1,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [3.0, 6.0, 13.8, 10.5, 4.8],
      },
      {
        clientId: 2,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [4.0, 7.0, 10.8, 10.5, 2.8],
      },
    ],
    QoQ: [
      {
        clientId: 1,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.7, 0.9, 1.0, 0.6],
      },
      {
        clientId: 2,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.3, 0.9, 1.0, 0.8],
      },
    ],
  },
  loanOutstandingDetails: {
    MoM: [
      {
        clientId: 1,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.45, 0.55, 0.8, 0.8, 0.6, 0.5, 0.7, 0.9, 0.75, 1.0, 0.85, 0.65],
      },
      {
        clientId: 2,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0.4, 0.9, 0.2, 0.1, 0.6, 0.9, 0.3, 0.9, 0.75, 2.0, 0.85, 0.5],
      },
    ],
    YoY: [
      {
        clientId: 1,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [2.2, 3.1, 4.0, 3.4, 2.8],
      },
      {
        clientId: 2,
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [4.0, 1.1, 4.0, 3.4, 2.8],
      },
    ],
    QoQ: [
      {
        clientId: 1,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.5, 0.9, 1.1, 0.7],
      },
      {
        clientId: 2,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.9, 0.9, 0.9, 0.7],
      },
    ],
  },
  revenueGraphDetails: {},
  TotalProfitandLossRelationship: {
    Top1 : {
      YoY: {
        Profit: [
          { year: 2021, product1: 700000, product2: 600000, product3: 500000, clientId: 1 },
          { year: 2022, product1: 800000, product2: 700000, product3: 650000, clientId: 1 },
          { year: 2023, product1: 900000, product2: 850000, product3: 800000, clientId: 1 },
          { year: 2021, product1: 750000, product2: 620000, product3: 480000, clientId: 2 },
          { year: 2022, product1: 830000, product2: 710000, product3: 660000, clientId: 2 },
          { year: 2023, product1: 920000, product2: 860000, product3: 790000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 200000, product2: 180000, product3: 160000, clientId: 1 },
          { year: 2022, product1: 150000, product2: 140000, product3: 130000, clientId: 1 },
          { year: 2023, product1: 100000, product2: 90000, product3: 80000, clientId: 1 },
          { year: 2021, product1: 210000, product2: 170000, product3: 150000, clientId: 2 },
          { year: 2022, product1: 160000, product2: 130000, product3: 120000, clientId: 2 },
          { year: 2023, product1: 110000, product2: 85000, product3: 82000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 90000, product2: 85000, product3: 80000, clientId: 1 },
          { month: 'Feb', product1: 95000, product2: 90000, product3: 88000, clientId: 1 },
          { month: 'Mar', product1: 100000, product2: 95000, product3: 92000, clientId: 1 },
          { month: 'Jan', product1: 88000, product2: 83000, product3: 81000, clientId: 2 },
          { month: 'Feb', product1: 96000, product2: 91000, product3: 87000, clientId: 2 },
          { month: 'Mar', product1: 102000, product2: 97000, product3: 93000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 30000, product2: 28000, product3: 25000, clientId: 1 },
          { month: 'Feb', product1: 25000, product2: 23000, product3: 22000, clientId: 1 },
          { month: 'Mar', product1: 20000, product2: 18000, product3: 17000, clientId: 1 },
          { month: 'Jan', product1: 32000, product2: 29000, product3: 26000, clientId: 2 },
          { month: 'Feb', product1: 26000, product2: 24000, product3: 21000, clientId: 2 },
          { month: 'Mar', product1: 19000, product2: 17000, product3: 16000, clientId: 2 },
        ],
      },
    },
    Top2: {
      YoY: {
        Profit: [
          { year: 2021, product1: 600000, product2: 550000, product3: 450000, clientId: 1 },
          { year: 2022, product1: 700000, product2: 650000, product3: 550000, clientId: 1 },
          { year: 2023, product1: 780000, product2: 720000, product3: 650000, clientId: 1 },
          { year: 2021, product1: 620000, product2: 530000, product3: 440000, clientId: 2 },
          { year: 2022, product1: 710000, product2: 640000, product3: 560000, clientId: 2 },
          { year: 2023, product1: 800000, product2: 740000, product3: 660000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 180000, product2: 160000, product3: 140000, clientId: 1 },
          { year: 2022, product1: 140000, product2: 120000, product3: 110000, clientId: 1 },
          { year: 2023, product1: 100000, product2: 90000, product3: 85000, clientId: 1 },
          { year: 2021, product1: 190000, product2: 150000, product3: 130000, clientId: 2 },
          { year: 2022, product1: 150000, product2: 125000, product3: 105000, clientId: 2 },
          { year: 2023, product1: 95000, product2: 88000, product3: 82000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 80000, product2: 75000, product3: 70000, clientId: 1 },
          { month: 'Feb', product1: 85000, product2: 80000, product3: 76000, clientId: 1 },
          { month: 'Mar', product1: 90000, product2: 85000, product3: 82000, clientId: 1 },
          { month: 'Jan', product1: 78000, product2: 74000, product3: 69000, clientId: 2 },
          { month: 'Feb', product1: 83000, product2: 79000, product3: 75000, clientId: 2 },
          { month: 'Mar', product1: 91000, product2: 86000, product3: 83000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 25000, product2: 23000, product3: 21000, clientId: 1 },
          { month: 'Feb', product1: 22000, product2: 20000, product3: 18000, clientId: 1 },
          { month: 'Mar', product1: 20000, product2: 17000, product3: 16000, clientId: 1 },
          { month: 'Jan', product1: 26000, product2: 24000, product3: 22000, clientId: 2 },
          { month: 'Feb', product1: 21000, product2: 19000, product3: 17000, clientId: 2 },
          { month: 'Mar', product1: 19000, product2: 16000, product3: 15000, clientId: 2 },
        ],
      },
    },
    Top3: {
      YoY: {
        Profit: [
          { year: 2021, product1: 500000, product2: 450000, product3: 400000, clientId: 1 },
          { year: 2022, product1: 580000, product2: 520000, product3: 470000, clientId: 1 },
          { year: 2023, product1: 650000, product2: 600000, product3: 550000, clientId: 1 },
          { year: 2021, product1: 520000, product2: 460000, product3: 380000, clientId: 2 },
          { year: 2022, product1: 600000, product2: 540000, product3: 490000, clientId: 2 },
          { year: 2023, product1: 670000, product2: 610000, product3: 560000, clientId: 2 },
        ],
        Loss: [
          { year: 2021, product1: 150000, product2: 140000, product3: 130000, clientId: 1 },
          { year: 2022, product1: 120000, product2: 110000, product3: 100000, clientId: 1 },
          { year: 2023, product1: 90000, product2: 85000, product3: 80000, clientId: 1 },
          { year: 2021, product1: 160000, product2: 145000, product3: 125000, clientId: 2 },
          { year: 2022, product1: 125000, product2: 115000, product3: 95000, clientId: 2 },
          { year: 2023, product1: 88000, product2: 82000, product3: 78000, clientId: 2 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 70000, product2: 66000, product3: 62000, clientId: 1 },
          { month: 'Feb', product1: 74000, product2: 70000, product3: 66000, clientId: 1 },
          { month: 'Mar', product1: 78000, product2: 74000, product3: 70000, clientId: 1 },
          { month: 'Jan', product1: 68000, product2: 64000, product3: 60000, clientId: 2 },
          { month: 'Feb', product1: 72000, product2: 69000, product3: 65000, clientId: 2 },
          { month: 'Mar', product1: 79000, product2: 75000, product3: 71000, clientId: 2 },
        ],
        Loss: [
          { month: 'Jan', product1: 22000, product2: 21000, product3: 20000, clientId: 1 },
          { month: 'Feb', product1: 20000, product2: 19000, product3: 18000, clientId: 1 },
          { month: 'Mar', product1: 18000, product2: 16000, product3: 15000, clientId: 1 },
          { month: 'Jan', product1: 23000, product2: 21500, product3: 20500, clientId: 2 },
          { month: 'Feb', product1: 19000, product2: 18000, product3: 17000, clientId: 2 },
          { month: 'Mar', product1: 17000, product2: 15500, product3: 14500, clientId: 2 },
        ],
      },
    },
  },
  engagementDetails: {
    engagement: [
      { clientId: 1, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
      { clientId: 2, label: 'Upcoming Meeting Review', date: '01 Jan 2026', status: 'none' },
      { clientId: 1, label: 'Last Maturity Date', date: '22 Sep 2030', status: 'green' },
      { clientId: 1, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
      { clientId: 2, label: 'Upcoming Quarterly Review', date: '01 Feb 2026', status: 'orange' },
      { clientId: 1, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
      { clientId: 2, label: 'Upcoming Annual Review', date: '01 Mar 2026', status: 'green' },
    ],
    accounts: [
      {
        clientId: 1,
        no: '1234567890',
        openingDate: '21/01/2025',
        riskRating: '6.2/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 1',
        balance: '$65,000',
        interestRate: '2.5%',
      },
      {
        clientId: 1,
        no: '9876543210',
        openingDate: '22/10/2024',
        riskRating: '8.1/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 3',
        balance: '$81,000',
        interestRate: '3.1%',
      },
      {
        clientId: 1,
        no: '5647382910',
        openingDate: '14/08/2024',
        riskRating: '7.3/10',
        closingDate: '-',
        status: 'Active',
        type: 'Type 4',
        balance: '$95,500',
        interestRate: '2.9%',
      },
      {
        clientId: 1,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
      {
        clientId: 2,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
      {
        clientId: 2,
        no: '1122334455',
        openingDate: '02/05/2023',
        riskRating: '8.5/10',
        closingDate: '12/08/2025',
        status: 'Inactive',
        type: 'Type 2',
        balance: '$1,000',
        interestRate: '1.2%',
      },
    ],
    teams: [
      { clientId: 1, team: 'Name of the Team A', contactName: 'Contact Name A', email: 'a@example.com' },
      { clientId: 2, team: 'Name of the Team d', contactName: 'Contact Name d', email: 'd@example.com' },
      { clientId: 1, team: 'Name of the Team B', contactName: 'Contact Name B', email: 'b@example.com' },
      { clientId: 1, team: 'Name of the Team C', contactName: 'Contact Name C', email: 'c@example.com' },
      { clientId: 2, team: 'Name of the Team d', contactName: 'Contact Name d', email: 'd@example.com' },
    ],
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.homeScreenData = null;
      state.homeSummary = null;
      state.insightDetails = null;
      state.insightsScreenData = null;
      state.reportsData = null;
      state.loading = {
        home: true,
        insights: true,
      };
      state.dashboardCount = {
        insight: 0,
        reports: 0,
        artifacts: 0,
      };
      state.lastRefreshed = {
        home: null,
        insight: null,
      };
      state.error = null;
      state.queryResults = {};
      state.queryExecutionStates = {
        batchExecuting: false,
        totalQueries: 0,
        completedQueries: 0,
        failedQueries: 0,
      };
      state.dashboardReadiness = {
        home: false,
        insights: false,
      };
    },

    setChartFilters: (state, action) => {
      const { visualId, filters } = action.payload;
      if (visualId) {
        state.chartFilters[visualId] = filters;
      }
    },

    setLastRefreshed: (state, action) => {
      const { page, timestamp } = action.payload;
      state.lastRefreshed[page] = timestamp;
    },

    setHomeScreenData: (state, action) => {
      state.homeScreenData = action.payload;
      state.loading.home = false;
      state.error = null;
      if (state.homeSummary !== null) {
        state.dashboardReadiness.home = true;
      }
    },

    setInsightsScreenData: (state, action) => {
      let sortedData = action.payload;
      let isClientId4 = false;

      if (Array.isArray(action.payload)) {
        // This part remains the same...
        // But extract clientId metadata if provided
        if (action.meta && action.meta.clientId === 4) {
          isClientId4 = true;
        }
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        // Handle if payload includes metadata
        if (action.payload.clientId === 4) {
          isClientId4 = true;
          sortedData = action.payload.data;
        }
      }

      state.insightsScreenData = sortedData;
      state.dashboardCount.insight = sortedData?.length || 0;
      state.loading.insights = false;
      state.error = null;

      // Modified logic to account for clientId 4
      if (isClientId4 || state.insightDetails !== null) {
        state.dashboardReadiness.insights = true;
      }
    },

    setInsightDetails: (state, action) => {
      state.insightDetails = action.payload;
      state.error = null;
      // Check insights dashboard readiness
      if (state.insightsScreenData !== null) {
        state.dashboardReadiness.insights = true;
      }
    },

    setReportsData: (state, action) => {
      state.reportsData = action.payload;
      state.error = null;
    },

    setReportsCount: (state, action) => {
      state.dashboardCount = {
        ...state.dashboardCount,
        reports: action.payload,
      };
    },

    setArtifactsCount: (state, action) => {
      state.dashboardCount.artifacts = action.payload;
    },

    // Updated to support specific loading state changes
    setLoading: (state, action) => {
      if (typeof action.payload === 'boolean') {
        // For backward compatibility, set both loading states
        state.loading.home = action.payload;
        state.loading.insights = action.payload;
      } else if (typeof action.payload === 'object') {
        // Set specific loading state(s)
        if (action.payload.home !== undefined) {
          state.loading.home = action.payload.home;
        }
        if (action.payload.insights !== undefined) {
          state.loading.insights = action.payload.insights;
        }
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      // Error applies to both dashboards, but keep individual loading states
    },

    setHomeSummary: (state, action) => {
      state.homeSummary = action.payload;
      state.loading.home = false;
      state.error = null;
      // Check home dashboard readiness
      if (state.homeScreenData !== null) {
        state.dashboardReadiness.home = true;
      }
    },

    resetDashboard: () => initialState,

    // Query execution state management reducers
    setQueryExecutionBatch: (state, action) => {
      const { totalQueries } = action.payload;
      state.queryExecutionStates = {
        batchExecuting: true,
        totalQueries,
        completedQueries: 0,
        failedQueries: 0,
      };
    },

    setInsightQueryLoading: (state, action) => {
      const { insightId } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with loading state
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_loading: true,
            query_error: null,
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility
      if (!state.queryResults[insightId]) {
        state.queryResults[insightId] = {
          data: null,
          loading: true,
          error: null,
          executionTime: null,
        };
      } else {
        state.queryResults[insightId].loading = true;
        state.queryResults[insightId].error = null;
      }
    },

    setInsightQueryResult: (state, action) => {
      const { insightId, data, executionTime } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData instead of separate queryResults
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with query results
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_result: data || [],
            query_execution_time: executionTime || null,
            query_loading: false,
            query_error: null,
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility (can be removed later)
      state.queryResults[insightId] = {
        data: data || [],
        loading: false,
        error: null,
        executionTime: executionTime || null,
      };

      // Update batch execution progress
      if (state.queryExecutionStates.batchExecuting) {
        state.queryExecutionStates.completedQueries += 1;

        // Check if batch execution is complete
        const totalProcessed = state.queryExecutionStates.completedQueries + state.queryExecutionStates.failedQueries;
        if (totalProcessed >= state.queryExecutionStates.totalQueries) {
          state.queryExecutionStates.batchExecuting = false;
        }
      }
    },

    setInsightQueryError: (state, action) => {
      const { insightId, error } = action.payload;

      // FIXED: Update the insight directly in insightsScreenData
      if (state.insightsScreenData) {
        const insightIndex = state.insightsScreenData.findIndex((insight) => insight.insight_id == insightId);

        if (insightIndex !== -1) {
          // Update the insight object directly with error
          state.insightsScreenData[insightIndex] = {
            ...state.insightsScreenData[insightIndex],
            query_result: [],
            query_execution_time: null,
            query_loading: false,
            query_error: error || 'Unknown error occurred',
          };
        }
      }

      // OPTIONAL: Keep the old queryResults for backward compatibility
      state.queryResults[insightId] = {
        data: null,
        loading: false,
        error: error || 'Unknown error occurred',
        executionTime: null,
      };

      if (state.queryExecutionStates.batchExecuting) {
        state.queryExecutionStates.failedQueries += 1;

        // Check if all queries are complete
        const totalProcessed = state.queryExecutionStates.completedQueries + state.queryExecutionStates.failedQueries;
        if (totalProcessed >= state.queryExecutionStates.totalQueries) {
          state.queryExecutionStates.batchExecuting = false;
        }
      }
    },

    updateBatchQueryResults: (state, action) => {
      const { results } = action.payload;

      if (Array.isArray(results)) {
        results.forEach((result) => {
          const { insight_id, success, data, execution_time, error } = result;

          if (success) {
            state.queryResults[insight_id] = {
              data: data || [],
              loading: false,
              error: null,
              executionTime: execution_time || null,
            };
            state.queryExecutionStates.completedQueries += 1;
          } else {
            state.queryResults[insight_id] = {
              data: null,
              loading: false,
              error: error || 'Query execution failed',
              executionTime: null,
            };
            state.queryExecutionStates.failedQueries += 1;
          }
        });
      }

      // Mark batch execution as complete
      state.queryExecutionStates.batchExecuting = false;
    },

    clearQueryResults: (state, action) => {
      if (action.payload) {
        // Clear specific insight query result
        const { insightId } = action.payload;
        delete state.queryResults[insightId];
      } else {
        // Clear all query results
        state.queryResults = {};
      }
    },

    resetQueryExecutionState: (state) => {
      state.queryExecutionStates = {
        batchExecuting: false,
        totalQueries: 0,
        completedQueries: 0,
        failedQueries: 0,
      };
    },

    setDashboardReadiness: (state, action) => {
      const { dashboard, ready } = action.payload;
      state.dashboardReadiness[dashboard] = ready;
    },

    resetDashboardReadiness: (state) => {
      state.dashboardReadiness = {
        home: false,
        insights: false,
      };
    },

    updateInsightQueryResult: (state, action) => {
      const { insightId, queryResult } = action.payload;

      // Find insight in insightsScreenData and update its query result
      if (state.insightsScreenData) {
        state.insightsScreenData = state.insightsScreenData.map((insight) => {
          if (insight.insight_id === insightId) {
            return {
              ...insight,
              query_result: queryResult.data,
              query_execution_time: queryResult.executionTime,
              query_loading: false,
              query_error: null,
            };
          }
          return insight;
        });
      }
    },

    updateInsightQueryError: (state, action) => {
      const { insightId, error } = action.payload;

      // Find insight and store error
      if (state.insightsScreenData) {
        state.insightsScreenData = state.insightsScreenData.map((insight) => {
          if (insight.insight_id === insightId) {
            return {
              ...insight,
              query_result: null,
              query_loading: false,
              query_error: error,
            };
          }
          return insight;
        });
      }
    },
    setKpiDashboardData: (state, action) => {
      state.KpiDashboardData = action.payload;
    },
    setDepositLoanDetails: (state, action) => {
      state.depositLoanDetails = action.payload;
    },
    setLoanOutstandingDetails: (state, action) => {
      state.loanOutstandingDetails = action.payload;
    },
    setRevenueGraphDetails: (state, action) => {
      state.revenueGraphDetails = action.payload;
    },
    setTotalProfitandLossRelationship: (state, action) => {
      state.TotalProfitandLossRelationship = action.payload;
    },
    setEngagementDetails: (state, action) => {
      state.engagementDetails = action.payload;
    },
  },
});

// Export actions
export const {
  setArtifactsCount,
  setChartFilters,
  clearDashboardData,
  setLastRefreshed,
  setHomeScreenData,
  setInsightsScreenData,
  setInsightDetails,
  setReportsData,
  setReportsCount,
  setLoading,
  setError,
  setHomeSummary,
  resetDashboard,
  // Query execution actions
  setQueryExecutionBatch,
  setInsightQueryLoading,
  setInsightQueryResult,
  setInsightQueryError,
  updateBatchQueryResults,
  clearQueryResults,
  resetQueryExecutionState,
  // Dashboard readiness actions
  setDashboardReadiness,
  resetDashboardReadiness,
  setKpiDashboardData,
  setDepositLoanDetails,
  setLoanOutstandingDetails,
  setRevenueGraphDetails,
  setTotalProfitandLossRelationship,
  setAccountDetails,
  setEngagementDetails,
  setTeamDetails,
} = dashboardSlice.actions;

// Selectors
export const selectHomeScreenData = (state) => state.dashboard?.homeScreenData;
export const selectInsightsScreenData = (state) => state.dashboard?.insightsScreenData;
export const selectReportsData = (state) => state.dashboard?.reportsData;
export const selectChartFilters = (state) => state.dashboard.chartFilters;

// Updated selectors for separate loading states
export const selectDashboardLoading = (state) => state.dashboard?.loading ?? { home: true, insights: true };
export const selectHomeDashboardLoading = (state) => state.dashboard?.loading?.home ?? true;
export const selectInsightsDashboardLoading = (state) => state.dashboard?.loading?.insights ?? true;

export const selectDashboardError = (state) => state.dashboard?.error;
export const selectHomeSummary = (state) => state.dashboard?.homeSummary;
export const selectDashboardCount = (state) =>
  state.dashboard?.dashboardCount || { insight: 0, reports: 0, artifacts: 0 };
export const selectInsightDetails = (state) => state.dashboard?.insightDetails;
export const selectLastRefreshed = (state) => state.dashboard?.lastRefreshed || { home: null, insight: null };

// Query execution selectors
export const selectQueryResults = (state) => state.dashboard?.queryResults || {};
export const selectInsightQueryResult = (state, insightId) => {
  return (
    state.dashboard?.queryResults?.[insightId] || {
      data: null,
      loading: false,
      error: null,
      executionTime: null,
    }
  );
};

export const selectQueryExecutionStates = (state) =>
  state.dashboard?.queryExecutionStates || {
    batchExecuting: false,
    totalQueries: 0,
    completedQueries: 0,
    failedQueries: 0,
  };

// Dashboard readiness selectors
export const selectDashboardReadiness = (state) =>
  state.dashboard?.dashboardReadiness || {
    home: false,
    insights: false,
  };
export const selectHomeDashboardReady = (state) => state.dashboard?.dashboardReadiness?.home || false;
export const selectInsightsDashboardReady = (state) => state.dashboard?.dashboardReadiness?.insights || false;

// Computed selectors
export const selectQueryExecutionProgress = (state) => {
  const states = selectQueryExecutionStates(state);
  if (states.totalQueries === 0) return { percentage: 0, completed: 0, total: 0 };

  const completed = states.completedQueries + states.failedQueries;
  const percentage = Math.round((completed / states.totalQueries) * 100);

  return {
    percentage,
    completed,
    total: states.totalQueries,
    isExecuting: states.batchExecuting,
  };
};

export const selectInsightsWithQueryData = (state) => {
  const insights = selectInsightsScreenData(state);
  const queryResults = selectQueryResults(state);

  if (!insights || !Array.isArray(insights)) return [];

  return insights.map((insight) => ({
    ...insight,
    queryResult: queryResults[insight.insight_id] || {
      data: null,
      loading: false,
      error: null,
      executionTime: null,
    },
  }));
};

export const selectKpiDashboardData = (state) => {
  return state.dashboard?.KpiDashboardData || { kpis: [], score: [] };
};

export const selectDepositLoanDetails = (state) => {
  return state.dashboard?.depositLoanDetails || {};
};

export const selectLoanOutstandingDetails = (state) => {
  return state.dashboard?.loanOutstandingDetails || {};
};

export const selectRevenueGraphDetails = (state) => {
  return state.dashboard?.revenueGraphDetails || {};
};

export const selectTotalProfitandLossRelationship = (state) => {
  return state.dashboard?.TotalProfitandLossRelationship || {};
};

export const selectEngagementDetails = (state) => {
  return state.dashboard?.engagementDetails || [];
};

export default dashboardSlice.reducer;

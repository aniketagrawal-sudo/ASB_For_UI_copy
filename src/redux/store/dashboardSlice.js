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
  KpiDashboardData: [],
  depositLoanDetails: {
    MoM: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [0.65, 0.6, 0.62, 0.7, 0.78, 0.88, 0.98, 1.02, 1.05, 1.1, 0.9, 0.6],
    },
    YoY: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [3.0, 6.0, 13.8, 10.5, 4.8] },
    QoQ: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [0.7, 0.9, 1.0, 0.6] },
  },
  loanOutstandingDetails: {
    MoM: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [0.45, 0.55, 0.8, 0.8, 0.6, 0.5, 0.7, 0.9, 0.75, 1.0, 0.85, 0.65],
    },
    YoY: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [2.2, 3.1, 4.0, 3.4, 2.8] },
    QoQ: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [0.5, 0.9, 1.1, 0.7] },
  },
  revenueGraphDetails: {
    'Account Number 1': {
      YoY: [
        { month: 'Jan', net: 700000, gross: 600000 },
        { month: 'Feb', net: 400000, gross: 300000 },
        { month: 'Mar', net: 200000, gross: 150000 },
        { month: 'Apr', net: 400000, gross: 300000 },
        { month: 'May', net: 600000, gross: 500000 },
        { month: 'Jun', net: 800000, gross: 700000 },
        { month: 'Jul', net: 800000, gross: 600000 },
        { month: 'Aug', net: 400000, gross: 300000 },
        { month: 'Sep', net: 200000, gross: 150000 },
        { month: 'Oct', net: 400000, gross: 300000 },
        { month: 'Nov', net: 500000, gross: 400000 },
        { month: 'Dec', net: 700000, gross: 600000 },
      ],
      MoM: [
        { month: 'Jan', net: 350000, gross: 300000 },
        { month: 'Feb', net: 420000, gross: 380000 },
        { month: 'Mar', net: 460000, gross: 410000 },
        { month: 'Apr', net: 480000, gross: 430000 },
        { month: 'May', net: 520000, gross: 470000 },
        { month: 'Jun', net: 550000, gross: 500000 },
        { month: 'Jul', net: 530000, gross: 480000 },
        { month: 'Aug', net: 510000, gross: 470000 },
        { month: 'Sep', net: 560000, gross: 510000 },
        { month: 'Oct', net: 600000, gross: 550000 },
        { month: 'Nov', net: 580000, gross: 530000 },
        { month: 'Dec', net: 620000, gross: 560000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1200000, gross: 900000 },
        { month: 'Q2', net: 1400000, gross: 1100000 },
        { month: 'Q3', net: 1600000, gross: 1300000 },
        { month: 'Q4', net: 1800000, gross: 1500000 },
      ],
    },
    'Account Number 2': {
      YoY: [
        { month: 'Jan', net: 400000, gross: 350000 },
        { month: 'Feb', net: 450000, gross: 400000 },
        { month: 'Mar', net: 500000, gross: 450000 },
        { month: 'Apr', net: 550000, gross: 480000 },
        { month: 'May', net: 600000, gross: 530000 },
        { month: 'Jun', net: 620000, gross: 540000 },
        { month: 'Jul', net: 640000, gross: 560000 },
        { month: 'Aug', net: 660000, gross: 590000 },
        { month: 'Sep', net: 680000, gross: 610000 },
        { month: 'Oct', net: 700000, gross: 640000 },
        { month: 'Nov', net: 720000, gross: 650000 },
        { month: 'Dec', net: 740000, gross: 670000 },
      ],
      MoM: [
        { month: 'Jan', net: 300000, gross: 250000 },
        { month: 'Feb', net: 340000, gross: 290000 },
        { month: 'Mar', net: 360000, gross: 310000 },
        { month: 'Apr', net: 390000, gross: 340000 },
        { month: 'May', net: 420000, gross: 370000 },
        { month: 'Jun', net: 440000, gross: 400000 },
        { month: 'Jul', net: 470000, gross: 420000 },
        { month: 'Aug', net: 490000, gross: 440000 },
        { month: 'Sep', net: 510000, gross: 460000 },
        { month: 'Oct', net: 530000, gross: 480000 },
        { month: 'Nov', net: 550000, gross: 500000 },
        { month: 'Dec', net: 570000, gross: 520000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1000000, gross: 800000 },
        { month: 'Q2', net: 1200000, gross: 1000000 },
        { month: 'Q3', net: 1400000, gross: 1200000 },
        { month: 'Q4', net: 1600000, gross: 1300000 },
      ],
    },
    'Account Number 3': {
      YoY: [
        { month: 'Jan', net: 500000, gross: 400000 },
        { month: 'Feb', net: 550000, gross: 450000 },
        { month: 'Mar', net: 600000, gross: 500000 },
        { month: 'Apr', net: 650000, gross: 550000 },
        { month: 'May', net: 700000, gross: 600000 },
        { month: 'Jun', net: 750000, gross: 650000 },
        { month: 'Jul', net: 800000, gross: 700000 },
        { month: 'Aug', net: 850000, gross: 750000 },
        { month: 'Sep', net: 900000, gross: 800000 },
        { month: 'Oct', net: 950000, gross: 850000 },
        { month: 'Nov', net: 1000000, gross: 900000 },
        { month: 'Dec', net: 1050000, gross: 950000 },
      ],
      MoM: [
        { month: 'Jan', net: 400000, gross: 350000 },
        { month: 'Feb', net: 420000, gross: 370000 },
        { month: 'Mar', net: 440000, gross: 390000 },
        { month: 'Apr', net: 460000, gross: 410000 },
        { month: 'May', net: 480000, gross: 430000 },
        { month: 'Jun', net: 500000, gross: 450000 },
        { month: 'Jul', net: 520000, gross: 470000 },
        { month: 'Aug', net: 540000, gross: 490000 },
        { month: 'Sep', net: 560000, gross: 510000 },
        { month: 'Oct', net: 580000, gross: 530000 },
        { month: 'Nov', net: 600000, gross: 550000 },
        { month: 'Dec', net: 620000, gross: 570000 },
      ],
      QoQ: [
        { month: 'Q1', net: 1300000, gross: 1000000 },
        { month: 'Q2', net: 1500000, gross: 1200000 },
        { month: 'Q3', net: 1700000, gross: 1400000 },
        { month: 'Q4', net: 1900000, gross: 1600000 },
      ],
    },
  },
  TotalProfitandLossRelationship: {
    'Top 1': {
      YoY: {
        Profit: [
          { year: 2021, product1: 700000, product2: 600000, product3: 500000 },
          { year: 2022, product1: 750000, product2: 630000, product3: 520000 },
          { year: 2023, product1: 720000, product2: 610000, product3: 540000 },
          { year: 2024, product1: 760000, product2: 640000, product3: 550000 },
          { year: 2025, product1: 780000, product2: 660000, product3: 580000 },
        ],
        Loss: [
          { year: 2021, product1: 300000, product2: 250000, product3: 200000 },
          { year: 2022, product1: 280000, product2: 260000, product3: 210000 },
          { year: 2023, product1: 290000, product2: 270000, product3: 230000 },
          { year: 2024, product1: 310000, product2: 280000, product3: 250000 },
          { year: 2025, product1: 320000, product2: 300000, product3: 270000 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 400000, product2: 380000, product3: 350000 },
          { month: 'Feb', product1: 420000, product2: 390000, product3: 370000 },
          { month: 'Mar', product1: 440000, product2: 410000, product3: 390000 },
          { month: 'Apr', product1: 460000, product2: 430000, product3: 410000 },
          { month: 'May', product1: 480000, product2: 450000, product3: 430000 },
          { month: 'Jun', product1: 500000, product2: 470000, product3: 450000 },
        ],
        Loss: [
          { month: 'Jan', product1: 150000, product2: 130000, product3: 120000 },
          { month: 'Feb', product1: 140000, product2: 125000, product3: 115000 },
          { month: 'Mar', product1: 130000, product2: 120000, product3: 110000 },
          { month: 'Apr', product1: 125000, product2: 115000, product3: 105000 },
          { month: 'May', product1: 120000, product2: 110000, product3: 100000 },
          { month: 'Jun', product1: 115000, product2: 105000, product3: 95000 },
        ],
      },
    },
    'Top 2': {
      YoY: {
        Profit: [
          { year: 2021, product1: 650000, product2: 550000, product3: 500000 },
          { year: 2022, product1: 690000, product2: 580000, product3: 520000 },
          { year: 2023, product1: 720000, product2: 600000, product3: 540000 },
          { year: 2024, product1: 760000, product2: 640000, product3: 560000 },
          { year: 2025, product1: 800000, product2: 670000, product3: 580000 },
        ],
        Loss: [
          { year: 2021, product1: 280000, product2: 240000, product3: 200000 },
          { year: 2022, product1: 290000, product2: 250000, product3: 210000 },
          { year: 2023, product1: 300000, product2: 260000, product3: 220000 },
          { year: 2024, product1: 320000, product2: 280000, product3: 240000 },
          { year: 2025, product1: 340000, product2: 300000, product3: 260000 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 380000, product2: 360000, product3: 340000 },
          { month: 'Feb', product1: 400000, product2: 370000, product3: 350000 },
          { month: 'Mar', product1: 420000, product2: 390000, product3: 370000 },
          { month: 'Apr', product1: 440000, product2: 410000, product3: 390000 },
          { month: 'May', product1: 460000, product2: 430000, product3: 410000 },
          { month: 'Jun', product1: 480000, product2: 450000, product3: 430000 },
        ],
        Loss: [
          { month: 'Jan', product1: 140000, product2: 120000, product3: 110000 },
          { month: 'Feb', product1: 130000, product2: 115000, product3: 105000 },
          { month: 'Mar', product1: 125000, product2: 110000, product3: 100000 },
          { month: 'Apr', product1: 120000, product2: 105000, product3: 95000 },
          { month: 'May', product1: 115000, product2: 100000, product3: 90000 },
          { month: 'Jun', product1: 110000, product2: 95000, product3: 85000 },
        ],
      },
    },
    'Top 3': {
      YoY: {
        Profit: [
          { year: 2021, product1: 600000, product2: 520000, product3: 470000 },
          { year: 2022, product1: 640000, product2: 550000, product3: 490000 },
          { year: 2023, product1: 680000, product2: 580000, product3: 510000 },
          { year: 2024, product1: 720000, product2: 610000, product3: 540000 },
          { year: 2025, product1: 760000, product2: 640000, product3: 560000 },
        ],
        Loss: [
          { year: 2021, product1: 260000, product2: 220000, product3: 200000 },
          { year: 2022, product1: 270000, product2: 230000, product3: 210000 },
          { year: 2023, product1: 290000, product2: 250000, product3: 220000 },
          { year: 2024, product1: 310000, product2: 270000, product3: 230000 },
          { year: 2025, product1: 320000, product2: 280000, product3: 240000 },
        ],
      },
      MoM: {
        Profit: [
          { month: 'Jan', product1: 360000, product2: 330000, product3: 310000 },
          { month: 'Feb', product1: 380000, product2: 350000, product3: 330000 },
          { month: 'Mar', product1: 400000, product2: 370000, product3: 350000 },
          { month: 'Apr', product1: 420000, product2: 390000, product3: 370000 },
          { month: 'May', product1: 440000, product2: 410000, product3: 390000 },
          { month: 'Jun', product1: 460000, product2: 430000, product3: 410000 },
        ],
        Loss: [
          { month: 'Jan', product1: 130000, product2: 110000, product3: 100000 },
          { month: 'Feb', product1: 125000, product2: 105000, product3: 95000 },
          { month: 'Mar', product1: 120000, product2: 100000, product3: 90000 },
          { month: 'Apr', product1: 115000, product2: 95000, product3: 85000 },
          { month: 'May', product1: 110000, product2: 90000, product3: 80000 },
          { month: 'Jun', product1: 105000, product2: 85000, product3: 75000 },
        ],
      },
    },
  },
  accountDetails: [
    {
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
  engagementDetails: [
        { label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
        { label: 'Last Maturity Date', date: '22 Sep 2030', status: 'green' },
        { label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
        { label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
    ],
    teamDetails: [
        { team: 'Name of the Team A', contactName: 'Contact Name A', email: 'a@example.com' },
        { team: 'Name of the Team B', contactName: 'Contact Name B', email: 'b@example.com' },
        { team: 'Name of the Team C', contactName: 'Contact Name C', email: 'c@example.com' },
    ],
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
    setAccountDetails: (state, action) => {
      state.accountDetails = action.payload;
    },
    setEngagementDetails: (state, action) => {
      state.engagementDetails = action.payload;
    },
     setTeamDetails: (state, action) => {
      state.teamDetails = action.payload;
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
  return state.dashboard?.KpiDashboardData || [];
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

export const selectAccountDetails = (state) => {
  return state.dashboard?.accountDetails || [];
};

export const selectEngagementDetails = (state) => {
  return state.dashboard?.engagementDetails || [];
};

export const selectTeamDetails = (state) => {
  return state.dashboard?.teamDetails || [];
};

export default dashboardSlice.reducer;

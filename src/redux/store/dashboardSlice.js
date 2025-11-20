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
  depositLoanDetails: {},
  loanOutstandingDetails: {},
  revenueGraphDetails: {},
  TotalProfitandLossRelationship: {},
  accountDetails: [],
  engagementDetails: [],
  teamDetails: [],
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

import { api } from './api';
import {
  setLoading,
  setHomeScreenData,
  setHomeSummary,
  setInsightsScreenData,
  setInsightDetails,
  setError,
  setLastRefreshed,
  setDashboardReadiness,
  setQueryExecutionBatch,
  setInsightQueryLoading,
  setInsightQueryResult,
  setInsightQueryError,
  updateBatchQueryResults,
  setKpiDashboardData,
  setDepositLoanDetails,
  setLoanOutstandingDetails
} from '../redux/store/dashboardSlice';




export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({

      downloadDashboardAsPpt: builder.mutation({
        query: (payload) => ({
          url: '/api/dashboard/dashboards_to_ppt',
          method: 'POST',
          body: payload,
          responseHandler: async (response) => {
            console.log("📥 Raw fetch Response:", response);   // <--- Response object
            const blob = await response.blob();
            console.log("📦 Blob from responseHandler:", blob); // <--- Blob (before transform)
            return blob;
          },
        }),
        transformResponse: async (response) => {
          // Case 1: Response is JSON (error/info)
          console.log("🔍 Blob received in transformResponse:", response);
          console.log("🔍 Blob type:", response.type, "size:", response.size);
          if (response.type === "application/json") {
            const text = await response.text();
            try {
              return JSON.parse(text); // safe serializable object
            } catch {
              return { status: "error", message: "Invalid JSON response" };
            }
          }
      
          // Case 2: Response is a PPTX file
          if (response.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            const url = URL.createObjectURL(response);
            console.log("✅ Generated ObjectURL for PPTX:", url);
            const a = document.createElement("a");
            a.href = url;
            a.download = "dashboard.pptx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            return { status: "success", blob_link: url }; // serializable link
          }
      
          // Unknown response
          return { status: "error", message: "Unexpected response format" };
      
      },
    }),

    downloadInsightsAsPpt: builder.mutation({
      query: (payload) => ({
        url: '/api/dashboard/insights_to_ppt',
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.json(), 
      }),
      transformResponse: (response) => {
        console.log("✅ JSON response from backend (insights):", response);
    
        if (response?.status === "success" && response?.blob_link) {
          // Auto-trigger download
          const a = document.createElement("a");
          a.href = response.blob_link;
          a.download = "insight.pptx";
          document.body.appendChild(a);
          a.click();
          a.remove();
    
          return { status: "success", blob_link: response.blob_link };
        }
    
        return { status: "error", message: "Unexpected response", raw: response };
      },
    }),
    

    getInsightDetails: builder.query({
      query: (personaId) => ({
        url: `/api/dashboard/insight-details?personaId=${personaId}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.data || null,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setInsightDetails(data));
          // Check if insights dashboard is ready (when both insights screen data and details are loaded)
          dispatch(setDashboardReadiness({ dashboard: 'insights', ready: true }));
        } catch (err) {
          dispatch(setError(err.message || 'Failed to fetch insight details'));
        }
      },
    }),

    // OPTIMIZED: Home screen data with immediate dashboard readiness check
    getHomeScreenData: builder.query({
      query: ({ personaId, userId, clientId }) => ({
        url: `/api/dashboard/homeDashboard?personaId=${personaId}&userId=${userId || ''}&clientId=${clientId || ''}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (!response?.data) {
          return null;
        }
        return response.data;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        dispatch(setLoading({ home: true }));
        try {
          const { data } = await queryFulfilled;
          dispatch(setHomeScreenData(data));
          dispatch(
            setLastRefreshed({
              page: 'home',
              timestamp: new Date().toISOString(),
            }),
          );

          // Check if home dashboard is ready (when both home screen data and summary are loaded)
          const state = getState();
          if (state.dashboard?.homeSummary !== null) {
            dispatch(setDashboardReadiness({ dashboard: 'home', ready: true }));
          }
        } catch (err) {
          dispatch(setError(err.message || 'Failed to fetch home screen data'));
        }
      },
    }),

    // OPTIMIZED: Home summary with immediate dashboard readiness check
    getHomeSummary: builder.query({
      query: (personaId) => ({
        url: `/api/dashboard/homeSummary?personaId=${personaId}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (!response?.data) {
          return null;
        }
        return response.data;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        dispatch(setLoading({ home: true }));
        try {
          const { data } = await queryFulfilled;
          dispatch(setHomeSummary(data));
          dispatch(
            setLastRefreshed({
              page: 'home',
              timestamp: new Date().toISOString(),
            }),
          );

          // Check if home dashboard is ready (when both home screen data and summary are loaded)
          const state = getState();
          if (state.dashboard?.homeScreenData !== null) {
            dispatch(setDashboardReadiness({ dashboard: 'home', ready: true }));
          }
        } catch (err) {
          dispatch(setError(err.message || 'Failed to fetch home summary'));
        }
      },
    }),

    resetVisual: builder.mutation({
      query: ({ personaId, userId }) => ({
        url: `/api/dashboard/resetVisual?personaId=${personaId}&userId=${userId}`,
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch }) {
        const currentTime = new Date().toISOString();
        dispatch(setLoading({ home: true, insights: true }));
        // Update both timestamps at once
        dispatch(setLastRefreshed({ page: 'home', timestamp: currentTime }));
        dispatch(setLastRefreshed({ page: 'insight', timestamp: currentTime }));
      },
    }),

    getNextUnrefreshedVisual: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/get-next-unrefreshed-visual',
        method: 'POST',
        body: data,
      }),
    }),

    updateVisual: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update-visual',
        method: 'POST',
        body: data,
      }),
    }),

    getInsightsScreenData: builder.query({
      query: (personaId) => ({
        url: `/api/dashboard/insightsDashboard?personaId=${personaId}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.data || null,
      async onQueryStarted(personaId, { dispatch, queryFulfilled, getState }) {
        dispatch(setLoading({ insights: true }));
        try {
          const { data } = await queryFulfilled;
          const state = getState();
          // Extract clientId from auth state
          const selectedIndustry = state.auth?.user?.selectedIndustry;
          const industries = state.auth?.user?.industries || [];
          const industry = industries.find((ind) => ind.name === selectedIndustry);
          const clientId = industry?.clientId || null;

          // Pass clientId as metadata
          dispatch(setInsightsScreenData(data, { meta: { clientId } }));
          dispatch(
            setLastRefreshed({
              page: 'insight',
              timestamp: new Date().toISOString(),
            }),
          );

          // Check if insights dashboard is ready (when both insights data and details are loaded)
          const state2 = getState();
          if (clientId === 4 || state2.dashboard?.insightDetails !== null) {
            dispatch(setDashboardReadiness({ dashboard: 'insights', ready: true }));
          }
        } catch (err) {
          dispatch(setError(err.message || 'Failed to fetch insights data'));
        }
      },
    }),

    getNextUnrefreshedInsight: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/get-next-unrefreshed-insight',
        method: 'POST',
        body: data,
      }),
    }),

    updateInsight: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update-insight',
        method: 'POST',
        body: data,
      }),
    }),

    updateInsightAnomaly: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update-insight-anomaly',
        method: 'POST',
        body: data,
      }),
    }),

    getNextUnrefreshedAnomaly: builder.query({
      query: ({ insight_id, index }) => ({
        url: `/api/dashboard/get-next-unrefreshed-anomaly?insight_id=${insight_id}&index=${index}`,
        method: 'GET',
      }),
    }),

    getAllVisualSummaries: builder.query({
      query: (personaId) => ({
        url: `/api/dashboard/get-all-visual-summaries?personaId=${personaId}`,
        method: 'GET',
      }),
    }),

    updateExecSummary: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update-exec-summary',
        method: 'POST',
        body: data,
      }),
    }),

    // NEW: Batch execute insight queries
    executeInsightQueries: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/execute-insight-queries',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ queries }, { dispatch, queryFulfilled }) {
        try {
          // Set batch execution state
          dispatch(setQueryExecutionBatch({ totalQueries: queries?.length || 0 }));

          // Set loading state for all queries
          if (queries && Array.isArray(queries)) {
            queries.forEach((query) => {
              dispatch(setInsightQueryLoading({ insightId: query.insight_id }));
            });
          }

          const { data } = await queryFulfilled;

          // Process batch results
          if (data?.success && data?.data) {
            dispatch(updateBatchQueryResults({ results: data.data }));
          } else {
            // Handle batch failure
            if (queries && Array.isArray(queries)) {
              queries.forEach((query) => {
                dispatch(
                  setInsightQueryError({
                    insightId: query.insight_id,
                    error: 'Batch execution failed',
                  }),
                );
              });
            }
          }
        } catch (err) {
          console.error('Batch query execution failed:', err);

          // Set error state for all queries in the batch
          if (queries && Array.isArray(queries)) {
            queries.forEach((query) => {
              dispatch(
                setInsightQueryError({
                  insightId: query.insight_id,
                  error: err.message || 'Query execution failed',
                }),
              );
            });
          }
        }
      },
    }),

    // NEW: Execute single insight query
    executeInsightQuery: builder.mutation({
      query: ({ insightId, sql_query }) => ({
        url: `/api/dashboard/execute-insight-query/${insightId}`,
        method: 'POST',
        body: { sql_query },
      }),
      async onQueryStarted({ insightId }, { dispatch, queryFulfilled }) {
        try {
          dispatch(setInsightQueryLoading({ insightId }));
          const { data } = await queryFulfilled;

          if (data?.success && data?.data) {
            dispatch(
              setInsightQueryResult({
                insightId,
                data: data.data.data || [],
                executionTime: data.data.execution_time,
              }),
            );
          } else {
            throw new Error(data?.error || 'Failed to execute query');
          }
        } catch (err) {
          console.error(`Query execution failed for insight ${insightId}:`, err);
          dispatch(
            setInsightQueryError({
              insightId,
              error: err.message || 'Query execution failed',
            }),
          );
        }
      },
    }),

    // Power BI related endpoints
    getPowerBIConfig: builder.query({
      query: (params = {}) => ({
        url: '/api/dashboard/powerbi-config',
        method: 'GET',
        params: {
          industryId: params.industryId,
          personaId: params.personaId,
        },
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    getMicroStrategyConfig: builder.query({
      query: (params = {}) => ({
        url: '/api/dashboard/microstrategy-config',
        method: 'GET',
        params: {
          industryId: params.industryId,
          personaId: params.personaId,
        },
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Track Power BI usage events
    trackPowerBIUsage: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/powerbi-track-usage',
        method: 'POST',
        body: data,
      }),
    }),

    // Get Power BI embed token
    getPowerBIEmbedToken: builder.query({
      query: ({ reportId, groupId = 'me' }) => ({
        url: `/api/dashboard/powerbi-embed-token?reportId=${reportId}&groupId=${groupId}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        // Handle demo token appropriately
        if (response?.data?.token === 'demo-token-for-fallback-only') {
          return {
            ...response.data,
            isDemoMode: true,
          };
        }

        // IMPORTANT FIX: Ensure tokenType is numeric, not string
        const transformedData = {
          ...response.data,
          // Convert tokenType to number if it's a string
          tokenType:
            response.data?.tokenType === 'Embed'
              ? 1
              : typeof response.data?.tokenType === 'string'
                ? 1
                : response.data?.tokenType,
        };

        return transformedData;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('PowerBI token error:', response);
        // Attempt to extract detailed error message
        let errorMessage = 'Failed to get PowerBI token';
        try {
          if (response.data) {
            errorMessage = response.data.message || JSON.stringify(response.data);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        return {
          status: response.status,
          message: errorMessage,
          reportId: arg.reportId,
        };
      },
      keepUnusedDataFor: 60, // Only cache for 1 minute since tokens expire
    }),

    // Get user's Power BI reports
    getPowerBIReports: builder.query({
      query: () => ({
        url: '/api/dashboard/powerbi-user-reports',
        method: 'GET',
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Get workspace reports
    getPowerBIWorkspaceReports: builder.query({
      query: (workspaceId) => ({
        url: `/api/dashboard/powerbi-workspace-reports?workspaceId=${workspaceId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Execute Power BI dataset query
    executePowerBIQuery: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/powerbi-execute-query',
        method: 'POST',
        body: data,
      }),
    }),

    // Fetch Power BI SDK from our API for CSP safety
    getPowerBISDK: builder.query({
      query: () => ({
        url: '/api/dashboard/powerbi-sdk.js',
        method: 'GET',
        responseHandler: (response) => response.text(), // Handle as text
      }),
      keepUnusedDataFor: 86400, // Cache for 24 hours
    }),

    // KPI management endpoints
    addKpis: builder.mutation({
      query: ({ persona_id, KPIs }) => ({
        url: `/api/dashboard/kpis/${persona_id}`,
        method: 'POST',
        body: { KPIs },
      }),
    }),

    getPersonaKpis: builder.query({
      query: (persona_id) => ({
        url: `/api/dashboard/kpis/${persona_id}`,
        method: 'GET',
      }),
    }),

    // Insight HLQ management endpoints
    insertInsightHlq: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/insert_insight_hlq',
        method: 'POST',
        body: data,
      }),
    }),

    insertInsightPersona: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/insert_insight_persona',
        method: 'POST',
        body: data,
      }),
    }),

    fetchPersonaHlq: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/fetch_persona_hlq',
        method: 'POST',
        body: data,
      }),
    }),

    updateInsightStatus: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update_insight_status',
        method: 'POST',
        body: data,
      }),
    }),

    updateBusinessInsight: builder.mutation({
      query: (data) => ({
        url: '/api/dashboard/update_business_insight',
        method: 'POST',
        body: data,
      }),
    }),

 getKpiDashboard: builder.query({
  query: () => ({
    url: `/api/dashboard/kpiDashboard`,
    method: "GET",
  }),

  // --- Transform Response (Runs for SUCCESS responses only) ---
  transformResponse: (response) => {
    const dummyData = [
      { title: "Deposit Balance", value: "$10M", sub: "(+3.2% of LY Avg)", trend: "up" },
      { title: "Loan Outstanding", value: "$1.2M", sub: "(Out of $10M)" },
      { title: "Credit Utilisation", value: "60%", sub: "(Out of $22M)" },
      { title: "Net Profit", value: "$2.4M", sub: "(+5% YoY)", trend: "up" },
    ];

    // If API gives NON-ARRAY response (like your 404), return dummy
    if (!Array.isArray(response)) {
      return dummyData;
    }

    // If API returns empty array → return dummy
    if (response.length === 0) {
      return dummyData;
    }

    // Otherwise return real API data
    return response;
  },

  // --- Handles FAILURE or SUCCESS (Runs before transformResponse completely resolves) ---
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled; // `data` is already transformed

      dispatch(setKpiDashboardData(data));
    } catch (err) {
      // If API failed (404, 500, network issue, etc.) → send dummy data manually
      const dummyData =[
  {
    id: 1,
    title: "Deposit Balance",
    value: "$10M",
    sub: "(+3.2% of LY Avg)",
    trend: "up"
  },
  {
    id: 2,
    title: "Loan Outstanding",
    value: "$1.2M",
    sub: "(Out of $10M)"
  },
  {
    id: 3,
    title: "Credit Utilisation",
    value: "60%",
    sub: "(Out of $22M)"
  },
  {
    id: 4,
    title: "Net Profit",
    value: "$2.4M",
    sub: "(+5% YoY)",
    trend: "up"
  }
]

      dispatch(setKpiDashboardData(dummyData));
      dispatch(setError(err.message || "Failed to fetch KPI Dashboard data"));
    }
  },
}),

getDepositLoanDetails: builder.query({
  query: () => ({
    url: `/api/dashboard/depositLoan`,
    method: "GET",
  }),

  // --- Transform success responses ---
  transformResponse: (response) => {
    const dummyData = {
      MoM: {
        labels: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        data: [0.65, 0.6, 0.62, 0.7, 0.78, 0.88, 0.98, 1.02, 1.05, 1.1, 0.9, 0.6],
      },
      YoY: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        data: [3.0, 6.0, 13.8, 10.5, 4.8]
      },
      QoQ: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.7, 0.9, 1.0, 0.6]
      },
    };

    // If response is NOT array → send dummy
    if (!Array.isArray(response)) return dummyData;

    // If empty return dummy
    if (response.length === 0) return dummyData;

    return response; // Real API data
  },

  // Handle SUCCESS AND FAILURES
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled; // already transformed
      dispatch(setDepositLoanDetails(data));
    } catch (err) {
      // Prepare fallback dummy
      const dummyData = {
        MoM: {
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          data: [0.65, 0.6, 0.62, 0.7, 0.78, 0.88, 0.98, 1.02, 1.05, 1.1, 0.9, 0.6],
        },
        YoY: {
          labels: ['2021', '2022', '2023', '2024', '2025'],
          data: [3.0, 6.0, 13.8, 10.5, 4.8]
        },
        QoQ: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          data: [0.7, 0.9, 1.0, 0.6]
        },
      };

      dispatch(setDepositLoanDetails(dummyData));
      dispatch(setError(err.message || "Failed to fetch Deposit/Loan details"));
    }
  },
}),

getLoanOutstandingDetails: builder.query({
  query: () => ({
    url: `/api/dashboard/loanOutstanding`,
    method: "GET",
  }),

  // --- Transform success responses ---
  transformResponse: (response) => {
     const dummyData = {
    MoM: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [0.45, 0.55, 0.8, 0.8, 0.6, 0.5, 0.7, 0.9, 0.75, 1.0, 0.85, 0.65],
    },
    YoY: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [2.2, 3.1, 4.0, 3.4, 2.8] },
    QoQ: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [0.5, 0.9, 1.1, 0.7] },
  };

    // If response is NOT array → send dummy
    if (!Array.isArray(response)) return dummyData;

    // If empty return dummy
    if (response.length === 0) return dummyData;

    return response; // Real API data
  },

  // Handle SUCCESS AND FAILURES
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled; // already transformed
      dispatch(setLoanOutstandingDetails(data));
    } catch (err) {
      // Prepare fallback dummy
        const dummyData = {
    MoM: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [0.45, 0.55, 0.8, 0.8, 0.6, 0.5, 0.7, 0.9, 0.75, 1.0, 0.85, 0.65],
    },
    YoY: { labels: ['2021', '2022', '2023', '2024', '2025'], data: [2.2, 3.1, 4.0, 3.4, 2.8] },
    QoQ: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [0.5, 0.9, 1.1, 0.7] },
  };

      dispatch(setLoanOutstandingDetails(dummyData));
      dispatch(setError(err.message || "Failed to fetch Deposit/Loan details"));
    }
  },
})



  }),
});

export const {
  useDownloadDashboardAsPptMutation,
  useGetInsightDetailsQuery,
  useGetHomeScreenDataQuery,
  useGetHomeSummaryQuery,
  useResetVisualMutation,
  useGetNextUnrefreshedVisualMutation,
  useUpdateVisualMutation,
  useGetInsightsScreenDataQuery,
  useGetNextUnrefreshedInsightMutation,
  useUpdateInsightMutation,
  useUpdateInsightAnomalyMutation,
  useGetNextUnrefreshedAnomalyQuery,
  useGetAllVisualSummariesQuery,
  useUpdateExecSummaryMutation,
  useGetPowerBIConfigQuery,
  useGetMicroStrategyConfigQuery,
  useTrackPowerBIUsageMutation,
  useGetPowerBIEmbedTokenQuery,
  useGetPowerBIReportsQuery,
  useGetPowerBIWorkspaceReportsQuery,
  useExecutePowerBIQueryMutation,
  useGetPowerBISDKQuery,
  useAddKpisMutation,
  useGetPersonaKpisQuery,
  useInsertInsightHlqMutation,
  useInsertInsightPersonaMutation,
  useFetchPersonaHlqMutation,
  useUpdateInsightStatusMutation,
  useUpdateBusinessInsightMutation,
  useExecuteInsightQueriesMutation,
  useExecuteInsightQueryMutation,
  useDownloadInsightsAsPptMutation,
  useGetKpiDashboardQuery,
  useGetDepositLoanDetailsQuery,
  useGetLoanOutstandingDetailsQuery
} = dashboardApi;

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
  setLoanOutstandingDetails,
  setRevenueGraphDetails,
  setTotalProfitandLossRelationship,
  setEngagementDetails,
} from '../redux/store/dashboardSlice';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    downloadDashboardAsPpt: builder.mutation({
      query: (payload) => ({
        url: '/api/dashboard/dashboards_to_ppt',
        method: 'POST',
        body: payload,
        responseHandler: async (response) => {
          console.log('📥 Raw fetch Response:', response); // <--- Response object
          const blob = await response.blob();
          console.log('📦 Blob from responseHandler:', blob); // <--- Blob (before transform)
          return blob;
        },
      }),
      transformResponse: async (response) => {
        // Case 1: Response is JSON (error/info)
        console.log('🔍 Blob received in transformResponse:', response);
        console.log('🔍 Blob type:', response.type, 'size:', response.size);
        if (response.type === 'application/json') {
          const text = await response.text();
          try {
            return JSON.parse(text); // safe serializable object
          } catch {
            return { status: 'error', message: 'Invalid JSON response' };
          }
        }

        // Case 2: Response is a PPTX file
        if (response.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
          const url = URL.createObjectURL(response);
          console.log('✅ Generated ObjectURL for PPTX:', url);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'dashboard.pptx';
          document.body.appendChild(a);
          a.click();
          a.remove();
          return { status: 'success', blob_link: url }; // serializable link
        }

        // Unknown response
        return { status: 'error', message: 'Unexpected response format' };
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
        console.log('✅ JSON response from backend (insights):', response);

        if (response?.status === 'success' && response?.blob_link) {
          // Auto-trigger download
          const a = document.createElement('a');
          a.href = response.blob_link;
          a.download = 'insight.pptx';
          document.body.appendChild(a);
          a.click();
          a.remove();

          return { status: 'success', blob_link: response.blob_link };
        }

        return { status: 'error', message: 'Unexpected response', raw: response };
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
        method: 'GET',
      }),

      // --- Transform Response (Runs for SUCCESS responses only) ---
      transformResponse: (response) => {
        const dummyData = {
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
        };
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
          // If API failed (404, 500, network issue, etc.) → send dummy data manuall

          const dummyData = {
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
          };

          dispatch(setKpiDashboardData(dummyData));
          dispatch(setError(err.message || 'Failed to fetch KPI Dashboard data'));
        }
      },
    }),

    getDepositLoanDetails: builder.query({
      query: () => ({
        url: `/api/dashboard/depositLoan`,
        method: 'GET',
      }),

      // --- Transform success responses ---
      transformResponse: (response) => {
        const dummyData = {
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
          };

          dispatch(setDepositLoanDetails(dummyData));
          dispatch(setError(err.message || 'Failed to fetch Deposit/Loan details'));
        }
      },
    }),

    getLoanOutstandingDetails: builder.query({
      query: () => ({
        url: `/api/dashboard/loanOutstanding`,
        method: 'GET',
      }),

      // --- Transform success responses ---
      transformResponse: (response) => {
        const dummyData = {
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
          };

          dispatch(setLoanOutstandingDetails(dummyData));
          dispatch(setError(err.message || 'Failed to fetch loan outstanding details'));
        }
      },
    }),

    getRevenueGraphDetails: builder.query({
      query: () => ({
        url: `/api/dashboard/revenue`,
        method: 'GET',
      }),

      // --- Transform success responses ---
      transformResponse: (response) => {
        const dummyData = {
          'Account Number 1': {
            YoY: [
              { month: 'Jan', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Feb', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Mar', net: 200000, gross: 150000, clientId: 1 },
              { month: 'Apr', net: 400000, gross: 300000, clientId: 1 },
              { month: 'May', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Jun', net: 800000, gross: 700000, clientId: 1 },
              { month: 'Jul', net: 800000, gross: 600000, clientId: 1 },
              { month: 'Aug', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Sep', net: 200000, gross: 150000, clientId: 1 },
              { month: 'Oct', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Nov', net: 500000, gross: 400000, clientId: 1 },
              { month: 'Dec', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Jan', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Feb', net: 650000, gross: 540000, clientId: 2 },
              { month: 'Mar', net: 700000, gross: 580000, clientId: 2 },
              { month: 'Apr', net: 720000, gross: 600000, clientId: 2 },
              { month: 'May', net: 750000, gross: 630000, clientId: 2 },
              { month: 'Jun', net: 780000, gross: 650000, clientId: 2 },
              { month: 'Jul', net: 800000, gross: 670000, clientId: 2 },
              { month: 'Aug', net: 820000, gross: 690000, clientId: 2 },
              { month: 'Sep', net: 840000, gross: 710000, clientId: 2 },
              { month: 'Oct', net: 860000, gross: 730000, clientId: 2 },
              { month: 'Nov', net: 880000, gross: 750000, clientId: 2 },
              { month: 'Dec', net: 900000, gross: 780000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 350000, gross: 300000, clientId: 1 },
              { month: 'Feb', net: 420000, gross: 380000, clientId: 1 },
              { month: 'Mar', net: 460000, gross: 410000, clientId: 1 },
              { month: 'Apr', net: 480000, gross: 430000, clientId: 1 },
              { month: 'May', net: 520000, gross: 470000, clientId: 1 },
              { month: 'Jun', net: 550000, gross: 500000, clientId: 1 },
              { month: 'Jul', net: 530000, gross: 480000, clientId: 1 },
              { month: 'Aug', net: 510000, gross: 470000, clientId: 1 },
              { month: 'Sep', net: 560000, gross: 510000, clientId: 1 },
              { month: 'Oct', net: 600000, gross: 550000, clientId: 1 },
              { month: 'Nov', net: 580000, gross: 530000, clientId: 1 },
              { month: 'Dec', net: 620000, gross: 560000, clientId: 1 },
              { month: 'Jan', net: 300000, gross: 260000, clientId: 2 },
              { month: 'Feb', net: 320000, gross: 280000, clientId: 2 },
              { month: 'Mar', net: 360000, gross: 300000, clientId: 2 },
              { month: 'Apr', net: 380000, gross: 320000, clientId: 2 },
              { month: 'May', net: 400000, gross: 340000, clientId: 2 },
              { month: 'Jun', net: 420000, gross: 360000, clientId: 2 },
              { month: 'Jul', net: 450000, gross: 380000, clientId: 2 },
              { month: 'Aug', net: 470000, gross: 400000, clientId: 2 },
              { month: 'Sep', net: 490000, gross: 420000, clientId: 2 },
              { month: 'Oct', net: 510000, gross: 440000, clientId: 2 },
              { month: 'Nov', net: 530000, gross: 460000, clientId: 2 },
              { month: 'Dec', net: 550000, gross: 480000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 1200000, gross: 900000, clientId: 1 },
              { month: 'Q2', net: 1400000, gross: 1100000, clientId: 1 },
              { month: 'Q3', net: 1600000, gross: 1300000, clientId: 1 },
              { month: 'Q4', net: 1800000, gross: 1500000, clientId: 1 },
              { month: 'Q1', net: 1200000, gross: 900000, clientId: 2 },
              { month: 'Q2', net: 1400000, gross: 1100000, clientId: 2 },
              { month: 'Q3', net: 1600000, gross: 1300000, clientId: 2 },
              { month: 'Q4', net: 1800000, gross: 1500000, clientId: 2 },
            ],
          },
          'Account Number 2': {
            YoY: [
              { month: 'Jan', net: 500000, gross: 400000, clientId: 1 },
              { month: 'Feb', net: 520000, gross: 420000, clientId: 1 },
              { month: 'Mar', net: 540000, gross: 440000, clientId: 1 },
              { month: 'Apr', net: 560000, gross: 460000, clientId: 1 },
              { month: 'May', net: 580000, gross: 480000, clientId: 1 },
              { month: 'Jun', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Jul', net: 630000, gross: 520000, clientId: 1 },
              { month: 'Aug', net: 650000, gross: 540000, clientId: 1 },
              { month: 'Sep', net: 670000, gross: 560000, clientId: 1 },
              { month: 'Oct', net: 690000, gross: 580000, clientId: 1 },
              { month: 'Nov', net: 710000, gross: 600000, clientId: 1 },
              { month: 'Dec', net: 740000, gross: 620000, clientId: 1 },
              { month: 'Jan', net: 480000, gross: 380000, clientId: 2 },
              { month: 'Feb', net: 500000, gross: 400000, clientId: 2 },
              { month: 'Mar', net: 520000, gross: 420000, clientId: 2 },
              { month: 'Apr', net: 540000, gross: 440000, clientId: 2 },
              { month: 'May', net: 560000, gross: 460000, clientId: 2 },
              { month: 'Jun', net: 580000, gross: 480000, clientId: 2 },
              { month: 'Jul', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Aug', net: 620000, gross: 520000, clientId: 2 },
              { month: 'Sep', net: 640000, gross: 540000, clientId: 2 },
              { month: 'Oct', net: 660000, gross: 560000, clientId: 2 },
              { month: 'Nov', net: 680000, gross: 580000, clientId: 2 },
              { month: 'Dec', net: 700000, gross: 600000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 240000, gross: 200000, clientId: 1 },
              { month: 'Feb', net: 260000, gross: 220000, clientId: 1 },
              { month: 'Mar', net: 280000, gross: 240000, clientId: 1 },
              { month: 'Apr', net: 300000, gross: 260000, clientId: 1 },
              { month: 'May', net: 320000, gross: 280000, clientId: 1 },
              { month: 'Jun', net: 340000, gross: 300000, clientId: 1 },
              { month: 'Jul', net: 360000, gross: 320000, clientId: 1 },
              { month: 'Aug', net: 380000, gross: 340000, clientId: 1 },
              { month: 'Sep', net: 400000, gross: 360000, clientId: 1 },
              { month: 'Oct', net: 420000, gross: 380000, clientId: 1 },
              { month: 'Nov', net: 440000, gross: 400000, clientId: 1 },
              { month: 'Dec', net: 460000, gross: 420000, clientId: 1 },
              { month: 'Jan', net: 200000, gross: 180000, clientId: 2 },
              { month: 'Feb', net: 220000, gross: 200000, clientId: 2 },
              { month: 'Mar', net: 240000, gross: 220000, clientId: 2 },
              { month: 'Apr', net: 260000, gross: 240000, clientId: 2 },
              { month: 'May', net: 280000, gross: 260000, clientId: 2 },
              { month: 'Jun', net: 300000, gross: 280000, clientId: 2 },
              { month: 'Jul', net: 320000, gross: 300000, clientId: 2 },
              { month: 'Aug', net: 340000, gross: 320000, clientId: 2 },
              { month: 'Sep', net: 360000, gross: 340000, clientId: 2 },
              { month: 'Oct', net: 380000, gross: 360000, clientId: 2 },
              { month: 'Nov', net: 400000, gross: 380000, clientId: 2 },
              { month: 'Dec', net: 420000, gross: 400000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 900000, gross: 720000, clientId: 1 },
              { month: 'Q2', net: 1000000, gross: 820000, clientId: 1 },
              { month: 'Q3', net: 1100000, gross: 900000, clientId: 1 },
              { month: 'Q4', net: 1200000, gross: 1000000, clientId: 1 },
              { month: 'Q1', net: 800000, gross: 650000, clientId: 2 },
              { month: 'Q2', net: 920000, gross: 760000, clientId: 2 },
              { month: 'Q3', net: 1040000, gross: 860000, clientId: 2 },
              { month: 'Q4', net: 1160000, gross: 960000, clientId: 2 },
            ],
          },
          'Account Number 3': {
            YoY: [
              { month: 'Jan', net: 900000, gross: 700000, clientId: 1 },
              { month: 'Feb', net: 940000, gross: 720000, clientId: 1 },
              { month: 'Mar', net: 960000, gross: 740000, clientId: 1 },
              { month: 'Apr', net: 980000, gross: 760000, clientId: 1 },
              { month: 'May', net: 1000000, gross: 780000, clientId: 1 },
              { month: 'Jun', net: 1040000, gross: 800000, clientId: 1 },
              { month: 'Jul', net: 1080000, gross: 820000, clientId: 1 },
              { month: 'Aug', net: 1120000, gross: 840000, clientId: 1 },
              { month: 'Sep', net: 1160000, gross: 860000, clientId: 1 },
              { month: 'Oct', net: 1200000, gross: 880000, clientId: 1 },
              { month: 'Nov', net: 1240000, gross: 900000, clientId: 1 },
              { month: 'Dec', net: 1280000, gross: 940000, clientId: 1 },
              { month: 'Jan', net: 850000, gross: 650000, clientId: 2 },
              { month: 'Feb', net: 880000, gross: 680000, clientId: 2 },
              { month: 'Mar', net: 910000, gross: 700000, clientId: 2 },
              { month: 'Apr', net: 940000, gross: 720000, clientId: 2 },
              { month: 'May', net: 970000, gross: 740000, clientId: 2 },
              { month: 'Jun', net: 1000000, gross: 760000, clientId: 2 },
              { month: 'Jul', net: 1040000, gross: 780000, clientId: 2 },
              { month: 'Aug', net: 1080000, gross: 800000, clientId: 2 },
              { month: 'Sep', net: 1120000, gross: 820000, clientId: 2 },
              { month: 'Oct', net: 1160000, gross: 860000, clientId: 2 },
              { month: 'Nov', net: 1200000, gross: 900000, clientId: 2 },
              { month: 'Dec', net: 1240000, gross: 920000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Feb', net: 620000, gross: 520000, clientId: 1 },
              { month: 'Mar', net: 640000, gross: 540000, clientId: 1 },
              { month: 'Apr', net: 660000, gross: 560000, clientId: 1 },
              { month: 'May', net: 680000, gross: 580000, clientId: 1 },
              { month: 'Jun', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Jul', net: 720000, gross: 620000, clientId: 1 },
              { month: 'Aug', net: 740000, gross: 640000, clientId: 1 },
              { month: 'Sep', net: 760000, gross: 660000, clientId: 1 },
              { month: 'Oct', net: 780000, gross: 680000, clientId: 1 },
              { month: 'Nov', net: 800000, gross: 700000, clientId: 1 },
              { month: 'Dec', net: 820000, gross: 720000, clientId: 1 },
              { month: 'Jan', net: 550000, gross: 450000, clientId: 2 },
              { month: 'Feb', net: 580000, gross: 480000, clientId: 2 },
              { month: 'Mar', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Apr', net: 620000, gross: 520000, clientId: 2 },
              { month: 'May', net: 640000, gross: 540000, clientId: 2 },
              { month: 'Jun', net: 660000, gross: 560000, clientId: 2 },
              { month: 'Jul', net: 680000, gross: 580000, clientId: 2 },
              { month: 'Aug', net: 700000, gross: 600000, clientId: 2 },
              { month: 'Sep', net: 720000, gross: 620000, clientId: 2 },
              { month: 'Oct', net: 740000, gross: 640000, clientId: 2 },
              { month: 'Nov', net: 760000, gross: 660000, clientId: 2 },
              { month: 'Dec', net: 780000, gross: 680000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 2000000, gross: 1500000, clientId: 1 },
              { month: 'Q2', net: 2200000, gross: 1700000, clientId: 1 },
              { month: 'Q3', net: 2400000, gross: 1900000, clientId: 1 },
              { month: 'Q4', net: 2600000, gross: 2100000, clientId: 1 },
              { month: 'Q1', net: 1800000, gross: 1400000, clientId: 2 },
              { month: 'Q2', net: 2000000, gross: 1600000, clientId: 2 },
              { month: 'Q3', net: 2200000, gross: 1800000, clientId: 2 },
              { month: 'Q4', net: 2400000, gross: 2000000, clientId: 2 },
            ],
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
          dispatch(setRevenueGraphDetails(data));
        } catch (err) {
          // Prepare fallback dummy
          const dummyData = {
          'Account Number 1': {
            YoY: [
              { month: 'Jan', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Feb', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Mar', net: 200000, gross: 150000, clientId: 1 },
              { month: 'Apr', net: 400000, gross: 300000, clientId: 1 },
              { month: 'May', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Jun', net: 800000, gross: 700000, clientId: 1 },
              { month: 'Jul', net: 800000, gross: 600000, clientId: 1 },
              { month: 'Aug', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Sep', net: 200000, gross: 150000, clientId: 1 },
              { month: 'Oct', net: 400000, gross: 300000, clientId: 1 },
              { month: 'Nov', net: 500000, gross: 400000, clientId: 1 },
              { month: 'Dec', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Jan', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Feb', net: 650000, gross: 540000, clientId: 2 },
              { month: 'Mar', net: 700000, gross: 580000, clientId: 2 },
              { month: 'Apr', net: 720000, gross: 600000, clientId: 2 },
              { month: 'May', net: 750000, gross: 630000, clientId: 2 },
              { month: 'Jun', net: 780000, gross: 650000, clientId: 2 },
              { month: 'Jul', net: 800000, gross: 670000, clientId: 2 },
              { month: 'Aug', net: 820000, gross: 690000, clientId: 2 },
              { month: 'Sep', net: 840000, gross: 710000, clientId: 2 },
              { month: 'Oct', net: 860000, gross: 730000, clientId: 2 },
              { month: 'Nov', net: 880000, gross: 750000, clientId: 2 },
              { month: 'Dec', net: 900000, gross: 780000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 350000, gross: 300000, clientId: 1 },
              { month: 'Feb', net: 420000, gross: 380000, clientId: 1 },
              { month: 'Mar', net: 460000, gross: 410000, clientId: 1 },
              { month: 'Apr', net: 480000, gross: 430000, clientId: 1 },
              { month: 'May', net: 520000, gross: 470000, clientId: 1 },
              { month: 'Jun', net: 550000, gross: 500000, clientId: 1 },
              { month: 'Jul', net: 530000, gross: 480000, clientId: 1 },
              { month: 'Aug', net: 510000, gross: 470000, clientId: 1 },
              { month: 'Sep', net: 560000, gross: 510000, clientId: 1 },
              { month: 'Oct', net: 600000, gross: 550000, clientId: 1 },
              { month: 'Nov', net: 580000, gross: 530000, clientId: 1 },
              { month: 'Dec', net: 620000, gross: 560000, clientId: 1 },
              { month: 'Jan', net: 300000, gross: 260000, clientId: 2 },
              { month: 'Feb', net: 320000, gross: 280000, clientId: 2 },
              { month: 'Mar', net: 360000, gross: 300000, clientId: 2 },
              { month: 'Apr', net: 380000, gross: 320000, clientId: 2 },
              { month: 'May', net: 400000, gross: 340000, clientId: 2 },
              { month: 'Jun', net: 420000, gross: 360000, clientId: 2 },
              { month: 'Jul', net: 450000, gross: 380000, clientId: 2 },
              { month: 'Aug', net: 470000, gross: 400000, clientId: 2 },
              { month: 'Sep', net: 490000, gross: 420000, clientId: 2 },
              { month: 'Oct', net: 510000, gross: 440000, clientId: 2 },
              { month: 'Nov', net: 530000, gross: 460000, clientId: 2 },
              { month: 'Dec', net: 550000, gross: 480000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 1200000, gross: 900000, clientId: 1 },
              { month: 'Q2', net: 1400000, gross: 1100000, clientId: 1 },
              { month: 'Q3', net: 1600000, gross: 1300000, clientId: 1 },
              { month: 'Q4', net: 1800000, gross: 1500000, clientId: 1 },
              { month: 'Q1', net: 1200000, gross: 900000, clientId: 2 },
              { month: 'Q2', net: 1400000, gross: 1100000, clientId: 2 },
              { month: 'Q3', net: 1600000, gross: 1300000, clientId: 2 },
              { month: 'Q4', net: 1800000, gross: 1500000, clientId: 2 },
            ],
          },
          'Account Number 2': {
            YoY: [
              { month: 'Jan', net: 500000, gross: 400000, clientId: 1 },
              { month: 'Feb', net: 520000, gross: 420000, clientId: 1 },
              { month: 'Mar', net: 540000, gross: 440000, clientId: 1 },
              { month: 'Apr', net: 560000, gross: 460000, clientId: 1 },
              { month: 'May', net: 580000, gross: 480000, clientId: 1 },
              { month: 'Jun', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Jul', net: 630000, gross: 520000, clientId: 1 },
              { month: 'Aug', net: 650000, gross: 540000, clientId: 1 },
              { month: 'Sep', net: 670000, gross: 560000, clientId: 1 },
              { month: 'Oct', net: 690000, gross: 580000, clientId: 1 },
              { month: 'Nov', net: 710000, gross: 600000, clientId: 1 },
              { month: 'Dec', net: 740000, gross: 620000, clientId: 1 },
              { month: 'Jan', net: 480000, gross: 380000, clientId: 2 },
              { month: 'Feb', net: 500000, gross: 400000, clientId: 2 },
              { month: 'Mar', net: 520000, gross: 420000, clientId: 2 },
              { month: 'Apr', net: 540000, gross: 440000, clientId: 2 },
              { month: 'May', net: 560000, gross: 460000, clientId: 2 },
              { month: 'Jun', net: 580000, gross: 480000, clientId: 2 },
              { month: 'Jul', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Aug', net: 620000, gross: 520000, clientId: 2 },
              { month: 'Sep', net: 640000, gross: 540000, clientId: 2 },
              { month: 'Oct', net: 660000, gross: 560000, clientId: 2 },
              { month: 'Nov', net: 680000, gross: 580000, clientId: 2 },
              { month: 'Dec', net: 700000, gross: 600000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 240000, gross: 200000, clientId: 1 },
              { month: 'Feb', net: 260000, gross: 220000, clientId: 1 },
              { month: 'Mar', net: 280000, gross: 240000, clientId: 1 },
              { month: 'Apr', net: 300000, gross: 260000, clientId: 1 },
              { month: 'May', net: 320000, gross: 280000, clientId: 1 },
              { month: 'Jun', net: 340000, gross: 300000, clientId: 1 },
              { month: 'Jul', net: 360000, gross: 320000, clientId: 1 },
              { month: 'Aug', net: 380000, gross: 340000, clientId: 1 },
              { month: 'Sep', net: 400000, gross: 360000, clientId: 1 },
              { month: 'Oct', net: 420000, gross: 380000, clientId: 1 },
              { month: 'Nov', net: 440000, gross: 400000, clientId: 1 },
              { month: 'Dec', net: 460000, gross: 420000, clientId: 1 },
              { month: 'Jan', net: 200000, gross: 180000, clientId: 2 },
              { month: 'Feb', net: 220000, gross: 200000, clientId: 2 },
              { month: 'Mar', net: 240000, gross: 220000, clientId: 2 },
              { month: 'Apr', net: 260000, gross: 240000, clientId: 2 },
              { month: 'May', net: 280000, gross: 260000, clientId: 2 },
              { month: 'Jun', net: 300000, gross: 280000, clientId: 2 },
              { month: 'Jul', net: 320000, gross: 300000, clientId: 2 },
              { month: 'Aug', net: 340000, gross: 320000, clientId: 2 },
              { month: 'Sep', net: 360000, gross: 340000, clientId: 2 },
              { month: 'Oct', net: 380000, gross: 360000, clientId: 2 },
              { month: 'Nov', net: 400000, gross: 380000, clientId: 2 },
              { month: 'Dec', net: 420000, gross: 400000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 900000, gross: 720000, clientId: 1 },
              { month: 'Q2', net: 1000000, gross: 820000, clientId: 1 },
              { month: 'Q3', net: 1100000, gross: 900000, clientId: 1 },
              { month: 'Q4', net: 1200000, gross: 1000000, clientId: 1 },
              { month: 'Q1', net: 800000, gross: 650000, clientId: 2 },
              { month: 'Q2', net: 920000, gross: 760000, clientId: 2 },
              { month: 'Q3', net: 1040000, gross: 860000, clientId: 2 },
              { month: 'Q4', net: 1160000, gross: 960000, clientId: 2 },
            ],
          },
          'Account Number 3': {
            YoY: [
              { month: 'Jan', net: 900000, gross: 700000, clientId: 1 },
              { month: 'Feb', net: 940000, gross: 720000, clientId: 1 },
              { month: 'Mar', net: 960000, gross: 740000, clientId: 1 },
              { month: 'Apr', net: 980000, gross: 760000, clientId: 1 },
              { month: 'May', net: 1000000, gross: 780000, clientId: 1 },
              { month: 'Jun', net: 1040000, gross: 800000, clientId: 1 },
              { month: 'Jul', net: 1080000, gross: 820000, clientId: 1 },
              { month: 'Aug', net: 1120000, gross: 840000, clientId: 1 },
              { month: 'Sep', net: 1160000, gross: 860000, clientId: 1 },
              { month: 'Oct', net: 1200000, gross: 880000, clientId: 1 },
              { month: 'Nov', net: 1240000, gross: 900000, clientId: 1 },
              { month: 'Dec', net: 1280000, gross: 940000, clientId: 1 },
              { month: 'Jan', net: 850000, gross: 650000, clientId: 2 },
              { month: 'Feb', net: 880000, gross: 680000, clientId: 2 },
              { month: 'Mar', net: 910000, gross: 700000, clientId: 2 },
              { month: 'Apr', net: 940000, gross: 720000, clientId: 2 },
              { month: 'May', net: 970000, gross: 740000, clientId: 2 },
              { month: 'Jun', net: 1000000, gross: 760000, clientId: 2 },
              { month: 'Jul', net: 1040000, gross: 780000, clientId: 2 },
              { month: 'Aug', net: 1080000, gross: 800000, clientId: 2 },
              { month: 'Sep', net: 1120000, gross: 820000, clientId: 2 },
              { month: 'Oct', net: 1160000, gross: 860000, clientId: 2 },
              { month: 'Nov', net: 1200000, gross: 900000, clientId: 2 },
              { month: 'Dec', net: 1240000, gross: 920000, clientId: 2 },
            ],
            MoM: [
              { month: 'Jan', net: 600000, gross: 500000, clientId: 1 },
              { month: 'Feb', net: 620000, gross: 520000, clientId: 1 },
              { month: 'Mar', net: 640000, gross: 540000, clientId: 1 },
              { month: 'Apr', net: 660000, gross: 560000, clientId: 1 },
              { month: 'May', net: 680000, gross: 580000, clientId: 1 },
              { month: 'Jun', net: 700000, gross: 600000, clientId: 1 },
              { month: 'Jul', net: 720000, gross: 620000, clientId: 1 },
              { month: 'Aug', net: 740000, gross: 640000, clientId: 1 },
              { month: 'Sep', net: 760000, gross: 660000, clientId: 1 },
              { month: 'Oct', net: 780000, gross: 680000, clientId: 1 },
              { month: 'Nov', net: 800000, gross: 700000, clientId: 1 },
              { month: 'Dec', net: 820000, gross: 720000, clientId: 1 },
              { month: 'Jan', net: 550000, gross: 450000, clientId: 2 },
              { month: 'Feb', net: 580000, gross: 480000, clientId: 2 },
              { month: 'Mar', net: 600000, gross: 500000, clientId: 2 },
              { month: 'Apr', net: 620000, gross: 520000, clientId: 2 },
              { month: 'May', net: 640000, gross: 540000, clientId: 2 },
              { month: 'Jun', net: 660000, gross: 560000, clientId: 2 },
              { month: 'Jul', net: 680000, gross: 580000, clientId: 2 },
              { month: 'Aug', net: 700000, gross: 600000, clientId: 2 },
              { month: 'Sep', net: 720000, gross: 620000, clientId: 2 },
              { month: 'Oct', net: 740000, gross: 640000, clientId: 2 },
              { month: 'Nov', net: 760000, gross: 660000, clientId: 2 },
              { month: 'Dec', net: 780000, gross: 680000, clientId: 2 },
            ],
            QoQ: [
              { month: 'Q1', net: 2000000, gross: 1500000, clientId: 1 },
              { month: 'Q2', net: 2200000, gross: 1700000, clientId: 1 },
              { month: 'Q3', net: 2400000, gross: 1900000, clientId: 1 },
              { month: 'Q4', net: 2600000, gross: 2100000, clientId: 1 },
              { month: 'Q1', net: 1800000, gross: 1400000, clientId: 2 },
              { month: 'Q2', net: 2000000, gross: 1600000, clientId: 2 },
              { month: 'Q3', net: 2200000, gross: 1800000, clientId: 2 },
              { month: 'Q4', net: 2400000, gross: 2000000, clientId: 2 },
            ],
          },
        };

          dispatch(setRevenueGraphDetails(dummyData));
          dispatch(setError(err.message || 'Failed to fetch revenue details'));
        }
      },
    }),

    getTotalProfitAndLossRelationshipDetails: builder.query({
      query: () => ({
        url: `/api/dashboard/totalProfitAndLossRelationship`,
        method: 'GET',
      }),

      // --- Transform success responses ---
      transformResponse: (response) => {
        const dummyData = {
          Top1: {
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
          dispatch(setTotalProfitandLossRelationship(data));
        } catch (err) {
          const dummyData = {
            Top1: {
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
          };

          dispatch(setTotalProfitandLossRelationship(dummyData));
          dispatch(setError(err.message || 'Failed to fetch total profit and loss relationship details'));
        }
      },
    }),

    getEngagementDetails: builder.query({
      query: () => ({
        url: `/api/dashboard/engagementDetails`,
        method: 'GET',
      }),

      // --- Transform success responses ---
      transformResponse: (response) => {
        const dummyData = {
          engagement: [
            { clientId: 1, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
            { clientId: 2, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
            { clientId: 1, label: 'Last Maturity Date', date: '22 Sep 2030', status: 'green' },
            { clientId: 1, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
            { clientId: 2, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
            { clientId: 1, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
            { clientId: 2, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
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
          dispatch(setEngagementDetails(data));
        } catch (err) {
          // Prepare fallback dummy
          const dummyData = {
            engagement: [
              { clientId: 1, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
              { clientId: 2, label: 'Last Meeting Attended', date: '20 Aug 2025', status: 'none' },
              { clientId: 1, label: 'Last Maturity Date', date: '22 Sep 2030', status: 'green' },
              { clientId: 1, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
              { clientId: 2, label: 'Upcoming Quarterly Review', date: '25 Aug 2025', status: 'orange' },
              { clientId: 1, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
              { clientId: 2, label: 'Upcoming Annual Review', date: '20 Dec 2025', status: 'green' },
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
          };
          dispatch(setEngagementDetails(dummyData));
          dispatch(setError(err.message || 'Failed to fetch engagement details'));
        }
      },
    }),
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
  useGetLoanOutstandingDetailsQuery,
  useGetRevenueGraphDetailsQuery,
  useGetTotalProfitAndLossRelationshipDetailsQuery,
  useGetEngagementDetailsQuery,
} = dashboardApi;

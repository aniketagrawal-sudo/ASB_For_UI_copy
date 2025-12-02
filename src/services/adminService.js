import { setAdminKPIList } from '../redux/store/adminSlice';
import { api } from './api';

/**
 * Admin service API endpoints using Redux Toolkit Query
 * Provides endpoints for fetching admin-related data
 */
export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all personas for admin view
    getAdminPersonas: builder.query({
      query: (industryId) => ({
        url: '/api/admin/personas',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminPersonas'],
    }),

    // Fetch all BI dashboards for admin view
    getAdminBiDashboards: builder.query({
      query: (industryId) => ({
        url: '/api/admin/bi-dashboards',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminBiDashboards'],
    }),

    // Fetch all database tables for admin view
    getAdminDbTables: builder.query({
      query: (industryId) => ({
        url: '/api/admin/db-tables',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminDbTables'],
    }),

    // Fetch all users for admin view
    getAdminUsers: builder.query({
      query: (industryId) => ({
        url: '/api/admin/users',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminUsers'],
    }),

    // Get system status metrics
    getSystemStatus: builder.query({
      query: (industryId) => ({
        url: '/api/admin/system-status',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminSystemStatus'],
    }),

    // Get recent activity logs
    getRecentActivities: builder.query({
      query: (industryId) => ({
        url: '/api/admin/recent-activities',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminActivities'],
    }),

    // Create/Update persona
    updatePersona: builder.mutation({
      query: (data) => ({
        url: '/api/admin/personas',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminPersonas'],
    }),

    // Create/Update BI dashboard
    updateBiDashboard: builder.mutation({
      query: (data) => ({
        url: '/api/admin/bi-dashboards',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminBiDashboards'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/api/admin/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // Reset user access
    resetUserAccess: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/users/${userId}/reset`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // Get application config
    getAppConfig: builder.query({
      query: (industryId) => ({
        url: '/api/admin/config',
        method: 'GET',
        params: { industryId },
      }),
      transformResponse: (response) => response,
      providesTags: ['AdminConfig'],
    }),

    // Update application config
    updateAppConfig: builder.mutation({
      query: (data) => ({
        url: '/api/admin/config',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminConfig'],
    }),

     getAdminKPIDetails: builder.query({
          query: () => ({
            url: `/api/dashboard/adminKPIList`,
            method: 'GET',
          }),
    
          // --- Transform success responses ---
          transformResponse: (response) => {
            const dummyData = [
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
  ];
    
            // If response is NOT array → send dummy
            // if (!Array.isArray(response)) return dummyData;
    
            // If empty return dummy
            if (response.length === 0) return dummyData;
    
            return response; // Real API data
          },
    
          // Handle SUCCESS AND FAILURES
          async onQueryStarted(_, { dispatch, queryFulfilled }) {
            try {
              const { data } = await queryFulfilled; // already transformed
              dispatch(setAdminKPIList(data));
            } catch (err) {
              // Prepare fallback dummy
              const dummyData = [
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
  ];
              dispatch(setAdminKPIList(dummyData));
              dispatch(setError(err.message || 'Failed to fetch engagement details'));
            }
          },
        }),
  }),
});

// Export hooks for using the API endpoints
export const {
  useGetAdminPersonasQuery,
  useGetAdminBiDashboardsQuery,
  useGetAdminDbTablesQuery,
  useGetAdminUsersQuery,
  useGetSystemStatusQuery,
  useGetRecentActivitiesQuery,
  useUpdatePersonaMutation,
  useUpdateBiDashboardMutation,
  useUpdateUserMutation,
  useResetUserAccessMutation,
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,
  useGetAdminKPIDetailsQuery,
} = adminApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getOktaAccessToken, oktaLogout } from '../utils/okta';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: async (headers) => {
    // Add token to headers if available
    try {
      const token = await getOktaAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Failed to get Okta access token:', error);
    }

    return headers;
  },
});

const handleUnauthorized = async () => {
  try {
    // Okta SDK automatically handles token refresh
    // If we got a 401, the token might be invalid, so we'll try to get a fresh one
    const token = await getOktaAccessToken();
    if (token) {
      // Retry the original request with new token
      return { message: 'token refreshed' };
    }
    console.error('No token available after refresh attempt');
    return { error: { status: 401, data: 'Session expired. Please login again.' } };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return { error: { status: 401, data: 'Authentication error. Please login again.' } };
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions = {}) => {
    try {
      let result = await baseQuery(args, api, extraOptions);
      if (result?.error?.data?.status === 401) {
        let refreshedToken = await handleUnauthorized();
        if (refreshedToken.message === 'token refreshed') {
          result = await baseQuery(args, api, extraOptions);
        } else {
          throw refreshedToken;
        }
      }
      return result;
    } catch (err) {
      console.error('Auth error - logging out the user from app', err);
      try {
        await oktaLogout();
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
      }
    }
  },
  endpoints: () => ({}),
});

export const { useLazyQuery, useQuery, useMutation } = api;

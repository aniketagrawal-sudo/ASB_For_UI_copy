import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import keycloak from '../utils/keycloak';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: async (headers) => {
    // Add token to headers if available
    const token = keycloak.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const handleUnauthorized = async () => {
  try {
    // Attempt to refresh token if request fails with 401
    const refreshed = await keycloak.updateToken(20);
    if (refreshed && keycloak.token) {
      // Retry the original request with new token
      return { message: 'token refreshed' };
    }
    console.error('Token refresh failed or no token available');
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
      if (keycloak.isTokenExpired(5)) {
        //if the token about expire then update it
        await keycloak.updateToken(20);
      }
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
      console.error('auth error logging out the user from app', err);
      keycloak.logout();
    }
  },
  endpoints: () => ({}),
});

export const { useLazyQuery, useQuery, useMutation } = api;

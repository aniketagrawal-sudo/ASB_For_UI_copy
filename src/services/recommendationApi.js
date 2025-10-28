import { api } from './api';

export const recommendationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendedQuestions: builder.query({
      // The query will only run if both personaId and screenType are provided
      query: ({ personaId, screenType }) => ({
        url: `/api/recommendations`,
        params: { persona_id: personaId, screen_type: screenType },
      }),
      // Provide a default empty array if the API response is not in the expected format
      transformResponse: (response) => response || [],
    }),
  }),
});

export const { useGetRecommendedQuestionsQuery } = recommendationApi;


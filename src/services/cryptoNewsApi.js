import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const createRequest = (request) => {
  const headers = { 'x-rapidapi-host': 'bing-search-apis.p.rapidapi.com' };
  const rapidApiKey = process.env.REACT_APP_RAPIDAPI_KEY;
  if (rapidApiKey) headers['x-rapidapi-key'] = rapidApiKey;

  return { ...request, headers };
};

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://bing-search-apis.p.rapidapi.com' }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory, count }) => createRequest({
        url: '/api/rapid/news_search',
        params: {
          keyword: newsCategory,
          page: 1,
          size: count,
        },
      }),
      transformResponse: (response) => ({
        value: (response.data || []).map((article) => ({
          name: article.title,
          url: article.url,
          description: article.desc || '',
          image: article.img ? { thumbnail: { contentUrl: article.img } } : null,
          provider: article.source ? [{ name: article.source }] : [],
        })),
      }),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit//query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://coinranking1.p.rapidapi.com",
    prepareHeaders: (headers) => {
      const rapidApiKey = process.env.REACT_APP_RAPIDAPI_KEY;
      if (rapidApiKey) headers.set("X-RapidAPI-Key", rapidApiKey);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCryptos: builder.query({ query: (count) => `/coins?limit=${count}` }),
    getCryptoDetails: builder.query({ query: (coinId) => `/coin/${coinId}` }),
    getCryptoHistory: builder.query({
      query: ({ coinId, timeperiod }) =>
        `coin/${coinId}/history?timeperiod=${timeperiod}`,
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;

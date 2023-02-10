import { createApi, fetchBaseQuery } from "@reduxjs/toolkit//query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://coinranking1.p.rapidapi.com",
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        "c03b2b8081mshc3d6c7fca60178dp1f77f3jsnc6e0695beef9"
      );

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

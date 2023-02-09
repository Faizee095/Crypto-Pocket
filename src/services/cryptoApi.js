import { createApi ,fetchBaseQuery} from '@reduxjs/toolkit//query/react';

// const cryptoApiHeaders = {
//     'X-RapidAPI-Key': 'c03b2b8081mshc3d6c7fca60178dp1f77f3jsnc6e0695beef9',
// 	'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
// }

// const baseUrl = 'https://coinranking1.p.rapidapi.com';

// export const cryptoApi = createApi ({
//     reducerPath : 'cryptoApi',
//     baseQuery : fetchBaseQuery ({baseUrl}),
//     endpoints : (builder) => ({
//         getCryptos : builder.query({
//             query : () => '/exchanges'
//         })
//     })
// })

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
    }),
  });

  export const { useGetCryptosQuery } = cryptoApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  //define endpoints here
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => {
        return `products`;
      },
    }),
    getProducts: builder.query({
      query: (args) => {
        const { limit, page, sort, name } = args;
        return `products?sort=${sort}&limit=${limit}&page=${page}&name=${name}`;
      },
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductsQuery } = productsApi;

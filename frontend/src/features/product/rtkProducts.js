import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Products"],
  //define endpoints here
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => {
        return `products`;
      },
      providesTags: [{ type: "Products" }],
    }),
    getProducts: builder.query({
      query: (args) => {
        const { limit, page, sort, brand, rating, model } = args;
        return `products?sort=${sort}&limit=${limit}&page=${page}&brand=${brand}&rating=${rating}&model=${model}`;
      },
    }),
    addProduct: builder.mutation({
      query: (body) => {
        return {
          url: `admin/product`,
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: [{ type: "Products" }],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductsQuery, useAddProductMutation } = productsApi;

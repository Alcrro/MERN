import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://alcrro.onrender.com/api/" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getAllProductsV2: builder.query({
      query: () => {
        return "products";
      },
      providesTags: [{ type: "Products" }],
    }),
  }),
});

export const { useGetAllProductsQuery } = productsApi;

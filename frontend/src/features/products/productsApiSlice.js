import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
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

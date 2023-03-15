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

        const productBrand = brand.map((item) => {
          return `&brand=${item}`;
        });
        const stringBrand = productBrand.join("");

        const productModel = model.map((item) => {
          return `&model=${item}`;
        });
        const stringModel = productModel.join("");
        console.log(stringModel);

        return `products?sort=${sort}&limit=${limit}${stringBrand}&page=${page}${
          rating === "" ? "" : `rating=${rating}&`
        }${stringModel}`;
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

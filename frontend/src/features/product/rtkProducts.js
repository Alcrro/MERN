import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Products"],
  //define endpoints here
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => {
        return "products";
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
        // console.log(stringModel);

        const productRating = rating.map((item) => {
          return `&rating=${item}`;
        });
        // console.log(productRating);
        const stringRating = productRating.join("");

        return `products?sort=${sort}&limit=${limit}&page=${page}${stringModel}${stringBrand}${stringRating}
        `;
      },
      providesTags: [{ type: "Products" }],
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
      providesTags: [{ type: "Products" }],
    }),
    getSingleProduct: builder.query({
      query: (id) => {
        return `product/${id}`;
      },
      providesTags: [{ type: "Products" }],
    }),
    updateProduct: builder.mutation({
      query: (body) => {
        return {
          url: `api/product`,
          method: "PUT",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: [{ type: "Products" }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `api/product/${id}`,
          method: "DELETE",
        };
      },
      providesTags: [{ type: "Products" }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductsQuery,
  useAddProductMutation,
  useGetSingleProductQuery,
} = productsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["Products", "Reviews", "Categories"],
  endpoints: (builder) => ({
    /* ── Categories ── */
    getCategories: builder.query({
      query: () => "categories",
      providesTags: [{ type: "Categories" }],
      keepUnusedDataFor: 3600, // cache 1 oră — categoriile se schimbă rar
    }),

    /* ── Products ── */
    getAllProducts: builder.query({
      query: () => "products",
      providesTags: [{ type: "Products" }],
    }),
    getProducts: builder.query({
      query: ({ limit, page, sort, brand, rating, model, availability = [], stocare = [], ram = [], culoare = [] }) => {
        const q = [
          `sort=${sort}`,
          `limit=${limit}`,
          `page=${page}`,
          ...model.map((m) => `model=${encodeURIComponent(m)}`),
          ...brand.map((b) => `brand=${encodeURIComponent(b)}`),
          ...rating.map((r) => `rating=${r}`),
          ...availability.map((a) => `availability=${encodeURIComponent(a)}`),
          ...stocare.map((s) => `stocare=${encodeURIComponent(s)}`),
          ...ram.map((r) => `ram=${encodeURIComponent(r)}`),
          ...culoare.map((c) => `culoare=${encodeURIComponent(c)}`),
        ].join("&");
        return `products?${q}`;
      },
      providesTags: [{ type: "Products" }],
    }),
    getSingleProduct: builder.query({
      query: (id) => `product/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: "admin/product",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
    updateProduct: builder.mutation({
      query: (body) => ({
        url: "api/product",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products" }],
    }),

    /* ── Reviews ── */
    getReviews: builder.query({
      query: (productId) => `product/${productId}/reviews`,
      providesTags: (result, error, productId) => [{ type: "Reviews", id: productId }],
    }),
    addReview: builder.mutation({
      query: ({ productId, value, comment }) => ({
        url: `product/${productId}/reviews`,
        method: "POST",
        body: { value, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        { type: "Products" },
      ],
    }),
    deleteReview: builder.mutation({
      query: ({ reviewId, productId }) => ({
        url: `reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        { type: "Products" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllProductsQuery,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = productsApi;

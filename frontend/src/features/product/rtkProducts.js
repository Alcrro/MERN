import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["Products", "Reviews", "Categories", "Sellers"],
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
      query: ({ limit, page, sort, brand, rating, model, availability = [], stocare = [], ram = [], culoare = [], kind = "", tip = "", tips = [] }) => {
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
          ...(kind ? [`kind=${encodeURIComponent(kind)}`] : []),
          ...(tips.length ? tips.map((t) => `tip=${encodeURIComponent(t.toLowerCase().replace(/\s+/g, '-'))}`) : tip ? [`tip=${encodeURIComponent(tip.toLowerCase().replace(/\s+/g, '-'))}`] : []),
        ].join("&");
        return `products?${q}`;
      },
      providesTags: [{ type: "Products" }],
    }),
    getSingleProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getProductBySku: builder.query({
      query: (sku) => `products/sku/${sku}`,
      providesTags: (result, error, sku) => [{ type: "Products", id: sku }],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: "admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
    updateProduct: builder.mutation({
      query: (body) => ({
        url: "admin/products",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products" }],
    }),

    /* ── Sellers ── */
    getSellers: builder.query({
      query: (catalogRef) => `products/sellers/${catalogRef}`,
      providesTags: (result, error, catalogRef) => [{ type: "Sellers", id: catalogRef }],
    }),

    /* ── Reviews ── */
    getReviews: builder.query({
      query: (productId) => `products/${productId}/reviews`,
      providesTags: (result, error, productId) => [{ type: "Reviews", id: productId }],
    }),
    addReview: builder.mutation({
      query: ({ productId, value, comment }) => ({
        url: `products/${productId}/reviews`,
        method: "POST",
        body: { value, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        { type: "Products" },
      ],
    }),
    /* ── Ecosystem ── */
    getEcosystem: builder.query({
      query: (tip) => `ecosystem/${encodeURIComponent(tip)}`,
      keepUnusedDataFor: 3600,
    }),
    configureEcosystem: builder.mutation({
      query: (body) => ({
        url: "ecosystem/configure",
        method: "POST",
        body,
      }),
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
  useGetProductBySkuQuery,
  useGetSellersQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetEcosystemQuery,
  useConfigureEcosystemMutation,
} = productsApi;

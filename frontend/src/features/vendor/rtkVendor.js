import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["VendorProducts", "VendorOrders", "VendorAnalytics", "VendorMe", "VendorPublic", "VendorReviews"],
  endpoints: (builder) => ({
    applyAsVendor: builder.mutation({
      query: (body) => ({ url: "vendor/apply", method: "POST", body }),
    }),
    getVendorMe: builder.query({
      query: () => "vendor/me",
      providesTags: ["VendorMe"],
    }),
    getVendorProducts: builder.query({
      query: ({ page = 1, limit = 20, status } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.set("status", status);
        return `vendor/products?${params}`;
      },
      providesTags: ["VendorProducts"],
    }),
    createVendorProduct: builder.mutation({
      query: (body) => ({ url: "vendor/products", method: "POST", body }),
      invalidatesTags: ["VendorProducts", "VendorAnalytics"],
    }),
    updateVendorProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `vendor/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["VendorProducts"],
    }),
    deleteVendorProduct: builder.mutation({
      query: (id) => ({ url: `vendor/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["VendorProducts", "VendorAnalytics"],
    }),
    publishVendorProduct: builder.mutation({
      query: (id) => ({ url: `vendor/products/${id}/publish`, method: "PUT" }),
      invalidatesTags: ["VendorProducts", "VendorAnalytics"],
    }),
    getVendorOrders: builder.query({
      query: () => "vendor/orders",
      providesTags: ["VendorOrders"],
    }),
    updateVendorProfile: builder.mutation({
      query: (body) => ({ url: "vendor/profile", method: "PUT", body }),
      invalidatesTags: ["VendorMe"],
    }),
    getVendorAnalytics: builder.query({
      query: () => "vendor/analytics",
      providesTags: ["VendorAnalytics"],
    }),

    // Public vendor profile
    getPublicVendor: builder.query({
      query: (vendorId) => `vendor/public/${vendorId}`,
      providesTags: (result, error, vendorId) => [{ type: "VendorPublic", id: vendorId }],
    }),
    getPublicVendorProducts: builder.query({
      query: ({ vendorId, page = 1, limit = 12 }) =>
        `vendor/public/${vendorId}/products?page=${page}&limit=${limit}`,
      providesTags: (result, error, { vendorId }) => [{ type: "VendorPublic", id: `${vendorId}-products` }],
    }),
    getVendorReviews: builder.query({
      query: (vendorId) => `vendor/public/${vendorId}/reviews`,
      providesTags: (result, error, vendorId) => [{ type: "VendorReviews", id: vendorId }],
    }),
    addVendorReview: builder.mutation({
      query: ({ vendorId, value, comment }) => ({
        url: `vendor/public/${vendorId}/reviews`,
        method: "POST",
        body: { value, comment },
      }),
      invalidatesTags: (result, error, { vendorId }) => [
        { type: "VendorReviews", id: vendorId },
        { type: "VendorPublic", id: vendorId },
      ],
    }),
  }),
});

export const {
  useApplyAsVendorMutation,
  useGetVendorMeQuery,
  useUpdateVendorProfileMutation,
  useGetVendorProductsQuery,
  useCreateVendorProductMutation,
  useUpdateVendorProductMutation,
  useDeleteVendorProductMutation,
  usePublishVendorProductMutation,
  useGetVendorOrdersQuery,
  useGetVendorAnalyticsQuery,
  useGetPublicVendorQuery,
  useGetPublicVendorProductsQuery,
  useGetVendorReviewsQuery,
  useAddVendorReviewMutation,
} = vendorApi;

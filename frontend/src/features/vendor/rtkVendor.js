import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["VendorProducts", "VendorOrders", "VendorAnalytics", "VendorMe"],
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
    getVendorOrders: builder.query({
      query: () => "vendor/orders",
      providesTags: ["VendorOrders"],
    }),
    getVendorAnalytics: builder.query({
      query: () => "vendor/analytics",
      providesTags: ["VendorAnalytics"],
    }),
  }),
});

export const {
  useApplyAsVendorMutation,
  useGetVendorMeQuery,
  useGetVendorProductsQuery,
  useCreateVendorProductMutation,
  useUpdateVendorProductMutation,
  useDeleteVendorProductMutation,
  useGetVendorOrdersQuery,
  useGetVendorAnalyticsQuery,
} = vendorApi;

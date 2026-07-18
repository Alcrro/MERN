import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["PendingVendors", "PendingListings", "AdminOrders"],
  endpoints: (builder) => ({
    getAdminVendors: builder.query({
      query: () => "admin/vendors",
      providesTags: ["PendingVendors"],
    }),
    getAdminPendingVendors: builder.query({
      query: () => "admin/vendors/pending",
      providesTags: ["PendingVendors"],
    }),
    approveVendor: builder.mutation({
      query: ({ id, action, reason }) => ({
        url: `admin/vendors/${id}`,
        method: "PUT",
        body: { action, reason },
      }),
      invalidatesTags: ["PendingVendors"],
    }),
    getAdminPendingListings: builder.query({
      query: ({ page = 1, limit = 20 } = {}) =>
        `admin/products/pending?page=${page}&limit=${limit}`,
      providesTags: ["PendingListings"],
    }),
    approveListing: builder.mutation({
      query: ({ id, action, reason }) => ({
        url: `admin/products/${id}/status`,
        method: "PUT",
        body: { action, reason },
      }),
      invalidatesTags: ["PendingListings"],
    }),
    getAllOrders: builder.query({
      query: ({ status, page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.set("status", status);
        return `orders/admin/all?${params}`;
      },
      providesTags: ["AdminOrders"],
    }),
    assignOrderVendor: builder.mutation({
      query: ({ id, vendorId }) => ({
        url: `orders/admin/${id}/vendor`,
        method: "PUT",
        body: { vendorId },
      }),
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useGetAdminVendorsQuery,
  useGetAdminPendingVendorsQuery,
  useApproveVendorMutation,
  useGetAdminPendingListingsQuery,
  useApproveListingMutation,
  useGetAllOrdersQuery,
  useAssignOrderVendorMutation,
} = adminApi;

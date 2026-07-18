import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const voucherApi = createApi({
  reducerPath: "voucherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/vouchers/`,
    credentials: "include",
  }),
  tagTypes: ["Vouchers", "MyVouchers", "VendorRule"],
  endpoints: (builder) => ({
    validateVoucher: builder.mutation({
      query: (body) => ({ url: "validate", method: "POST", body }),
    }),
    listVouchers: builder.query({
      query: () => "",
      providesTags: ["Vouchers"],
    }),
    createVoucher: builder.mutation({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Vouchers"],
    }),
    toggleVoucher: builder.mutation({
      query: (id) => ({ url: `${id}/toggle`, method: "PATCH" }),
      invalidatesTags: ["Vouchers"],
    }),
    getMyVouchers: builder.query({
      query: () => "my",
      providesTags: ["MyVouchers"],
    }),
    getVendorRule: builder.query({
      query: () => "vendor-rule",
      providesTags: ["VendorRule"],
    }),
    upsertVendorRule: builder.mutation({
      query: (body) => ({ url: "vendor-rule", method: "PUT", body }),
      invalidatesTags: ["VendorRule"],
    }),
  }),
});

export const {
  useValidateVoucherMutation,
  useListVouchersQuery,
  useCreateVoucherMutation,
  useToggleVoucherMutation,
  useGetMyVouchersQuery,
  useGetVendorRuleQuery,
  useUpsertVendorRuleMutation,
} = voucherApi;

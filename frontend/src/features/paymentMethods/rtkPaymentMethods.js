import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentMethodsApi = createApi({
  reducerPath: "paymentMethodsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/payment-methods/`,
    credentials: "include",
  }),
  tagTypes: ["PaymentMethods"],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query({
      query: () => "",
      providesTags: [{ type: "PaymentMethods" }],
    }),

    setupIntent: builder.mutation({
      query: () => ({
        url: "setup",
        method: "POST",
      }),
    }),

    deletePaymentMethod: builder.mutation({
      query: (pmId) => ({
        url: pmId,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PaymentMethods" }],
    }),

    setDefaultPaymentMethod: builder.mutation({
      query: (pmId) => ({
        url: `${pmId}/default`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "PaymentMethods" }],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useSetupIntentMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} = paymentMethodsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => "orders",
      providesTags: [{ type: "Orders" }],
    }),

    getOrder: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    createOrder: builder.mutation({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders" }],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Orders" }],
    }),
    getOrderPayIntent: builder.query({
      query: (id) => `orders/${id}/pay-intent`,
      keepUnusedDataFor: 0,
    }),

    confirmPayment: builder.mutation({
      query: (id) => ({ url: `orders/${id}/confirm-payment`, method: "POST" }),
      invalidatesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetOrderPayIntentQuery,
  useConfirmPaymentMutation,
} = ordersApi;

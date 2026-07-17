import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shopCardApi = createApi({
  reducerPath: "shopCardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/shop-card/`,
    credentials: "include",
  }),
  tagTypes: ["ShopCard", "CardTransactions"],
  endpoints: (builder) => ({
    getMyCard: builder.query({
      query: () => "my",
      providesTags: [{ type: "ShopCard" }],
    }),

    getCardTransactions: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => `transactions?page=${page}&limit=${limit}`,
      providesTags: [{ type: "CardTransactions" }],
    }),

    topUpCredits: builder.mutation({
      query: (body) => ({
        url: "top-up",
        method: "POST",
        body,
      }),
    }),

    redeemPoints: builder.mutation({
      query: (body) => ({
        url: "redeem-points",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ShopCard" }, { type: "CardTransactions" }],
    }),

    applyReferral: builder.mutation({
      query: (body) => ({
        url: "referral/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ShopCard" }, { type: "CardTransactions" }],
    }),
  }),
});

export const {
  useGetMyCardQuery,
  useGetCardTransactionsQuery,
  useTopUpCreditsMutation,
  useRedeemPointsMutation,
  useApplyReferralMutation,
} = shopCardApi;

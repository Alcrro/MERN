import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/newsletter/`,
  }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "subscribe",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;

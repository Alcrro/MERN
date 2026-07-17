import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "auth/me",
    }),
    updateMe: builder.mutation({
      query: (body) => ({
        url: "auth/me",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = authApi;

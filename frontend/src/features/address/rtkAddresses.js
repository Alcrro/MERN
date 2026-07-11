import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/`,
    credentials: "include",
  }),
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => "addresses",
      providesTags: [{ type: "Addresses" }],
    }),

    addAddress: builder.mutation({
      query: (body) => ({
        url: "addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Addresses" }],
    }),

    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Addresses" }],
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Addresses" }],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;

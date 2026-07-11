import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL || ""}/api/catalog`,
    credentials: "include",
  }),
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    listCatalog: builder.query({
      query: ({ kind, tip, brand, page = 1, limit = 24 } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (kind)  params.set("kind", kind);
        if (tip)   params.set("tip", tip);
        if (brand) params.set("brand", brand);
        return `all?${params}`;
      },
      providesTags: ["Catalog"],
    }),
    searchCatalog: builder.query({
      query: ({ q, kind, limit } = {}) => {
        const params = new URLSearchParams({ q });
        if (kind) params.set("kind", kind);
        if (limit) params.set("limit", limit);
        return `?${params}`;
      },
      providesTags: ["Catalog"],
    }),
    createCatalogEntry: builder.mutation({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Catalog"],
    }),
    updateCatalogEntry: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: "PUT", body }),
      invalidatesTags: ["Catalog"],
    }),
    deleteCatalogEntry: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Catalog"],
    }),
  }),
});

export const {
  useListCatalogQuery,
  useSearchCatalogQuery,
  useCreateCatalogEntryMutation,
  useUpdateCatalogEntryMutation,
  useDeleteCatalogEntryMutation,
} = catalogApi;

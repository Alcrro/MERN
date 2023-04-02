// import { createEntityAdapter } from "@reduxjs/toolkit";
// import { apiSlice } from "../api/apiProductSlice";

// const productsAdapter = createEntityAdapter({
//   sortComparer: (a, b) => a.brand.localeCompare(b.brand),
// });

// const initialState = productsAdapter.getInitialState({});

// export const extendedApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: () => "products",
//       transformResponse: (responseData) => {
//         const loadedProducts = responseData?.queryProducts.map((product) => {
//           return product;
//         });
//         return productsAdapter.setAll(initialState, loadedProducts);
//       },
//       providesTags: [{ type: "Products" }],
//     }),
//   }),
// });

// export const { useGetAllProductsQuery } = extendedApiSlice;

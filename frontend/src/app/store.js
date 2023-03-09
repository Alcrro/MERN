import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import postProductReducer from "../features/product/postProductSlice";
import postAddProductCategoryReducer from "../features/productCategory/postAddProductCategorySlice";
const { productsApi } = require("../features/product/rtkProducts");

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    product: postProductReducer,
    productCategory: postAddProductCategoryReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
});
export default store;

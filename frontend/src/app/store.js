import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import postProductReducer from "../features/product/postProductSlice";
import postProductCategoryReducer from "../features/productCategory/postAddProductCategorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    product: postProductReducer,
  },
});
export default store;

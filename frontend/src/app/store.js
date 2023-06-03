import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/fetchProducts/productSlice";
import postProductReducer from "../features/product/postProductSlice";
import postAddProductCategoryReducer from "../features/productCategory/postAddProductCategorySlice";
import { productsApi } from "../features/product/rtkProducts";
import addToCardSliceReducer from "../features/product/addToCardSlice";
import addToCartReducer from "../features/product/addToCart/addToCartSlice";
import cardsViewSlice from "../features/buttons/buttonsSlice";
import hoverLinkReducer from "../features/cartModal/cartModalSlice";
import menuDepartmentReducer from "../features/menu-department/menuDepartmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    product: postProductReducer,
    addToCard: addToCardSliceReducer,
    addToCart: addToCartReducer,
    cardsView: cardsViewSlice,
    hoverLink: hoverLinkReducer,
    menuDepartment: menuDepartmentReducer,
    productCategory: postAddProductCategoryReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
});

export default store;

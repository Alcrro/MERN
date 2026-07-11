import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/fetchProducts/productSlice";
import postProductReducer from "../features/product/postProductSlice";
import postAddProductCategoryReducer from "../features/productCategory/postAddProductCategorySlice";
import { productsApi } from "../features/product/rtkProducts";
import { ordersApi } from "../features/order/rtkOrders";
import { addressesApi } from "../features/address/rtkAddresses";
import { vendorApi } from "../features/vendor/rtkVendor";
import { uploadApi } from "../features/upload/rtkUpload";
import { adminApi } from "../features/admin/rtkAdmin";
import { catalogApi } from "../features/catalog/rtkCatalog";
import addToCardSliceReducer from "../features/product/addToCardSlice";
import addToCartReducer from "../features/product/addToCart/addToCartSlice";
import cardsViewSlice from "../features/buttons/buttonsSlice";
import hoverLinkReducer from "../features/cartModal/cartModalSlice";
import menuDepartmentReducer from "../features/menu-department/menuDepartmentSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

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
    favorites: favoritesReducer,
    productCategory: postAddProductCategoryReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(addressesApi.middleware)
      .concat(vendorApi.middleware)
      .concat(uploadApi.middleware)
      .concat(adminApi.middleware)
      .concat(catalogApi.middleware),
});

export default store;

# SETUP CART SLICE

- application feature
- create feature folder/cart
- create cartSlice.js

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
});

console.log(cartSlice);

export default cartSlice.reducer;
```

- store.js

```js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";

export const store = configureStore({
  reducer: {
		"cart" is a key, can use what ever you want
		"cartReducer" is constant from cartSlice.js
    cart: cartReducer,
  },
});
```

# INSTALL REDUX DEVTOOLS

- chrome web store extensions
- install Redux DevTools

import { createSlice, current } from "@reduxjs/toolkit";
import produce from "immer";
const initialState = {
  card: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.card.findIndex((item) => item.data._id === action.payload.data._id);

      if (itemIndex >= 0) {
        state.card[itemIndex].itemQuantity += 1;
        state.card[itemIndex].itemAmountPrice =
          action.payload.data.price * state.card[itemIndex].itemQuantity;
      } else {
        const tempProduct = {
          ...action.payload,
          itemQuantity: 1,
          itemAmountPrice: action.payload.data.price,
        };
        state.card.push(tempProduct);
      }
    },
    removeFromCart: (state, action) => {
      const index = state.card.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.cart.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

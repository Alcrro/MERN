import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  card: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  message: null,
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

      // create an array of all items
      const itemsWithPrice = state.card.map((item) => item);

      // calculate price
      const totalPrice = itemsWithPrice.reduce((sum, num) => sum + num.itemAmountPrice, 0);
      const totalQuantity = itemsWithPrice.reduce((sum, num) => sum + num.itemQuantity, 0);
      state.cartTotalAmount = totalPrice;
      state.cartTotalQuantity = totalQuantity;
    },

    removeSingleCart: (state, action) => {
      const cartItem = state.card.findIndex((item) => item.data._id === action.payload.data._id);
      if (state.card[cartItem].itemQuantity > 1) {
        state.card[cartItem].itemQuantity -= 1;
        state.card[cartItem].itemAmountPrice =
          action.payload.data.price * state.card[cartItem].itemQuantity;
        state.cartTotalAmount = state.card.reduce((sum, num) => sum + num.itemAmountPrice, 0);
      } else if (state.card[cartItem].itemQuantity === 1) {
        state.card.splice(cartItem, 1);
      }
      state.cartTotalQuantity = state.card.reduce((sum, num) => sum + num.itemQuantity, 0);
      state.cartTotalAmount = state.card.reduce((sum, num) => sum + num.itemAmountPrice, 0);
    },

    removeFromCart: (state, action) => {
      const cartItem = state.card.findIndex((item) => item.data._id === action.payload.data._id);
      state.card.splice(cartItem, 1);
      state.cartTotalQuantity = state.card.reduce((sum, num) => sum + num.itemQuantity, 0);
      state.cartTotalAmount = state.card.reduce((sum, num) => sum + num.itemAmountPrice, 0);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, removeSingleCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const KEY = "alcrro-cart";

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? { card: [], cartTotalQuantity: 0, cartTotalAmount: 0 }; }
  catch { return { card: [], cartTotalQuantity: 0, cartTotalAmount: 0 }; }
};

const save = (state) => {
  localStorage.setItem(KEY, JSON.stringify({
    card: state.card,
    cartTotalQuantity: state.cartTotalQuantity,
    cartTotalAmount: state.cartTotalAmount,
  }));
};

const initialState = { ...load(), message: null };

const recalc = (state) => {
  state.cartTotalQuantity = state.card.reduce((s, i) => s + i.itemQuantity, 0);
  state.cartTotalAmount   = state.card.reduce((s, i) => s + i.itemAmountPrice, 0);
  save(state);
};

const resolvePrice = (data) =>
  data.price ?? data.minPrice ?? data.variants?.[0]?.price ?? 0;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const price = resolvePrice(action.payload.data);
      const idx = state.card.findIndex((i) => i.data._id === action.payload.data._id);
      if (idx >= 0) {
        state.card[idx].itemQuantity  += 1;
        state.card[idx].itemAmountPrice = price * state.card[idx].itemQuantity;
      } else {
        state.card.push({ ...action.payload, itemQuantity: 1, itemAmountPrice: price });
      }
      recalc(state);
    },

    removeSingleCart: (state, action) => {
      const price = resolvePrice(action.payload.data);
      const idx = state.card.findIndex((i) => i.data._id === action.payload.data._id);
      if (idx < 0) return;
      if (state.card[idx].itemQuantity > 1) {
        state.card[idx].itemQuantity  -= 1;
        state.card[idx].itemAmountPrice = price * state.card[idx].itemQuantity;
      } else {
        state.card.splice(idx, 1);
      }
      recalc(state);
    },

    removeFromCart: (state, action) => {
      const idx = state.card.findIndex((i) => i.data._id === action.payload.data._id);
      if (idx >= 0) state.card.splice(idx, 1);
      recalc(state);
    },

    clearCart: (state) => {
      state.card = [];
      recalc(state);
    },
  },
});

export const { addToCart, removeFromCart, removeSingleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

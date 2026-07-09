import { createSlice } from "@reduxjs/toolkit";

const KEY = "alcrro-favorites";

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: load() },
  reducers: {
    toggleFavorite: (state, action) => {
      const id  = action.payload._id;
      const idx = state.items.findIndex((p) => p._id === id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem(KEY, JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem(KEY);
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

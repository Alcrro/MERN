import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardViewList: false,
  cardViewListClassName: "card-v2-list",
  cardViewGrid: true,
  cardViewGridClassName: "card-v2-grid",
};

export const cardsViewSlice = createSlice({
  name: "cardView",
  initialState,
  reducers: {
    cardViewList: (state) => {
      state.cardViewList = true;
      state.cardViewListClassName = "card-v2-list";
      state.cardViewGrid = false;
      state.cardViewGridClassName = "";
    },
    cardViewGrid: (state) => {
      state.cardViewList = false;
      state.cardViewListClassName = "";
      state.cardViewGrid = true;
      state.cardViewGridClassName = "card-v2-grid";
    },
  },
});

export const { cardViewGrid, cardViewList } = cardsViewSlice.actions;
export default cardsViewSlice.reducer;

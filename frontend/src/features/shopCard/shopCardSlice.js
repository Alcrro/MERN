import { createSlice } from "@reduxjs/toolkit";

const shopCardSlice = createSlice({
  name: "shopCard",
  initialState: { creditsToUse: 0 },
  reducers: {
    setCreditsToUse: (state, action) => { state.creditsToUse = action.payload; },
    clearCreditsToUse: (state) => { state.creditsToUse = 0; },
  },
});

export const { setCreditsToUse, clearCreditsToUse } = shopCardSlice.actions;
export const selectCreditsToUse = (state) => state.shopCard.creditsToUse;
export default shopCardSlice.reducer;

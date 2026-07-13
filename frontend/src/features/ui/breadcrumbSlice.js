import { createSlice } from "@reduxjs/toolkit";

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: { lastLabel: null },
  reducers: {
    setLastLabel: (state, { payload }) => { state.lastLabel = payload; },
    clearLastLabel: (state) => { state.lastLabel = null; },
  },
});

export const { setLastLabel, clearLastLabel } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;

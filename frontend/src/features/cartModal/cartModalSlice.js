import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hovering: true,
  className: "active",
};

export const hoverLinkSlice = createSlice({
  name: "hoverLink",
  initialState,
  reducers: {
    isHovering: (state, action) => {
      state.hovering = true;
      state.className = "active";
    },
    notHovering: (state, action) => {
      state.hovering = false;
      state.className = "inactive";
    },
  },
});

export const { isHovering, notHovering } = hoverLinkSlice.actions;

export default hoverLinkSlice.reducer;

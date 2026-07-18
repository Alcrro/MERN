import { createSlice } from "@reduxjs/toolkit";

const discountSlice = createSlice({
  name: "discount",
  initialState: {
    // null | { code, scope, type, value, discount, eligibleProductIds[], description }
    voucher:    null,
    useCredits: false,
    usePoints:  false,
  },
  reducers: {
    setVoucher:    (state, { payload }) => { state.voucher = payload; },
    clearVoucher:  (state) => { state.voucher = null; },
    setUseCredits: (state, { payload }) => { state.useCredits = payload; },
    setUsePoints:  (state, { payload }) => { state.usePoints  = payload; },
    clearDiscount: (state) => {
      state.voucher    = null;
      state.useCredits = false;
      state.usePoints  = false;
    },
  },
});

export const { setVoucher, clearVoucher, setUseCredits, setUsePoints, clearDiscount } = discountSlice.actions;
export default discountSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postProductService from "./postProductService";

const initialState = {
  product: [
    {
      name: "",
      price: "",
      description: "",
    },
  ],
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
};

// add Product
export const addProduct = createAsyncThunk("product/addProduct", async (product, thunkAPI) => {
  try {
    return await postProductService.createProduct(product);
  } catch (error) {
    const message =
      (error.response && error.response.data.message && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Add product
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});
export const { reset } = productSlice.actions;
export default productSlice.reducer;

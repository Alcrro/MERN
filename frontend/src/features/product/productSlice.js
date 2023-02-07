import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (products, thunkAPI) => {
    try {
      return await productService.getAllProducts(products);
    } catch (error) {
      const message =
        (error.response && error.response.data.message && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// add Product
export const addProduct = createAsyncThunk("products/addProduct", async (product, thunkAPI) => {
  try {
    return await productService.createProduct(product);
  } catch (error) {
    const message =
      (error.response && error.response.data.message && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const productSlice = createSlice({
  name: "products",
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
    // Get all products
    builder.addCase(getAllProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.products = action.payload;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    // Add product
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productCategoryService from "./productCategoryService";

const initialState = {
  productCategories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const postAddProductCategory = createAsyncThunk(
  "productCategory/postAddProductCategory",
  async (productCategory, thunkAPI) => {
    try {
      return await productCategoryService.postAddProductCategory(productCategory);
    } catch (error) {
      const message =
        (error.response && error.response.data.message && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postAddProductCategorySlice = createSlice({
  name: "productCategory/postAddProductCategory",
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
    builder.addCase(postAddProductCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postAddProductCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.productCategories = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(postAddProductCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = postAddProductCategory.actions;

export default postAddProductCategory.reducer;

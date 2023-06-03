import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import menuDepartmentService from "./menuDepartmentService";
import { useDispatch } from "react-redux";

const initialState = {
  menuDepartment: [],
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
  className: "",
  selected: {},
};

export const getMenuDepartment = createAsyncThunk(
  "menuDepartment/getMenuDepartmentCategory",
  async (categories, thunkAPI) => {
    try {
      return menuDepartmentService.getMenuDepartmentCategory(categories);
    } catch (error) {
      const message =
        (error.response && error.response.data.message && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const menuDepartmentSlice = createSlice({
  name: "menuDepartment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMenuDepartment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMenuDepartment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.menuDepartment = action.payload;
    });
    builder.addCase(getMenuDepartment.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = "Nu mere";
    });
  },
});

export const getAllCategories = (state) => state.menuDepartment.menuDepartment;
export const getSelected = (state) => state.selected;

export default menuDepartmentSlice.reducer;

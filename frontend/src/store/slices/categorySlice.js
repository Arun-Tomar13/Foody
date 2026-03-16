import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCategoryApi,
  bulkUploadApi,
  deleteCategoryApi,
  getAllCategoriesByRestroIdApi,
  getCategoryByIdApi,
  updateCategoryApi,
} from "../../lib/api/categoryApi";
import { toast } from "react-toastify";


const initialState = {
  category: null,
  categoryList: [],
  error: null,
  loading: null,
};

export const addCategory = createAsyncThunk(
  "category/create",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await addCategoryApi(data);
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const bulkUpload = createAsyncThunk(
  "category/bulk-upload",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await bulkUploadApi(data);
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await updateCategoryApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getCategoryInfoById = createAsyncThunk(
  "category/getbyid",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await getCategoryByIdApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getAllCategories = createAsyncThunk(
  "category/get-all",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());

    const res = await getAllCategoriesByRestroIdApi(data);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const removeCategory = createAsyncThunk(
  "category/delete",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await deleteCategoryApi(data);
    // console.log(data);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          toast.success(action.payload.message);
          state.categoryList.push(action.payload.data[0]);
        } else {
          state.error = action.payload;
        }
      })
      .addCase(addCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(bulkUpload.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(bulkUpload.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.success) {
          toast.success(action.payload.message);
          action.payload.data.forEach((data) => {
            state.categoryList.push(data);
          });
        } else {
          state.error = action.payload;
        }
      })
      .addCase(bulkUpload.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          toast.success(action.payload.message);
          state.categoryList = state.categoryList.filter(
            (r) => r.id != action.payload.data,
          );
        } else {
          state.error = action.payload;
        }
      })
      .addCase(removeCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          toast.success(action.payload.message);
          state.categoryList = state.categoryList.map((item) => {
            return item.id == action.payload.data[0].id
              ? {
                  ...item,
                  name: action.payload.data[0].name,
                  description: action.payload.data[0].description,
                  isAvailable: action.payload.data[0].isAvailable,
                }
              : item;
          });
        } else {
          state.error = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCategoryInfoById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCategoryInfoById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.category = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getCategoryInfoById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.categoryList = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;

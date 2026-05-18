import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuItemApi,
  deleteMenuItemApi,
  getMenuByIdApi,
  updateMenuApi,
  getAllMenuApi,
  BulkMenuAddApi,
} from "../../lib/api/menuApi";

const initialState = {
  menuList: [],
  totalMenu: null,
  menuItem: null,
  error: null,
  loading: null,
};

export const addMenu = createAsyncThunk(
  "menu/create",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await addMenuItemApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);
export const bulkMenuAdd = createAsyncThunk(
  "menu/bulk",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await BulkMenuAddApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const updateMenu = createAsyncThunk(
  "menu/update",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await updateMenuApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getAllMenu = createAsyncThunk(
  "menu/all",
  async (data = "", { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());

    const res = await getAllMenuApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }

    return res.data;
  },
);

export const getMenuItemById = createAsyncThunk(
  "menu/get",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    console.log("item id", data);

    const res = await getMenuByIdApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    console.log("item data", res.data);

    return res.data;
  },
);

export const removeMenu = createAsyncThunk(
  "menu/get-all",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());

    const res = await deleteMenuItemApi(data);
    console.log(res);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenu.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.menuList.push(action.payload.data)
          state.totalMenu = state.totalMenu + 1
        } else {
          state.error = action.payload
        }
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bulkMenuAdd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkMenuAdd.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) {
          state.error = action.payload
        }
      })
      .addCase(bulkMenuAdd.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.menuList = state.menuList.map((item) => {
            return item.id == action.payload.data[0].id
              ? {
                  ...item,
                  name: action.payload.data[0].name,
                  price: action.payload.data[0].price,
                  description: action.payload.data[0].description,
                  type: action.payload.data[0].type,
                  image: action.payload.data[0].image,
                  isAvailable: action.payload.data[0].isAvailable,
                }
              : item;
          });
        } else {
          state.error = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMenu.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          ((state.menuList = state.menuList.filter(
            (item) => item.id != action.payload.data,
          )),
            (state.totalMenu = state.totalMenu - 1));
        } else {
          state.error = action.payload;
        }
      })
      .addCase(removeMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMenu.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.menuList = action.payload.data.menu,
            state.totalMenu = action.payload.data.totalMenu;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAllMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuItemById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.menuItem = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;

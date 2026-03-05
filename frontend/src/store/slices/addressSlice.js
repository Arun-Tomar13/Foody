import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addAddressApi,
  getAddressByUserIdApi,
  removeAddressByIdApi,
} from "../../lib/api/addressApi";

export const addAddress = createAsyncThunk(
  "address/add",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await addAddressApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const getAddressByUserId = createAsyncThunk(
  "address/get",
  async (data = "", { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await getAddressByUserIdApi();
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const removeAddressById = createAsyncThunk(
  "address/removebyId",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await removeAddressByIdApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

const initialState = {
  addressList: [],
  error: null,
  loading: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        
        if (action.payload.success) {
          state.addressList.push(action.payload.data);
        } else {
          state.error = action.payload;
        }
      })
      .addCase(addAddress.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeAddressById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(removeAddressById.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.addressList = state.addressList.filter(
            (item) => item.id != action.payload.data,
          );
        } else {
          state.error = action.payload;
        }
      })
      .addCase(removeAddressById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAddressByUserId.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAddressByUserId.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.addressList = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAddressByUserId.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default addressSlice.reducer;

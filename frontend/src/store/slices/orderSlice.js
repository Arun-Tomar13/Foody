import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addOrderApi,
  generateOrdersCSVApi,
  getAllOrdersApi,
  getOrderItemByIdApi,
} from "../../lib/api/orderApi";

export const createOrder = createAsyncThunk(
  "order/create",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await addOrderApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    console.log(res.data);
    
    return res.data;
  },
);

export const getAllOrder = createAsyncThunk(
  "order/get",
  async (data = "", { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await getAllOrdersApi();
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getOrderItemById = createAsyncThunk(
  "order/getbyId",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await getOrderItemByIdApi(data);
    // dispatch(stopLoading());

    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const generateCSVOdOrders = createAsyncThunk(
  "order/csv",
  async (data = "", { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await generateOrdersCSVApi();
    // dispatch(stopLoading());

    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

const initialState = {
  total: 0,
  numberOfItems: 0,
  orderList: [],
  orderItemList: [],
  downloadLink: null,
  error: null,
  loading: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success == false) {
          state.error = action.payload;
        }
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.orderList = action.payload.data;
          state.numberOfItems = action.payload.data.length;
          state.total = action.payload.data.reduce((sum, item) => {
            return sum + item.total;
          }, 0);
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAllOrder.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getOrderItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderItemById.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.data);
        
        if (action.payload.success) {
          state.orderItemList = action.payload.data;
          state.numberOfItems = action.payload.data.length;
          state.total = action.payload.data.reduce((sum, item) => {
            return (sum + (item.price * item.quantity));
          }, 0);
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getOrderItemById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(generateCSVOdOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCSVOdOrders.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.downloadLink = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(generateCSVOdOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addItemInCart,
  getAllItemInCart,
  decreaseItemInCart,
  deleteAllItemInCart,
} from "../../lib/api/cartApi";
import { toast } from "react-toastify";

export const addCartItem = createAsyncThunk(
  "cart/create",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    const res = await addItemInCart(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const getAllCart = createAsyncThunk(
  "cart/getAll",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await getAllItemInCart();
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const decreaseCartItem = createAsyncThunk(
  "cart/decrease",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await decreaseItemInCart(data);
    console.log(res);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const deleteAllCartItem = createAsyncThunk(
  "cart/deleteAll",
  async (data = "", { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await deleteAllItemInCart();

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

const initialState = {
  total: 0,
  numberOfItems: 0,
  itemList: [],
  error: null,
  loading: null,
  successMessage:null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage=null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        if (action.payload.success) {
          toast.success(action.payload.message)
          if (action.payload.data.updated) {
            state.itemList = state.itemList.map((item) => {
              if (item.id == action.payload.data.newCartItem[0].id) {
                state.total += item.price;
                return { ...item, quantity: item.quantity + 1 };
              } else return item;
            });
          } else {
            state.itemList.push(action.payload.data.newCartItem[0]);
            state.numberOfItems += 1;
            state.total += action.payload.data.newCartItem[0].price;
          }
        } else {
          state.error = action.payload;
        }
      })
      .addCase(addCartItem.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllCart.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.itemList = action.payload.data;
          state.total = action.payload.data.reduce((sum, item) => {
            return sum + item.price * item.quantity;
          }, 0);
          state.numberOfItems = action.payload.data.length;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAllCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAllCartItem.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteAllCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.itemList = [];
          state.total = 0;
          state.numberOfItems = 0;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(deleteAllCartItem.rejected, (state) => {
        state.loading = false;
      })
      .addCase(decreaseCartItem.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
      })
      .addCase(decreaseCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.successMessage=action.payload.message
          if (action.payload.data.del == 0) {
            state.itemList = state.itemList.map((item) => {
              if (action.payload.data.id == item.id) {
                state.total -= item.price;
                return { ...item, quantity: item.quantity - 1 };
              } else return item;
            });
          } else {
            state.itemList = state.itemList.filter((item) => {
              if (action.payload.data.id != item.id) {
                return item;
              } else {
                state.total -= item.price;
              }
            });
            state.numberOfItems -= 1;
          }
        } else {
          state.error = action.payload;
        }
      })
      .addCase(decreaseCartItem.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createRestaurantApi,
  getAllRestauarntsApi,
  getRestauarntInfoByIdApi,
  MenuPerRestaurantApi,
  orderAndRevenuePerRestaurantApi,
  removeRestaurantApi,
  removeRestaurantByIdApi,
  revenuePerRestaurantApi,
  toggleAvailabilty,
  updateRestaurantApi,
} from "../../lib/api/restaurantApi";
import { toast } from "react-toastify";

const initialState = {
  restaurant: null,
  restaurantList: [],
  error: null,
  loading: null,
  hasRestro:null
};

export const addRestaurant = createAsyncThunk(
  "restaurant/create",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await createRestaurantApi(data);
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const MenuPerRestaurant = createAsyncThunk(
  "restaurant/countmenu",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await MenuPerRestaurantApi(data);
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const orderAndRevenuePerRestaurant = createAsyncThunk(
  "restaurant/order-revenue",
  async (data, { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await orderAndRevenuePerRestaurantApi(data);
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const revenuePerRestaurant = createAsyncThunk(
  "restaurant/revenue",
  async (data = "", { rejectWithValue, dispatch, fulfillWithValue }) => {
    // dispatch(startLoading());
    // const res = await createRestaurantByAnyoneApi(data);
    const res = await revenuePerRestaurantApi();
    console.log("Res ", res);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;

    // return null;
  },
);

export const updateRestaurant = createAsyncThunk(
  "restaurant/update",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await updateRestaurantApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const changeRestaurantAvailability = createAsyncThunk(
  "restaurant/toggle",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await toggleAvailabilty(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getRestaurantInfoById = createAsyncThunk(
  "restaurant/getbyid",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await getRestauarntInfoByIdApi(data);
    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);
// export const getRestaurantInfo = createAsyncThunk(
//   "restaurant/get",
//   async (data, { rejectWithValue, dispatch }) => {
//     // dispatch(startLoading());
//     const res = await getRestauarntInfoApi();
//     // dispatch(stopLoading());
//     if (res.error) {

//       return rejectWithValue(res.error);
//     }
//     return res.data;
//   }
// );

export const getAllRestaurant = createAsyncThunk(
  "restaurant/get-all",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await getAllRestauarntsApi();
    console.log(res);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

// export const removeRestaurant = createAsyncThunk(
//   "restaurant/delete",
//   async (data, { rejectWithValue, dispatch }) => {
//     // dispatch(startLoading());
//     const res = await removeRestaurantApi(data);
//     // console.log(data);

//     // dispatch(stopLoading());
//     if (res.error) {
//       return rejectWithValue(res.error);
//     }
//     return res.data;
//   },
// );

export const removeRestaurantById = createAsyncThunk(
  "restaurant/deletebyid",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    const res = await removeRestaurantByIdApi(data);
    // console.log("id",data);
    console.log(res);

    // dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          toast.success(action.payload.message);
          state.restaurantList.push(action.payload.data[0]);
          state.restaurant = action.payload.data[0];
        } else {
          state.error = action.payload;
        }
      })
      .addCase(addRestaurant.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRestaurantById.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          toast.success(action.payload.message);
          state.restaurantList = state.restaurantList.filter(
            (r) => r.id != action.payload.data,
          );
        } else {
          state.error = action.payload;
        }
      })
      .addCase(removeRestaurantById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          toast.success(action.payload.message);
          state.restaurant = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(updateRestaurant.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getRestaurantInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurantInfoById.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          
          state.restaurant = action.payload.data;
          state.hasRestro = action.payload.data ? true : false
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getRestaurantInfoById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(MenuPerRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MenuPerRestaurant.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          // state.menuCount = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(MenuPerRestaurant.rejected, (state) => {
        state.loading = false;
      })
      .addCase(orderAndRevenuePerRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderAndRevenuePerRestaurant.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          // state.menuCount = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(orderAndRevenuePerRestaurant.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRestaurant.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.restaurantList = action.payload.data;
        } else {
          state.error = action.payload;
        }
      })
      .addCase(getAllRestaurant.rejected, (state) => {
        state.loading = false;
      })
      .addCase(changeRestaurantAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeRestaurantAvailability.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          toast.success(state.restaurant.isOpen ? 'restaurant is closed' : 'restaurant is now open');
          state.restaurant.isOpen = !state.restaurant.isOpen;
          state.restaurantList = state.restaurantList.map((restaurant) => {
            return restaurant.id == action.payload.data
              ? { ...restaurant, isOpen: !restaurant.isOpen }
              : restaurant;
          });
        } else {
          state.error = action.payload;
        }
      })
      .addCase(changeRestaurantAvailability.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default restaurantSlice.reducer;

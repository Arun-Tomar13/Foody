import {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  logout,
  getRestaurantOwnerWhoNotHaveRestroApi,
} from "../../lib/api/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./commonSlice";

const initialState = {
  user: null,
  restaurant_owner_not_have_restaurant:[],
  error: null,
  loading: null,
};

const authErrorMessages = ["invalid token", "Unauthorized user"];

const isAuthError = (payload) =>
  authErrorMessages.includes(payload?.message);

const clearStoredAuth = () => {
  localStorage.removeItem("Bearer");
};

export const addUser = createAsyncThunk(
  "user/create",
  async (data, { rejectWithValue, dispatch }) => {
    // dispatch(startLoading());
    console.log(data);

    const res = await register(data);
    // dispatch(stopLoading());
    console.log(res);
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue, dispatch }) => {
    const res = await login(data);
    if (res.error) {
      return rejectWithValue(res.error);
    }

    return res.data;
  },
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (data = "", { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    const res = await logout(data);
    dispatch(stopLoading());
    if (res.error) {
      return rejectWithValue(res.error);
    }
    return res.data;
  },
);

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    const res = await getUserProfile();

    dispatch(stopLoading());

    if (res.error) {
      return rejectWithValue(res.error);
    }

    return res.data;
  },
);

export const getRestaurantOwnerWhoNotHaveRestro = createAsyncThunk(
  "user/restaurant_owner_not_have_restaurant",
  async (data=null, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    const res = await getRestaurantOwnerWhoNotHaveRestroApi();

    dispatch(stopLoading());

    if (res.error) {
      return rejectWithValue(res.error);
    }

    return res.data;
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    const res = await updateUserProfile(data);
    dispatch(stopLoading());

    if (res.error) {
      return rejectWithValue(res.error);
    }

    return res.data;
  },
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) state.error = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        if(action.payload.success){
          state.user=null
          clearStoredAuth();
        }
        else {
          if (isAuthError(action.payload)) {
            state.user = null;
            clearStoredAuth();
          }

          state.error = action.payload;
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        if (isAuthError(action.payload)) {
          state.user = null;
          clearStoredAuth();
        }
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data.updatedUser[0];
          localStorage.setItem(
            "Bearer",
            JSON.stringify(action.payload.data.accessToken),
          );
        } else state.error = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data[0];
        } else {
          if (isAuthError(action.payload)) {
            state.user = null;
            clearStoredAuth();
          }

          state.error = action.payload;
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        if (isAuthError(action.payload)) {
          state.user = null;
          clearStoredAuth();
        }
        state.error = action.payload;
      })
      .addCase(getRestaurantOwnerWhoNotHaveRestro.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getRestaurantOwnerWhoNotHaveRestro.fulfilled, (state, action) => {
        state.loading = false;
        
        action.payload.success
          ? (state.restaurant_owner_not_have_restaurant = action.payload.data)
          : (state.error = action.payload);
      })
      .addCase(getRestaurantOwnerWhoNotHaveRestro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data[0];
        } else state.error = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = UserSlice.actions;
export default UserSlice.reducer;

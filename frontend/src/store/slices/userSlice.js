import {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  logout,
} from "../../lib/api/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./commonSlice";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  error: null,
  loading: null,
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.success) state.error = action.payload;
        else toast.success(action.payload.message);
      })
      .addCase(addUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.success
          ? toast.success(action.payload.message)
          : (state.error = action.payload);
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data.updatedUser[0];
          toast.success(action.payload.message);
          localStorage.setItem(
            "Bearer",
            JSON.stringify(action.payload.data.accessToken),
          );
        } else state.error = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProfile.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.success
          ? (state.user = action.payload.data[0])
          : (state.error = action.payload);
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data[0];
          toast.success(action.payload.message);
        } else state.error = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { createUser, searchUser } = UserSlice.actions;
export default UserSlice.reducer;

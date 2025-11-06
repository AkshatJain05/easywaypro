import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

//  Helper to handle API errors safely
const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === "Network Error") {
    return "Network error: Please check your internet connection.";
  }
  return "Something went wrong. Please try again.";
};

// ---------------------- Thunks ----------------------

//  Fetch current logged-in user
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

//  Login (user)
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

//  Admin login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
    return null;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// ---------------------- Slice ----------------------

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    initialized: false,
    error: null, // ✅ to store error messages
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Fetch User ----
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.status = "failed";
        state.initialized = true;
        state.error = action.payload;
      })

      // ---- Login ----
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload;
      })

      // ---- Admin Login ----
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload;
      })

      // ---- Logout ----
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

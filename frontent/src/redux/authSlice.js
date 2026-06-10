import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

// ---------------- ERROR HANDLER ----------------
const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === "Network Error") {
    return "Network error: Please check your internet connection.";
  }
  return "Something went wrong. Please try again.";
};

// ---------------- FETCH USER ----------------
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

// ---------------- LOGIN ----------------
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      return res.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------------- ADMIN LOGIN ----------------
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password,
      });

      return res.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------------- LOGOUT ----------------
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      return null;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ---------------- SLICE ----------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,

    // ✅ FAKE TOKEN (for UI only, not real JWT)
    token: null,

    status: "idle",
    initialized: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------- FETCH USER ----------------
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;

        // ✅ cookie session exists → set fake token flag
        state.token = "cookie-session";
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = "failed";
        state.initialized = true;
      })

      // ---------------- LOGIN ----------------
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = "cookie-session"; // ✅ simulate login
        state.status = "succeeded";
      })

      // ---------------- ADMIN LOGIN ----------------
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = "cookie-session"; // ✅ same system
        state.status = "succeeded";
      })

      // ---------------- LOGOUT ----------------
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
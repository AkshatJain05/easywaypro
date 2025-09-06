import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
  return res.data.user;
});


export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const res = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data.user;
});

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }) => {
    const res = await axios.post(
      `${API_URL}/auth/admin/login`,
      { email, password },
      { withCredentials: true }
    );
    return res.data.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    initialized: false, // NEW: marks if fetchUser has been attempted
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = "loading"; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.status = "failed";
        state.initialized = true;
      })
       .addCase(login.pending, (state) => { state.status = "loading"; })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.status = "failed";
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.initialized = true;
      })
      .addCase(adminLogin.rejected, (state) => {
        state.user = null;
        state.status = "failed";
      });
  },
});

export default authSlice.reducer;

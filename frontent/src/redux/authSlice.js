import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
  return res.data.user;
});


export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const res = await axios.post(
    "http://localhost:8000/api/auth/login",
    { email, password },
    { withCredentials: true }
  );
  return res.data.user;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
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
      });
  },
});

export default authSlice.reducer;

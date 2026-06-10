import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

// ------------------ helper ------------------
const handleError = (err) => {
  return err.response?.data?.message || 'Something went wrong'
}

// ------------------ USERS ------------------
export const fetchAllUsers = createAsyncThunk(
  'admin/users',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`)

      // 🔥 FIX: backend might return array OR object
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

// ------------------ PURCHASES ------------------
export const fetchAllPurchases = createAsyncThunk(
  'admin/purchases',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/course/purchases`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

// ------------------ REVENUE ------------------
export const fetchRevenue = createAsyncThunk(
  'admin/revenue',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/course/revenue`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

// ------------------ ATTENDANCE ------------------
export const fetchAttendanceSessions = createAsyncThunk(
  'admin/attendance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/course/attendance/sessions`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

export const createAttendanceSession = createAsyncThunk(
  'admin/createAttendance',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/course/attendance/session`,
        data
      )
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

export const toggleAttendanceSession = createAsyncThunk(
  'admin/toggleSession',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/attendance/session/${id}/toggle`
      )
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

// ------------------ CERTIFICATE ------------------
export const issueCertificate = createAsyncThunk(
  'admin/issueCert',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/certificates/issue`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(handleError(err))
    }
  }
)

// ------------------ SLICE ------------------
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    revenuePerCourse: [],
    monthlyRevenue: [],
    purchases: [],
    users: [],
    sessions: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ---------------- USERS ----------------
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false

        // 🔥 FIX: safe fallback
        state.users =
          action.payload?.users ||
          action.payload?.data ||
          action.payload ||
          []
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.users = []
      })

      // ---------------- PURCHASES ----------------
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases =
          action.payload?.purchases ||
          action.payload ||
          []
      })

      // ---------------- REVENUE ----------------
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.stats = action.payload?.stats || null
        state.revenuePerCourse = action.payload?.revenuePerCourse || []
        state.monthlyRevenue = action.payload?.monthlyRevenue || []
      })

      // ---------------- SESSIONS ----------------
      .addCase(fetchAttendanceSessions.fulfilled, (state, action) => {
        state.sessions =
          action.payload?.sessions ||
          action.payload ||
          []
      })

      .addCase(createAttendanceSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload?.session)
      })

      .addCase(toggleAttendanceSession.fulfilled, (state, action) => {
        const updated = action.payload?.session
        const idx = state.sessions.findIndex((x) => x._id === updated?._id)
        if (idx !== -1) state.sessions[idx] = updated
      })
  },
})

export default adminSlice.reducer
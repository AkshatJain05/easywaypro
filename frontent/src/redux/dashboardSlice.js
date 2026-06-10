import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchMyAttendance = createAsyncThunk(
  'dashboard/attendance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard/attendance`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchMyCertificates = createAsyncThunk(
  'dashboard/certificates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard/certificates`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const markAttendance = createAsyncThunk(
  'dashboard/markAttendance',
  async (pollCode, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/attendance/mark`, {
        pollCode,
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    purchases: [],
    attendance: [],
    certificates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchDashboard.fulfilled, (s, { payload }) => {
        s.loading = false
        s.purchases = payload.purchases
      })
      .addCase(fetchDashboard.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })
      .addCase(fetchMyAttendance.fulfilled, (s, { payload }) => {
        s.attendance = payload.sessions
      })
      .addCase(fetchMyCertificates.fulfilled, (s, { payload }) => {
        s.certificates = payload.certificates
      })
  },
})

export default dashboardSlice.reducer
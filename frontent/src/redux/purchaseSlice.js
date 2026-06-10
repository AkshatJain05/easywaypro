import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const createOrder = createAsyncThunk(
  'purchase/createOrder',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/purchase/create-order`, {
        courseId,
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const verifyPayment = createAsyncThunk(
  'purchase/verify',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/purchase/verify`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchReceipt = createAsyncThunk(
  'purchase/receipt',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/purchase/receipt/${id}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const updateProgress = createAsyncThunk(
  'purchase/updateProgress',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/purchase/progress`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const renewCourse = createAsyncThunk(
  'purchase/renew',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/purchase/renew`, {
        courseId,
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: {
    order: null,
    receipt: null,
    loading: false,
    error: null,
    paymentSuccess: false,
    lastPurchase: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.paymentSuccess = false
      state.order = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (s) => {
        s.loading = true
        s.error = null
      })
      .addCase(createOrder.fulfilled, (s, { payload }) => {
        s.loading = false
        s.order = payload
      })
      .addCase(createOrder.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(verifyPayment.pending, (s) => {
        s.loading = true
      })
      .addCase(verifyPayment.fulfilled, (s, { payload }) => {
        s.loading = false
        s.paymentSuccess = true
        s.lastPurchase = payload.purchase
      })
      .addCase(verifyPayment.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(fetchReceipt.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchReceipt.fulfilled, (s, { payload }) => {
        s.loading = false
        s.receipt = payload.purchase
      })
      .addCase(fetchReceipt.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })
  },
})

export const { resetPayment } = purchaseSlice.actions
export default purchaseSlice.reducer
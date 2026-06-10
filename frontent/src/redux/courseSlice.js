import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString()
      const res = await axios.get(`${BASE_URL}/courses?${query}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchPublicCourses = createAsyncThunk(
  'courses/fetchPublic',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString()
      const res = await axios.get(`${BASE_URL}/courses/public?${query}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchCourse = createAsyncThunk(
  'courses/fetchOne',
  async (id, { rejectWithValue }) => {
    // 1. Validation: Prevent the request if ID is missing or invalid
    if (!id || id === 'undefined') {
      return rejectWithValue('Invalid Course ID provided');
    }

    try {
      const res = await axios.get(`${BASE_URL}/courses/${id}`);
      return res.data;
    } catch (err) {
      // 2. Handle specific 401/404 errors
      const message = err.response?.data?.message || 'Failed to fetch course';
      
      // Optional: Redirect to login if unauthorized
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
      
      return rejectWithValue(message);
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/courses`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/courses/${id}`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/courses/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const fetchAdminCourses = createAsyncThunk(
  'courses/adminAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/courses/admin/all`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    current: null,
    adminCourses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchCourses.fulfilled, (s, { payload }) => {
        s.loading = false
        s.courses = payload.courses
      })
      .addCase(fetchCourses.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(fetchPublicCourses.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchPublicCourses.fulfilled, (s, { payload }) => {
        s.loading = false
        s.courses = payload.courses
      })
      .addCase(fetchPublicCourses.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(fetchCourse.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchCourse.fulfilled, (s, { payload }) => {
        s.loading = false
        s.current = payload.course
      })
      .addCase(fetchCourse.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      .addCase(fetchAdminCourses.fulfilled, (s, { payload }) => {
        s.adminCourses = payload.courses
      })

      .addCase(createCourse.fulfilled, (s, { payload }) => {
        s.adminCourses.unshift(payload.course)
      })

      .addCase(updateCourse.fulfilled, (s, { payload }) => {
        const idx = s.adminCourses.findIndex(
          (c) => c._id === payload.course._id
        )
        if (idx !== -1) s.adminCourses[idx] = payload.course
      })

      .addCase(deleteCourse.fulfilled, (s, { payload }) => {
        s.adminCourses = s.adminCourses.filter((c) => c._id !== payload)
      })
  },
})

export const { clearCurrent } = courseSlice.actions
export default courseSlice.reducer




import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import courseReducer from './courseSlice.js'
import purchaseReducer from './purchaseSlice.js'
import dashboardReducer from './dashboardSlice.js'
import adminReducer from './adminSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    purchase: purchaseReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
  },
})

export default store
import { configureStore } from '@reduxjs/toolkit'
import  authReducer  from './authSlice'
import orderReducer from './orderSlice'
import userReducer from './userSlice'
import productReducer from './productSlice'


export const store = configureStore({
  reducer: {
    auth : authReducer,
    order : orderReducer,
    user : userReducer,
    product : productReducer
  },
})
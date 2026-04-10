import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

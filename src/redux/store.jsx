import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice';
import authReducer from './authSlice';  // Assuming you have an authSlice

const store = configureStore({
  reducer: {
    video: videoReducer,
    auth: authReducer,  // Add the auth slice
  },
});

export default store;

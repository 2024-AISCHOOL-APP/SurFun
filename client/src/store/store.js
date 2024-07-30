import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import favoritesReducer from './slices/favoritesSlices.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import postsReducer from './postsSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
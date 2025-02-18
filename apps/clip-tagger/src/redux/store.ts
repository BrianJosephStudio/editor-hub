import { configureStore } from '@reduxjs/toolkit';
import clipUploadReducer from './slices/clipUpload.slice';

export const store = configureStore({
  reducer: {
    clipUpload: clipUploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

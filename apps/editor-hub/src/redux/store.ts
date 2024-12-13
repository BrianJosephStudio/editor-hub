import { configureStore } from '@reduxjs/toolkit';
import fileTreeReducer from './slices/FileTreeSlice';
import videoGalleryReducer from './slices/VideoGallerySlice'
import tagsReducer from './slices/TagsSlice'

const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    videoGallery: videoGalleryReducer,
    tags: tagsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>; // Infer the root state type
export type AppDispatch = typeof store.dispatch; // Infer the dispatch type

export default store;

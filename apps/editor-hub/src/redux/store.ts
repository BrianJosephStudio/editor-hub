import { configureStore } from '@reduxjs/toolkit';
import fileTreeReducer from './slices/FileTreeSlice';
import videoGalleryReducer from './slices/VideoGallerySlice'
import audioGalleryReducer from './slices/AudioGallerySlice'
import tagsReducer from './slices/TagsSlice'

const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    videoGallery: videoGalleryReducer,
    audioGallery: audioGalleryReducer,
    tags: tagsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>; // Infer the root state type
export type AppDispatch = typeof store.dispatch; // Infer the dispatch type

export default store;

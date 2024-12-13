import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

interface VideoGalleryState {
    settings: {
        fetchUpfront: number
    }
    currentVideoSource: FileTreeNode | null
}

const initialState: VideoGalleryState = {
    settings: {
        fetchUpfront: 2
    },
    currentVideoSource: null
};

const videoGallerySettingsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        setNewVideoSource(state, action: PayloadAction<FileTreeNode>) {
            state.currentVideoSource = action.payload
        },
        setFetchUpfront(state, action: PayloadAction<number>) {
            state.settings.fetchUpfront = action.payload;
        },
    },
});

export const { setFetchUpfront, setNewVideoSource } = videoGallerySettingsSlice.actions;

export default videoGallerySettingsSlice.reducer;

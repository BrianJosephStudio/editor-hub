import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

interface AudioGalleryState {
    currentAudioSource: FileTreeNode | null
}

const initialState: AudioGalleryState = {
    currentAudioSource: null
};

const audioGallerySettingsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        setNewAudioSource(state, action: PayloadAction<FileTreeNode>) {
            state.currentAudioSource = action.payload
        },
    },
});

export const { setNewAudioSource } = audioGallerySettingsSlice.actions;

export default audioGallerySettingsSlice.reducer;

import { Metadata } from '@editor-hub/dropbox-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClipUploadSlice {
    patchFolders: Metadata[]
}

const initialState: ClipUploadSlice = {
    patchFolders: []
};

export const counterSlice = createSlice({
    name: 'clip-upload',
    initialState,
    reducers: {
        setPatchFolders: (state, action: PayloadAction<Metadata[]>) => {state.patchFolders = action.payload}
    },
});

export const { setPatchFolders } = counterSlice.actions;

export default counterSlice.reducer;

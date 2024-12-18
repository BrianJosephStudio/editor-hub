import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

const initialState: {
    inGameFootageFileTree: FileTreeNode
    soundTrackFileTree: FileTreeNode
} = {
    inGameFootageFileTree: {
        name: "root",
        tag: "folder",
        path: "/",
        filtered: false,
        children: [],
    },
    soundTrackFileTree: {
        name: "root",
        tag: "folder",
        path: "/",
        filtered: false,
        children: [],
    }
};

const fileTreeSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        setNewInGameFootageTree(state, action: PayloadAction<FileTreeNode>) {
            state.inGameFootageFileTree = action.payload;
        },
        setNewSoundTrackTree(state, action: PayloadAction<FileTreeNode>) {
            state.soundTrackFileTree = action.payload;
        },
    },
});

export const {
    setNewInGameFootageTree,
    setNewSoundTrackTree,
} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;

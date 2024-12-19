import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

const initialState: {
    inGameFootageFileTree: FileTreeNode
    musicTrackFileTree: FileTreeNode
    sfxFileTree: FileTreeNode
} = {
    inGameFootageFileTree: {
        name: "root",
        tag: "folder",
        path: "/",
        filtered: false,
        children: [],
    },
    musicTrackFileTree: {
        name: "root",
        tag: "folder",
        path: "/",
        filtered: false,
        children: [],
    },
    sfxFileTree: {
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
        setNewMusicTrackTree(state, action: PayloadAction<FileTreeNode>) {
            state.musicTrackFileTree = action.payload;
        },
        setNewSfxTrackTree(state, action: PayloadAction<FileTreeNode>) {
            state.sfxFileTree = action.payload;
        },
    },
});

export const {
    setNewInGameFootageTree,
    setNewMusicTrackTree,
    setNewSfxTrackTree,
} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;

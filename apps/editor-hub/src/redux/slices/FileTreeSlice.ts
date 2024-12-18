import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

const initialState: {
    initialInGameFootageFetchDone: boolean;
    initialSoundTrackFetchDone: boolean;
    inGameFootageFileTree: FileTreeNode
    soundTrackFileTree: FileTreeNode
} = {
    initialInGameFootageFetchDone: false,
    initialSoundTrackFetchDone: false,
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
        setInitialInGameFootageFetchDone(state) {
            state.initialInGameFootageFetchDone = true
        },
        setNewSoundTrackTree(state, action: PayloadAction<FileTreeNode>) {
            state.soundTrackFileTree = action.payload;
        },
        setInitialSoundTrackFetchDone(state) {
            state.initialSoundTrackFetchDone = true
        }
    },
});

export const {
    setNewInGameFootageTree,
    setInitialInGameFootageFetchDone,
    setNewSoundTrackTree,
    setInitialSoundTrackFetchDone
} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;

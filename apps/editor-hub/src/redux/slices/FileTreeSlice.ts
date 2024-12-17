import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

const initialState: { initialFetchDone: boolean; fileTree: FileTreeNode } = {
    initialFetchDone: false,
    fileTree: {
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
        setNewTree(state, action: PayloadAction<FileTreeNode>) {
            state.fileTree = action.payload;
        },
        setInitialFetchDone(state){
            state.initialFetchDone = true
        }
    },
});

export const { setNewTree, setInitialFetchDone} = fileTreeSlice.actions;

export default fileTreeSlice.reducer;

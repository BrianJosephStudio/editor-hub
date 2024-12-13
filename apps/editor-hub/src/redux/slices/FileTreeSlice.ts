import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileTreeNode } from '../../types/app';

const initialState: { fileTree: FileTreeNode } = {
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
    },
});

export const { setNewTree } = fileTreeSlice.actions;

export default fileTreeSlice.reducer;

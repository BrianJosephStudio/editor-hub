import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
    activeTags: string[]
    filterByTags: boolean
}

const initialState: TagsState = {
    activeTags: ["m002"],
    filterByTags: false
};

const tagsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        toggleFilterByTags(state) {
            state.filterByTags = !state.filterByTags
        },
        setActiveTags(state, action: PayloadAction<string[]>) {
            state.activeTags = action.payload;
        },
    },
});

export const { toggleFilterByTags, setActiveTags } = tagsSlice.actions;

export default tagsSlice.reducer;

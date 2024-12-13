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
        addActiveTag(state, action: PayloadAction<string>) {
            const tagIsAlreadyAdded = state.activeTags.find(entry => entry === action.payload)
            if(tagIsAlreadyAdded) return;
            state.activeTags.push(action.payload);
        },
        removeActiveTag(state, action: PayloadAction<string>) {
            const tagIndex = state.activeTags.findIndex(entry => entry === action.payload)
            if(tagIndex === -1) return;
            state.activeTags.slice(tagIndex, 1);
        },
    },
});

export const { toggleFilterByTags, addActiveTag, removeActiveTag } = tagsSlice.actions;

export default tagsSlice.reducer;

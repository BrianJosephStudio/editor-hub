import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TagObject } from '../../types/tags';

interface TagsState {
    activeTags: TagObject[]
    filterByTags: boolean
}

const initialState: TagsState = {
    activeTags: [],
    filterByTags: false
};

const tagsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        toggleFilterByTags(state) {
            state.filterByTags = !state.filterByTags
        },
        addActiveTag(state, action: PayloadAction<TagObject>) {
            const tagIsAlreadyAdded = state.activeTags.find(entry => entry.id === action.payload.id)
            if(tagIsAlreadyAdded) return;
            const newTags = [...state.activeTags]
            newTags.push(action.payload);
            state.activeTags = newTags
        },
        removeActiveTag(state, action: PayloadAction<TagObject>) {
            const tagIndex = state.activeTags.findIndex(entry => entry.id === action.payload.id)
            if(tagIndex === -1) return;
            const newTags = state.activeTags.filter(tag => tag.id !== action.payload.id)
            state.activeTags = newTags
        },
    },
});

export const { toggleFilterByTags, addActiveTag, removeActiveTag } = tagsSlice.actions;

export default tagsSlice.reducer;

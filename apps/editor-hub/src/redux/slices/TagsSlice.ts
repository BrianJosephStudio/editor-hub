import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TagObject, TagSystem } from '../../types/tags';

interface TagsState {
    genericTags: TagSystem
    activeTags: TagObject[]
    filterByTags: boolean
}

const initialState: TagsState = {
    genericTags: {},
    activeTags: [],
    filterByTags: false
};

const tagsSlice = createSlice({
    name: 'file tree',
    initialState,
    reducers: {
        setGenericTags(state, action: PayloadAction<TagSystem>) {
            state.genericTags = action.payload
        },
        toggleFilterByTags(state) {
            state.filterByTags = !state.filterByTags
        },
        addActiveTag(state, action: PayloadAction<TagObject>) {
            const tagIsAlreadyAdded = state.activeTags.find(entry => entry.id === action.payload.id)
            if (tagIsAlreadyAdded) return;
            const newTags = [...state.activeTags]
            newTags.push(action.payload);
            state.activeTags = newTags
        },
        removeActiveTag(state, action: PayloadAction<TagObject>) {
            const tagIndex = state.activeTags.findIndex(entry => entry.id === action.payload.id)
            if (tagIndex === -1) return;
            const newTags = state.activeTags.filter(tag => tag.id !== action.payload.id)
            state.activeTags = newTags
        },
    },
});

export const { toggleFilterByTags, addActiveTag, removeActiveTag, setGenericTags } = tagsSlice.actions;

export default tagsSlice.reducer;

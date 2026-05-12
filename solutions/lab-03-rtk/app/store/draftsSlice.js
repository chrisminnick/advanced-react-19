import { createSlice } from '@reduxjs/toolkit';

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: { items: [] },
  reducers: {
    // Action names describe transitions, not setters. (immer is on under
    // the hood, so direct mutation is safe inside reducers.)
    addDraft: (state, action) => {
      state.items.push(action.payload);
    },
    removeDraft: (state, action) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { addDraft, removeDraft, clear } = draftsSlice.actions;
export default draftsSlice.reducer;

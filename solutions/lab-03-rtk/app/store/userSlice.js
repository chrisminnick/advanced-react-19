import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { current: null },
  reducers: {
    setUser: (state, action) => {
      state.current = action.payload;
    },
    clearUser: (state) => {
      state.current = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

// Selectors. createSelector would be overkill here — these are O(1) reads.
export const selectUser = (s) => s.user.current;
export const selectUserName = (s) => s.user.current?.name ?? 'guest';
export const selectUserEmail = (s) => s.user.current?.email ?? null;

export default userSlice.reducer;

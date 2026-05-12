import { configureStore } from '@reduxjs/toolkit';
import drafts from './draftsSlice.js';
import ui from './uiSlice.js';
import user from './userSlice.js';

// One store, three slices. Lab 4 grows this with `createApi` for posts/me
// (RTK Query); for now, server state stays out of Redux entirely.
export const store = configureStore({
  reducer: { drafts, ui, user },
});

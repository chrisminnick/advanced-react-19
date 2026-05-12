import { create } from 'zustand';

// Tiny store for the signed-in user. Hydrated once by the home loader so the
// leaf components can read `currentUser` without prop-drilling. Lab 4 will
// replace this with a TanStack Query `useQuery({ queryKey: ['me'] })` that
// also handles refresh-on-focus, retries, and so on.
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

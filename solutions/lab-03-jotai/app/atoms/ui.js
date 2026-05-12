import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Theme persists to localStorage in a single line.
export const themeAtom = atomWithStorage('theme', 'light');
export const sidebarOpenAtom = atomWithStorage('sidebarOpen', false);

// Derived: convenience selector. Components that just need to know "are we
// dark?" subscribe to this and miss the inverse update.
export const isDarkAtom = atom((get) => get(themeAtom) === 'dark');

// Write-only toggles
export const toggleThemeAtom = atom(null, (get, set) => {
  set(themeAtom, get(themeAtom) === 'light' ? 'dark' : 'light');
});

export const openSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, true);
});

export const closeSidebarAtom = atom(null, (get, set) => {
  set(sidebarOpenAtom, false);
});

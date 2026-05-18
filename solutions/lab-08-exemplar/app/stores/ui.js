import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// UI store. Theme + sidebar persist to localStorage so a refresh preserves them.
export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: false,
        toggleTheme: () =>
          set(
            (s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }),
            false,
            'ui/toggleTheme'
          ),
        openSidebar: () => set({ sidebarOpen: true }, false, 'ui/openSidebar'),
        closeSidebar: () =>
          set({ sidebarOpen: false }, false, 'ui/closeSidebar'),
      }),
      { name: 'ui-store' }
    ),
    { name: 'ui' }
  )
);

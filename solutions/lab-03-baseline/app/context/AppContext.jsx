import { createContext, useCallback, useContext, useState } from 'react';

// THE BLOAT.
//
// Twelve values shoved into a single context. Every consumer that calls
// useContext(AppContext) re-renders when ANY of these changes — including
// when the theme toggles or when a new notification arrives.
//
// Mixed in here:
//   - Server state (`posts`, `notifications`)         ← shouldn't be in client store at all
//   - Cross-cutting client state (`theme`, `sidebarOpen`, `drafts`)  ← legitimate, needs a real store
//   - Per-request stuff (`user`)                       ← belongs to the auth/loader, not state
//
// Lab 3's job: tear this apart.

const AppContext = createContext(null);

export function AppProvider({ children, initialUser, initialPosts = [] }) {
  const [user, setUser] = useState(initialUser ?? null);
  const [posts, setPosts] = useState(initialPosts);
  const [drafts, setDrafts] = useState([]);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Action helpers (also placed in the same context — every consumer of
  // ANY action re-renders on every change).
  const addDraft = useCallback(
    (draft) => setDrafts((prev) => [...prev, draft]),
    []
  );
  const removeDraft = useCallback(
    (id) => setDrafts((prev) => prev.filter((d) => d.id !== id)),
    []
  );
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    []
  );
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const value = {
    user, setUser,
    posts, setPosts,
    drafts, setDrafts, addDraft, removeDraft,
    theme, setTheme, toggleTheme,
    sidebarOpen, setSidebarOpen, openSidebar, closeSidebar,
    notifications, setNotifications,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}

export default AppContext;

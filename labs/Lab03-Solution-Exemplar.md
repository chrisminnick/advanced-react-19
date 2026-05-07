# Lab 3 — Solution Exemplar

This document sketches the reference solutions for the three branches. Use it when checking student submissions or when seeding `solution/lab-03-zustand`, `solution/lab-03-jotai`, and `solution/lab-03-rtk`.

All three reach the same end state in terms of behavior — they differ in code shape and where the lines fall.

---

## Starting state — the mess to refactor

The starter has these problems:

- A single `AppContext` provides `user`, `posts`, `drafts`, `theme`, `sidebarOpen`, `notifications`, `setUser`, `setPosts`, `setDrafts`, `setTheme`, `setSidebarOpen`, `setNotifications`. Every consumer re-renders when any of these change.
- `PostsFeed` takes a `currentUser` prop that it forwards through three levels to `PostActions`.
- `Sidebar` reads `theme` and `sidebarOpen` from context but also takes a `user` prop.
- `posts` and `notifications` are server state stored in the client context.

The right end-state in any tool:

- Server state (`user`, `posts`, `notifications`) leaves the store entirely. For now, route loaders or plain `fetch` covers them. Lab 4 introduces TanStack Query.
- Client state (`drafts`, `theme`, `sidebarOpen`) lives in the new store, organized by feature.
- Components read what they need from the store directly. No prop drilling for shared state.

---

## Solution A — `solution/lab-03-zustand`

### File layout

```
social-media-rr-v7/app/
├── stores/
│   ├── drafts.js           ← drafts feature
│   ├── ui.js               ← sidebar + theme
│   └── index.js            ← re-exports
├── routes/
│   └── home.jsx            ← reads from stores
└── components/
    ├── Sidebar.jsx
    ├── PostsFeed.jsx
    └── ...
```

### `app/stores/drafts.js`

```js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useDraftsStore = create(
  devtools(
    (set) => ({
      items: [],
      addDraft: (draft) =>
        set((s) => ({ items: [...s.items, draft] }), false, 'drafts/add'),
      removeDraft: (id) =>
        set((s) => ({ items: s.items.filter((d) => d.id !== id) }), false, 'drafts/remove'),
      clear: () => set({ items: [] }, false, 'drafts/clear'),
    }),
    { name: 'drafts' }
  )
);
```

### `app/stores/ui.js`

```js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: false,
        toggleTheme: () =>
          set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }), false, 'ui/toggleTheme'),
        openSidebar: () => set({ sidebarOpen: true }, false, 'ui/openSidebar'),
        closeSidebar: () => set({ sidebarOpen: false }, false, 'ui/closeSidebar'),
      }),
      { name: 'ui-store' } // persists theme + sidebarOpen to localStorage
    ),
    { name: 'ui' }
  )
);
```

### Consumer example: `Sidebar.jsx`

```jsx
import { useUIStore } from '../stores/ui';

export default function Sidebar() {
  // Two separate selectors — each component re-renders only when its slice changes.
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  if (!sidebarOpen) return null;
  return (
    <aside>
      <button onClick={closeSidebar}>Close</button>
      {/* ... */}
    </aside>
  );
}
```

**What changed in Sidebar.jsx:**
- No `user` prop — it didn't need one.
- No `useContext(AppContext)` — gone with the bloated context.
- Two slim subscriptions instead of one broad one.

### Bullets for the justification

- Zustand's per-slice selectors keep `Sidebar` and `PostsFeed` from re-rendering when each other's state changes — a real win over the previous AppContext.
- The store is small enough that we don't need slices-of-slices; two stores (drafts, ui) cover the client state cleanly.
- `persist` middleware gives us localStorage for theme without a custom `useEffect`.
- We considered Jotai but the state graph here is flat — no derived chains worth modeling as atoms.

---

## Solution B — `solution/lab-03-jotai`

### File layout

```
social-media-rr-v7/app/
├── atoms/
│   ├── drafts.js
│   ├── ui.js
│   └── index.js
├── routes/
│   └── home.jsx
└── components/...
```

### `app/atoms/drafts.js`

```js
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const draftsAtom = atomWithReset([]);

export const draftsCountAtom = atom((get) => get(draftsAtom).length);

export const addDraftAtom = atom(null, (get, set, draft) => {
  set(draftsAtom, [...get(draftsAtom), draft]);
});

export const removeDraftAtom = atom(null, (get, set, id) => {
  set(draftsAtom, get(draftsAtom).filter((d) => d.id !== id));
});
```

### `app/atoms/ui.js`

```js
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage('theme', 'light');
export const sidebarOpenAtom = atom(false);

export const isDarkAtom = atom((get) => get(themeAtom) === 'dark');
```

### Consumer example: `Sidebar.jsx`

```jsx
import { useAtom, useAtomValue } from 'jotai';
import { sidebarOpenAtom } from '../atoms/ui';

export default function Sidebar() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  if (!open) return null;
  return (
    <aside>
      <button onClick={() => setOpen(false)}>Close</button>
      {/* ... */}
    </aside>
  );
}
```

### Bullets for the justification

- Jotai's atomic subscriptions match this app's natural data shape — the badge counter on the sidebar wants `draftsCountAtom`, not the whole drafts array.
- `atomWithStorage` gives localStorage persistence with one line.
- Derived atoms (`isDarkAtom`, `draftsCountAtom`) read like the calculations they replace — no memoization ceremony.
- We considered Zustand but our derived state was cleaner expressed as atom dependencies. The trade-off is a slightly higher onboarding cost for new team members.

---

## Solution C — `solution/lab-03-rtk`

### File layout

```
social-media-rr-v7/app/
├── store/
│   ├── index.js            ← configureStore
│   ├── api.js              ← RTK Query baseApi (Lab 4 territory; included here for completeness)
│   ├── draftsSlice.js
│   └── uiSlice.js
├── routes/
│   └── home.jsx            ← Provider + reads
└── components/...
```

### `app/store/draftsSlice.js`

```js
import { createSlice } from '@reduxjs/toolkit';

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: { items: [] },
  reducers: {
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
```

### `app/store/uiSlice.js`

```js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: 'light', sidebarOpen: false },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { toggleTheme, openSidebar, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer;
```

### `app/store/index.js`

```js
import { configureStore } from '@reduxjs/toolkit';
import drafts from './draftsSlice';
import ui from './uiSlice';

export const store = configureStore({
  reducer: { drafts, ui },
});
```

### Consumer example: `Sidebar.jsx`

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from '../store/uiSlice';

export default function Sidebar() {
  const open = useSelector((s) => s.ui.sidebarOpen);
  const dispatch = useDispatch();

  if (!open) return null;
  return (
    <aside>
      <button onClick={() => dispatch(closeSidebar())}>Close</button>
      {/* ... */}
    </aside>
  );
}
```

### Bullets for the justification

- RTK's slice + actions structure scales as the team grows — every new feature has a predictable shape, which helps onboarding.
- Redux DevTools are still best in class for time-travel debugging the kinds of bugs that show up in production.
- RTK Query is bundled — when we add server state in Lab 4, we don't need a second library.
- We considered Zustand but the team consensus was that conventions matter more than bundle size at our company's scale.

---

## Reference comparison — what students writing the stretch should produce

The students' `lab03-comparison.md` (stretch task) should be roughly two paragraphs, citing specifics. Use this as a benchmark.

```markdown
# Lab 3 comparison — Zustand vs Jotai

I started with Zustand and ported to Jotai. Same end-state behavior, very different code shape.

## Which fit this codebase better?

Zustand was a closer fit. Most of this app's client state is flat — a couple of feature flags, a draft list, a theme — and Zustand's "store as a hook with selectors" maps cleanly to that. Jotai's atom graph is powerful but unused here; my derived atoms ended up being a single `draftsCountAtom`, which is barely worth the mental overhead of the new model. If this app had a richer derived state — say, a cart with items → subtotal → tax → discount → total — Jotai would have been the better choice.

## What was hardest in each?

In Zustand: getting selectors right. Easy to write `useStore((s) => s)` and re-render everything; harder to remember to slice. The middleware (devtools, persist) is well-trodden but composing them takes a re-read of the docs every time.

In Jotai: deciding what should be an atom and what should be derived. The temptation to make every value an atom leads to fragmented state. Once I committed to "primitives are atoms, computed values are derived atoms," it clicked.

## Which would I advocate for at work?

Zustand for the next greenfield project. Jotai if I knew up front that the state graph was going to be the hard part of the app.
```

---

## Common pitfalls to flag if you see them in submissions

- **Server state in the new store.** The single most common mistake. Look for `posts`, `users`, `notifications` in the new store — those are signs the student didn't internalize Module 4's server-vs-client split.
- **Setter-shaped action names.** `setX` everywhere instead of `addItem`, `clearCart`, `signIn`, etc. Refactor cost is small, payoff is conceptual clarity.
- **The bloated context kept "for backward compat" plus a new store.** Two sources of truth — reject. The point is to migrate.
- **No selectors, just `useStore()` everywhere.** Misses the perf benefit. Easy fix.
- **Theme not persisted.** Cosmetic but jarring — refresh the page and the theme resets. Use the persist middleware (Zustand) or `atomWithStorage` (Jotai) or `redux-persist` (RTK).

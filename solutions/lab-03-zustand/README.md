# Lab 3 solution — Zustand

Self-contained, runnable reference solution for Lab 3 (Zustand variant).
Replaces the bloated `AppContext` from the baseline with three small
Zustand stores (one per feature), drops the prop drilling, and moves
server state out of the client store entirely.

## How to run

Two terminals.

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>. MongoDB on `:27017` required.

## What changes vs. lab-03-baseline

| File | Change |
|---|---|
| `app/stores/drafts.js` | NEW — Zustand store for drafts. |
| `app/stores/ui.js` | NEW — Zustand store for theme + sidebar; persists to localStorage. |
| `app/stores/user.js` | NEW — read-only user atom set by the loader (avoids a fetch on every consumer). |
| `app/context/AppContext.jsx` | DELETED. |
| `app/components/Header.jsx` | Reads UI store with two slim selectors. |
| `app/components/Sidebar.jsx` | Reads sidebar slice; no `user` prop. |
| `app/components/PostsFeed.jsx` | Drops the `currentUser` prop forward. |
| `app/components/PostActions.jsx` | Reads `currentUser` from a tiny user store. |
| `app/components/PostComposer.jsx` | Reads drafts from the drafts store. |
| `app/routes/home.jsx` | Hydrates the user store from the loader; no AppProvider. |
| `package.json` | Adds `zustand`. |
| `lab03-justification.md` | NEW — the 3-bullet defense. |

## What stays from the baseline

`app/lib/api.server.js`, the auth routes, `root.jsx` — all unchanged.

## Notes worth pointing out to students

- Selectors are not optional. `useStore((s) => s.draft)` re-renders only
  when `draft` changes. `useStore()` re-renders on every change. The
  components in this solution all use selectors.
- The `user` store is set once by the loader and read by the components
  that need it — avoids prop-drilling without making `user` a "live"
  reactive value (we don't want polling here; that's TanStack Query
  territory in Lab 4).
- `persist` middleware backs theme + sidebar to localStorage so a refresh
  preserves them.

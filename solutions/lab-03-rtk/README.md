# Lab 3 solution — Redux Toolkit

Self-contained, runnable reference solution for Lab 3 (RTK variant).
Replaces the bloated `AppContext` with three RTK slices, configured into
one store, served via `<Provider>`.

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
| `app/store/index.js` | NEW — `configureStore` wiring drafts + ui + user. |
| `app/store/draftsSlice.js` | NEW. |
| `app/store/uiSlice.js` | NEW. |
| `app/store/userSlice.js` | NEW. |
| `app/context/AppContext.jsx` | DELETED. |
| `app/components/StoreProvider.jsx` | NEW — Client wrapper around `<Provider>`. |
| All components in `app/components/` | Rewritten to use `useSelector` / `useDispatch`. |
| `app/routes/home.jsx` | Hydrates the user slice; mounts `<StoreProvider>`. |
| `package.json` | Adds `@reduxjs/toolkit` + `react-redux`. |
| `lab03-justification.md` | NEW. |

## Notes worth pointing out to students

- **Use `createSlice`, not hand-written reducers.** Saves boilerplate and
  pre-wires immer.
- Action names describe transitions (`addDraft`, `removeDraft`) — never
  `setDrafts`.
- `useSelector((s) => s.ui.sidebarOpen)` is the equivalent of Zustand's
  per-slice selector — use it, don't read the whole state.
- For Lab 4, the same store grows an RTK Query `createApi` for posts/me.
  The conceptual win of RTK is that server state lives in the same
  toolset as client state, so you don't end up with three concurrent
  state libraries.
- The `<Provider>` wraps the route element. RR v7 components hydrate on
  the client, so `react-redux`'s context works the same way it would in
  a classic SPA.

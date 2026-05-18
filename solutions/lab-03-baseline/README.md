# Lab 3 baseline — the mess to refactor

Self-contained, runnable snapshot of the **starting state for Lab 3**.
This is the bloated-`AppContext` version students are asked to refactor.
Useful if you want to see the "before" code before looking at the
zustand / jotai / rtk solutions.

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

## What's deliberately wrong here

- A single bloated `AppContext` providing 12 unrelated values; every
  consumer re-renders when any value changes.
- Prop drilling: `PostsFeed` takes `currentUser`, forwards through
  `PostActions` two levels down, even though `PostsFeed` itself doesn't
  use it.
- `Sidebar` reads `theme` and `sidebarOpen` from context AND takes a
  `user` prop it doesn't need.
- Server state (`posts`, `notifications`) stored in client context next
  to client state (`drafts`, `theme`, `sidebarOpen`).

The Lab 3 handout walks students through fixing all of this. The three
worked solutions — `solutions/lab-03-zustand/`, `solutions/lab-03-jotai/`,
and `solutions/lab-03-rtk/` — each take the file layout below and fix
the mess their own way.

```
app/
├── context/AppContext.jsx          ← the bloat
├── components/
│   ├── Header.jsx                  ← theme toggle, sidebar toggle, user badge
│   ├── Sidebar.jsx                 ← reads context + takes redundant prop
│   ├── PostsFeed.jsx               ← prop-drills currentUser
│   ├── PostActions.jsx             ← the leaf that finally uses currentUser
│   └── PostComposer.jsx            ← reads drafts from context
├── routes/home.jsx                 ← wires the above; uses AppProvider
└── root.jsx                        ← wraps with AppProvider
```

Everything else is identical to `solutions/lab-02-rr-v7/`.

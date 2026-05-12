# Lab 3 baseline — the mess to refactor

This folder is the **starting state for Lab 3**. It extends the
`solution/lab-02-rr-v7` branch with the deliberate problems Lab 3 asks
students to fix:

- A single bloated `AppContext` providing 12 unrelated values; every consumer
  re-renders when any value changes.
- Prop drilling: `PostsFeed` takes `currentUser`, forwards through
  `PostActions` two levels down, even though `PostsFeed` itself doesn't use it.
- `Sidebar` reads `theme` and `sidebarOpen` from context AND takes a `user`
  prop it doesn't need.
- Server state (`posts`, `notifications`) stored in client context next to
  client state (`drafts`, `theme`, `sidebarOpen`).

This file layout becomes the input for `solution/lab-03-zustand`,
`solution/lab-03-jotai`, and `solution/lab-03-rtk` — each of which fixes
the mess in its own way.

To publish to a `lab-03-baseline` reference branch (optional — instructors
typically just demo "look at this and feel bad" from the file diff), see
`MATERIALIZE.md`.

## What's in here

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

Everything else is identical to `solution/lab-02-rr-v7`.

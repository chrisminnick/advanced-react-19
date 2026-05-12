# Lab 3 justification — Zustand

- This app's client state is flat — three slices (drafts, theme, sidebar), no
  derived chains worth modeling — and Zustand's "store as a hook with
  selectors" maps directly onto that shape.
- Per-slice selectors mean `Sidebar` doesn't re-render when a draft is added,
  and `PostComposer` doesn't re-render when the theme toggles. The bloated
  AppContext re-rendered every consumer on every change.
- `persist` middleware gives us localStorage for theme + sidebar without a
  custom `useEffect` (the trap the legacy code fell into).
- Considered Jotai but rejected — there's no derived state graph here that
  would pay back the additional model. If we add a richer derivation chain
  later (e.g., a cart with items → subtotal → tax → total), that's the
  trigger to revisit.
- Considered RTK but rejected for this app's size — the slice-and-actions
  ceremony costs more than it gives back. Would be the right call for a
  larger team or stricter convention requirements.

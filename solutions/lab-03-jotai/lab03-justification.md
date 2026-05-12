# Lab 3 justification — Jotai

- Jotai's atomic subscriptions match this app's natural shape: the sidebar's
  draft badge wants `draftsCountAtom`, not the whole drafts array, and Jotai
  expresses that as one-line derivation.
- `atomWithStorage` gives localStorage persistence in a single line — same
  win as Zustand's `persist`, just expressed as another atom.
- Write-only "action atoms" keep the action surface explicit and make
  components that *only* dispatch them avoid subscribing to the underlying
  state at all.
- Considered Zustand and rejected — Zustand would have worked, but it
  doesn't model the `draftsCount → badge` derivation as cleanly. The
  trade-off: slightly higher onboarding cost for new team members, since
  Jotai's atom graph is a less common mental model than "store + selectors."
- Considered RTK and rejected — same reason as the Zustand bullet, plus
  the slice ceremony costs more than it gives back at this size.

# Lab 3 justification — Redux Toolkit

- RTK's slice + actions structure makes every new feature have a predictable
  shape — a real win for onboarding new engineers and for code review velocity
  on a larger team.
- Redux DevTools remain best in class for time-travel debugging the kinds of
  bugs that show up in production. Reproducing a bug is much easier when you
  can replay the action sequence.
- RTK Query is bundled — when we add server state in Lab 4, we don't add
  a second library or a second mental model. Same store, new slice.
- Considered Zustand and rejected — Zustand's lower ceremony is real, but the
  team has more Redux experience and the convention payoff outweighs the
  bundle-size delta on a project this size.
- Considered Jotai and rejected — Jotai's atomic model is elegant for
  derivation-heavy state, but this app's state is mostly flat and the team
  doesn't have Jotai experience.

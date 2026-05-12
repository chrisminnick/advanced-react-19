# Lab 3 solution — Jotai

Branches from `lab-03-baseline`. Replaces the bloated AppContext with a
graph of atoms (one per primitive value, plus derived atoms for things you'd
otherwise compute in render).

## What changes vs. baseline

| File | Change |
|---|---|
| `app/atoms/drafts.js` | NEW — drafts atom, derived count atom, write-only action atoms. |
| `app/atoms/ui.js` | NEW — theme (atomWithStorage), sidebar atom, derived isDarkAtom. |
| `app/atoms/user.js` | NEW — user atom hydrated from the loader. |
| `app/context/AppContext.jsx` | DELETED. |
| All components in `app/components/` | Rewritten to read atoms. |
| `app/routes/home.jsx` | Hydrates user atom; no Provider. |
| `package.json` | Adds `jotai`. |
| `lab03-justification.md` | NEW. |

## Notes worth pointing out to students

- **Primitives are atoms; computed values are derived atoms.** The temptation
  to make every interesting value an atom leads to fragmentation. Resist.
- `atomWithStorage` gives localStorage persistence in one line.
- Write-only atoms (`atom(null, (get, set, payload) => …)`) keep the action
  surface explicit. Components import the action atom and call `useSetAtom`
  on it — they don't need to know about the underlying state.
- No `<Provider>` is needed unless you want isolated atom scopes (e.g.,
  per-route stores). This solution doesn't need one.

# Lab 6 solution — Profile and Optimize

Self-contained, runnable reference solution for Lab 6. Applies the four
optimizations the exemplar lists (A, B, C, D), plus the virtualization
stretch.

## How to run

Two terminals.

```bash
# Terminal 1 — Express backend (port 4000)
# (same modified server as lab-06-baseline — stamps `tags` onto every post)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>. To verify the optimizations, profile the
home page typing in the search box and compare against the
`lab-06-baseline/` numbers — `lab06-results.md` has the before/after.

MongoDB on `:27017` required.

## What changes vs. lab-06-baseline

| File | Change | Optimization |
|---|---|---|
| `app/components/SearchInput.jsx` | Owns local state + debounced URL writes. | A |
| `app/routes/home.jsx` | Reads search from URL params; PostsFeed only re-fetches when search settles. | A |
| `app/hooks/usePostsSearch.js` | NEW — `useQuery` keyed on the search string. | A |
| `app/components/TrendingSidebar.jsx` | Wraps the tag analysis in a stable `useMemo`. | B |
| `app/components/Composer.jsx` | Unchanged content; just stops being directly imported. | C |
| `app/components/LazyComposer.jsx` | NEW — `lazy(() => import('./Composer'))` + `<Suspense>`. | C |
| `vite.config.js` | Adds `babel-plugin-react-compiler`. | D |
| `eslint.config.js` | Adds `eslint-plugin-react-compiler` rule. | D |
| `app/components/PostsFeed.jsx` | TanStack Virtual — only renders visible cards. | Stretch |
| `package.json` | Adds `@tanstack/react-virtual`, `babel-plugin-react-compiler`, `eslint-plugin-react-compiler`. | Mixed |
| `lab06-baseline.md` | NEW — captured starting numbers. | Deliverable |
| `lab06-results.md` | NEW — before/after table + retro. | Deliverable |

## Things to point out to students

- **Optimization A is two changes, not one:** the search lives in URL
  params (so it survives reloads and back/forward), AND the URL write
  is debounced 300ms (so the network doesn't thrash on every keystroke).
- **Optimization B requires the eslint plugin.** Without it, you can't
  tell whether the Compiler bailed out — the eslint warning is the only
  signal.
- **Optimization C's win is in the index bundle, not in render time.**
  The Profiler won't show the difference; the Network tab will.
- **Optimization D is "free" if you have it from the start.** The drama
  is when you turn it on mid-project and discover one or two components
  the Compiler can't memoize — those bailouts surface as eslint errors,
  and fixing them is its own teaching moment.
- **Stretch (virtualization) only matters at scale.** Below ~50 posts
  the overhead doesn't pay back. The `lab06-results.md` notes this.

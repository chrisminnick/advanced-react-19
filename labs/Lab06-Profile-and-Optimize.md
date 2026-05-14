# Lab 6 — Profile and Optimize

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Profile the social-media app, identify the top three
bottlenecks, apply at least three optimization techniques, and report
before/after numbers. No vibes — actual measurements.

The point of this lab is to build the measurement-first habit. By the
end, you should be able to point at a number that proves your fix
worked.

---

## What you'll have at the end

1. A `lab06-baseline.md` file with your starting numbers — Profiler
   timings for the top three components, Lighthouse scores, bundle
   size.
2. Three (or more) sets of changes, each implementing one optimization
   with before/after numbers documented.
3. A `lab06-results.md` summary tying it all together — what you
   changed, what improved, what didn't.

Both `.md` files go at the root of `lab-files/lab-06/`.

Plus, if you have time: a virtualized posts feed using TanStack Virtual.

---

## Time budget

| Phase | Minutes |
|---|---|
| Baseline measurement | 15 |
| Optimization 1 | 15 |
| Optimization 2 | 15 |
| Optimization 3 | 15 |
| Write up `lab06-results.md` | 15 |
| Stretch (if time): virtualization | + |

If you finish early, do the stretch task or pick a fourth optimization.

---

## Setup

You're working in `lab-files/lab-06/`. The starter is the post-Lab-4
state of `social-media-rr-v7/` (TanStack Query is in place) PLUS a set
of deliberately seeded performance problems: a search input that
re-renders the entire feed on every keystroke, a `TrendingSidebar`
that recomputes on every render, and a `Composer` that eagerly imports
a "heavy" module.

```bash
# Terminal 1 — backend (the lab-06 backend stamps mock tags onto every post)
cd lab-files/lab-06/social-media/server
npm install
npm run dev

# Terminal 2 — client
cd lab-files/lab-06/social-media-rr-v7
npm install
npm run dev
```

Visit `http://localhost:5173`. Sign up, log in, browse around. Let the
app feel slow before you measure.

### Make a backup

```bash
cp -R lab-files/lab-06 lab-files/lab-06-backup

# Windows PowerShell:
Copy-Item -Recurse lab-files/lab-06 lab-files/lab-06-backup
```

---

## Phase 1 — Baseline measurement (15 min)

Don't fix anything yet. Measure first.

### Step 1 — React DevTools Profiler

1. Open React DevTools → Profiler tab
2. Click record
3. Type a few characters into the search box on the home page
4. Click stop
5. Look at the flame graph. Sort by "ranked" view to see the slowest components
6. Note the top three components by render time (or render count)

### Step 2 — Lighthouse

1. Open Chrome DevTools → Lighthouse tab
2. Select "Performance" only, "Mobile" device, "Simulated throttling"
3. Click "Analyze page load"
4. Note the Performance score, LCP, INP, CLS, TTFB
5. Take a screenshot or save the report

### Step 3 — Bundle size

```bash
npm run build
ls -lh dist/assets/*.js  # macOS / Linux
dir dist\assets\*.js      # Windows PowerShell
```

Note the largest JS chunk size.

### Step 4 — Capture the baseline

Create `lab-files/lab-06/lab06-baseline.md`:

```markdown
# Lab 6 baseline

Captured on <date> against `lab-files/lab-06/social-media-rr-v7`.

## React Profiler — top 3 components by impact

| Component | Render count | Avg render time |
|---|---|---|
| PostsFeed | 6 | 22ms |
| PostCard | 360 (60 posts × 6 renders) | 3.5ms each |
| TrendingSidebar | 6 | 28ms |

## Lighthouse (mobile, simulated)

| Metric | Value |
|---|---|
| Performance | 64 |
| LCP | 4.1s |
| INP | 320ms |
| CLS | 0.04 |
| TTFB | 0.8s |

## Bundle size

| Chunk | Size |
|---|---|
| index-XXXXX.js | 412 KB |
```

Use real numbers. Mine are made up — yours will differ.

---

## Phase 2 — Pick three optimizations and apply them (45 min)

Look at your baseline. Pick three of the optimizations below — the
ones that map to your worst numbers. Each optimization gets ~15
minutes.

### Optimization options

You can pick any three. The list is roughly ordered by what tends to
apply to this app.

**A. Lift the search filter UP — and the post list DOWN**

The home page renders a search input AND the posts list. The search
state lives in the parent, so every keystroke re-renders the entire
posts list. Pull the search input out into its own component with its
own state, and have it write to a URL search param that the posts list
subscribes to (with a debounce on the URL write).

**B. Memoize the trending sidebar's expensive calculation**

`TrendingSidebar` recomputes a tag-frequency analysis on every render.
If you've enabled the React Compiler, check whether it actually
memoized — if not (eslint will tell you), add a `useMemo` manually with
stable deps.

**C. Lazy-load the composer**

The post-creation form imports a "heavy" module that adds ~80KB. Most
users land on the home page and never open the composer. Wrap the
composer in `React.lazy` and a `Suspense` boundary so its bundle
doesn't ship with the home page.

**D. Enable the React Compiler**

If the project doesn't already have it enabled, install
`babel-plugin-react-compiler` and add it to the Vite config. Enable
the eslint plugin too. Re-run the profiler — many of the manual
`useMemo`s in the codebase should now be redundant.

**E. Throttle / debounce a noisy event source**

If you've added an infinite-scroll trigger or any scroll-driven
behavior, use `react-intersection-observer` (or a 100ms throttle) so
the handler doesn't fire on every scroll event.

### How to do each one

For each optimization:

1. Implement the change
2. Re-measure (Profiler if it's a render fix, Lighthouse + build if
   it's a bundle fix)
3. Note the before/after numbers in your notes (you'll roll them up
   into `lab06-results.md` next)

---

## Phase 3 — Write up `lab06-results.md` (15 min)

Pull together what you did. Save as `lab-files/lab-06/lab06-results.md`:

```markdown
# Lab 6 results

## What I changed

1. **<Optimization name>** — brief description of the change.
2. **<Optimization name>** — brief description.
3. **<Optimization name>** — brief description.

## Before / after

| Metric | Before | After | Change |
|---|---|---|---|
| Index bundle | 412 KB | 318 KB | -23% |
| LCP (mobile) | 4.1s | 3.4s | -17% |
| Posts component avg render | 18ms | 6ms | -67% |
| PostCard render count (per keystroke) | 60 | 0 | search no longer re-renders posts |

## What I tried that didn't help

(If anything — sometimes optimizations don't move the numbers, and
that's worth recording.)

## What I'd do next

(Usually one or two more optimizations you didn't have time for.)
```

The "what didn't help" section is the maturity test. Real performance
work has dead ends; pretending otherwise is the AI tell.

---

## Stretch — virtualized posts feed

Add `@tanstack/react-virtual` and convert the posts feed to a virtual
list. The benefit will be real if your seeded data has 200+ posts.

```bash
npm install @tanstack/react-virtual
```

See `solutions/lab-06-perf/app/components/PostsFeed.jsx` for a
reference implementation.

Re-profile. The render count for `PostCard` should drop dramatically —
only the visible cards (plus the overscan) should render.

---

## Hints if you get stuck

- **The Profiler shows renders but you don't see why:** click any
  flame-graph bar; the right panel shows "Why did this render?"
  listing each prop and hook that changed.
- **Lighthouse score is the same after a fix:** Lighthouse is noisy.
  Run it three times and average. Or use the "Throttling: applied"
  mode for more deterministic numbers.
- **`React.lazy` chunk doesn't appear in the network tab:** Vite may
  have inlined it because it's small. Check `dist/` after build —
  that's the source of truth for production behavior.
- **Compiler eslint warnings everywhere after enabling it:** that's
  the point. Each warning is a component the Compiler couldn't
  memoize. Fix them in priority order (the warning shows you why it
  bailed).
- **The throttled scroll handler now fires too late:** lower the
  throttle interval. 16ms = once per frame; 100ms = perceptibly
  choppy. Find the right balance.
- **Virtualization changes layout:** the virtual container needs an
  explicit height, and post cards need consistent height (or you need
  `measureElement`). Read TanStack Virtual's docs for variable-height
  items.

---

## Reference solution

The reference solution applies four optimizations (A, B, C, D) plus
the virtualization stretch. It's at `solutions/lab-06-perf/`. Don't
peek before you've finished your own — measurement habits don't
transfer through reading.

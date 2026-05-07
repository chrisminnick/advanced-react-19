# Lab 6 — Profile and Optimize

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Profile the social-media app, identify the top three bottlenecks, apply at least three optimization techniques, and report before/after numbers. No vibes — actual measurements.

The point of this lab is to build the measurement-first habit. By the end, you should be able to point at a number that proves your fix worked.

---

## What you'll have at the end

1. A `lab06-baseline.md` file with your starting numbers — Profiler timings for the top three components, Lighthouse scores, bundle size.
2. Three (or more) commits, each implementing one optimization with before/after numbers in the commit message.
3. A `lab06-results.md` summary tying it all together — what you changed, what improved, what didn't.
4. A branch pushed: `lab06/<your-name>-perf`.

Plus, if you have time: a virtualized posts feed using TanStack Virtual.

---

## Time budget

| Phase | Minutes |
|---|---|
| Baseline measurement | 15 |
| Optimization 1 | 15 |
| Optimization 2 | 15 |
| Optimization 3 | 15 |
| Write up `lab06-results.md` | 10 |
| Submit | 5 |
| Stretch (if time): virtualization | + |

If you finish early, do the stretch task or pick a fourth optimization.

---

## Setup

You're working in `social-media-rr-v7/` again — the same client from Labs 2, 3, and 4. Continue from your Lab 4 branch (or check out `solution/lab-04-tanstack-query` for a clean baseline).

For this lab, the starter has been seeded with intentional performance problems. The README in the project root lists the dimensions you can measure but doesn't tell you which optimizations apply where — that's the lab.

### Restart everything

```bash
cd social-media/server
npm start

# In another terminal:
cd social-media-rr-v7
git checkout main
git pull
npm install
npm run dev
```

Visit `http://localhost:5173`. Sign up, log in, browse around. Let the app feel slow before you measure.

### Branch off

```bash
git checkout -b lab06/<your-name>-perf
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
ls -lh dist/assets/*.js
```

Note the largest JS chunk size. If you have `vite-plugin-visualizer` or similar installed, run it now and note which dependencies dominate.

### Step 4 — Capture the baseline

Create `lab06-baseline.md`:

```markdown
# Lab 6 baseline

Captured on <date> against <branch>.

## React Profiler — top 3 components by impact

| Component | Render count | Avg render time |
|---|---|---|
| Posts | 47 | 18ms |
| PostCard | 280 (one per render × 60 posts) | 4ms each |
| TrendingSidebar | 22 | 32ms |

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
| Largest dep | recharts: 138 KB |
```

Use real numbers. Mine are made up — yours will differ.

Commit:

```bash
git add lab06-baseline.md
git commit -m "Lab 6: baseline measurements"
```

---

## Phase 2 — Pick three optimizations and apply them (45 min)

Look at your baseline. Pick three of the optimizations below — the ones that map to your worst numbers. Each optimization gets ~15 minutes.

### Optimization options

You can pick any three. The list is roughly ordered by what tends to apply to this app.

**A. Lift the search filter UP — and the post list DOWN**

The home page renders a search input AND the posts list. The search state lives in the parent, so every keystroke re-renders the entire posts list. Pull the search input out into its own component with its own state, and have it write to a search context (or URL param) that the posts list subscribes to with a selector.

**B. Memoize the trending sidebar's expensive calculation**

`TrendingSidebar` recomputes a tag-frequency analysis on every render. If you've enabled the React Compiler, check whether it actually memoized — if not (eslint will tell you), add a `useMemo` manually.

**C. Lazy-load the rich-text editor**

The post-creation form imports a markdown editor that's ~80KB. Most users land on the home page and never open the composer. Wrap the composer in `React.lazy` and a `Suspense` boundary so its bundle doesn't ship with the home page.

**D. Lazy-load the analytics chart**

Same idea, different culprit. The user profile page imports `recharts` for the activity chart. The chart is below the fold; the page should render without it. Lazy-load.

**E. Add the React Compiler**

If the project doesn't already have it enabled, install `babel-plugin-react-compiler` and add it to the Vite config. Enable the eslint plugin too. Re-run the profiler — many of the manual `useMemo`s in the codebase should now be redundant. (You don't have to remove them; just verify the Compiler is doing its job.)

**F. Replace `useEffect`+`fetch` with TanStack Query (if not already done)**

You did this in Lab 4 for the home page; check whether `UserProfile`, `Notifications`, or other routes still use the old pattern. The dedup and cache wins are real.

**G. Throttle the scroll handler**

The "load more" infinite-scroll trigger fires on every scroll event. Throttle it to once per 100ms. The number of recomputations should drop dramatically without changing user-visible behavior.

**H. Move the markdown rendering off the main thread**

The post detail page renders Markdown in the main render path. For long posts, this adds 100-200ms of blocking work. Move it to a Web Worker via Comlink. (This is the most ambitious option — pick it only if you've finished the others early.)

### How to do each one

For each optimization:

1. Implement the change
2. Re-measure (Profiler if it's a render fix, Lighthouse + build if it's a bundle fix)
3. Note the before/after in your commit message
4. Commit and continue

Example commit message format:

```
Lab 6 opt 1: lazy-load the composer

PostCreator + its markdown editor extracted into a Suspense-wrapped lazy
chunk. Home page no longer ships the editor's ~80KB unless the user
opens it.

Before: index bundle 412KB, LCP 4.1s
After:  index bundle 318KB, LCP 3.4s
```

---

## Phase 3 — Write up `lab06-results.md` (10 min)

Pull together what you did. Save as `lab06-results.md`:

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

(If anything — sometimes optimizations don't move the numbers, and that's worth recording.)

## What I'd do next

(Usually one or two more optimizations you didn't have time for.)
```

The "what didn't help" section is the maturity test. Real performance work has dead ends; pretending otherwise is the AI tell.

---

## Phase 4 — Submit (5 min)

```bash
git add -A
git commit -m "Lab 6: results summary"
git push origin lab06/<your-name>-perf
```

Submit your branch link, `lab06-baseline.md`, and `lab06-results.md` in the shared class doc.

---

## Stretch — virtualized posts feed

Add `@tanstack/react-virtual` and convert the posts feed to a virtual list. The benefit will be real if your seeded data has 200+ posts.

```bash
npm install @tanstack/react-virtual
```

Refactor `PostsFeed.jsx`:

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export default function PostsFeed({ posts }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // approx height of a post card
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '80vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vi) => (
          <div
            key={vi.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vi.start}px)`,
            }}
          >
            <PostCard post={posts[vi.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Re-profile. The render count for `PostCard` should drop dramatically — only the visible cards (plus the overscan) should render.

Commit and add a row to your results table.

---

## Hints if you get stuck

- **The Profiler shows renders but you don't see why:** click any flame-graph bar; the right panel shows "Why did this render?" listing each prop and hook that changed.
- **Lighthouse score is the same after a fix:** Lighthouse is noisy. Run it three times and average. Or use the "Throttling: applied" mode for more deterministic numbers.
- **`React.lazy` chunk doesn't appear in the network tab:** Vite may have inlined it because it's small. Check `dist/` after build — that's the source of truth for production behavior.
- **Compiler eslint warnings everywhere after enabling it:** that's the point. Each warning is a component the Compiler couldn't memoize. Fix them in priority order (the warning shows you why it bailed).
- **The throttled scroll handler now fires too late:** lower the throttle interval. 16ms = once per frame; 100ms = perceptibly choppy. Find the right balance.
- **Virtualization changes layout:** the virtual container needs an explicit height, and post cards need consistent height (or you need `measureElement`). Read TanStack Virtual's docs for variable-height items.

---

## Solution branch

The reference solution applies four of the optimizations (A, B, C, E) plus the virtualization stretch. It's at `solution/lab-06-perf`. Don't peek before you've finished your own — measurement habits don't transfer through reading.

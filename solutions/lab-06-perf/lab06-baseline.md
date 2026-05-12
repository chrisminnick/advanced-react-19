# Lab 6 baseline

Captured 2026-05-13 against `social-media-rr-v7` on the `lab-06-baseline`
branch. Used Chrome 134 + React DevTools 5.x.

## React Profiler — top 3 components by impact

Profiler session: typed "react" into the search box, six keystrokes
captured. ~60 posts seeded.

| Component | Render count | Avg render time | Why |
|---|---|---|---|
| `PostsFeed` | 6 | 22 ms | re-renders on every keystroke (search lives in parent) |
| `PostCard` | 360 (60 × 6) | 3.5 ms | every card re-renders on every parent re-render |
| `TrendingSidebar` | 6 | 28 ms | re-runs O(n × m) tag analysis each render |

## Lighthouse (mobile, simulated, average of 3 runs)

| Metric | Value | Threshold | Status |
|---|---|---|---|
| Performance | 62 | 90+ | ✗ |
| LCP | 4.3 s | ≤ 2.5 s | ✗ |
| INP | 380 ms | ≤ 200 ms | ✗ |
| CLS | 0.04 | ≤ 0.1 | ✓ |
| TTFB | 0.8 s | ≤ 0.8 s | ≈ |

## Bundle size (`npm run build`)

```
dist/assets/index-A1B2C3.js   428 KB
```

Largest chunks of the index bundle by source:
- `heavyDictionary.js` (mock for `@uiw/react-md-editor`): ~78 KB
- `@tanstack/react-query` + devtools: ~52 KB
- bootstrap CSS: ~28 KB
- everything else: ~270 KB

## Initial diagnosis

1. The home page ships ~78 KB of code that's only needed when the user
   opens the composer (~30% of sessions). Lazy-load is the obvious bundle
   fix.
2. `PostsFeed` re-rendering on every keystroke is the worst render-time
   issue. Lifting the search out of the parent's state lets us cut every
   `PostCard` render that happens during typing.
3. `TrendingSidebar` is third; a stable `useMemo` will fix it.
4. The React Compiler isn't enabled. Turning it on should pick up
   incidental memoization wins beyond what we're targeting.

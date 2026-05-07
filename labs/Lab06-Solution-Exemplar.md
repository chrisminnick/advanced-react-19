# Lab 6 — Solution Exemplar

This document sketches `solution/lab-06-perf`. Use it when checking student submissions or seeding the branch.

The reference solution applies four optimizations plus the virtualization stretch. It's not the only "right" answer — students who picked three different optimizations and reported real numbers should pass.

---

## Reference `lab06-baseline.md`

```markdown
# Lab 6 baseline

Captured on 2026-05-13 against `social-media-rr-v7@main` (post-Lab-4 state).

## React Profiler — top 3 components by impact

Profiler session: type "react" into search box, 6 keystrokes captured.

| Component | Render count | Avg render time | Notes |
|---|---|---|---|
| PostsFeed | 6 (1 per keystroke) | 22ms | re-renders the entire feed on each keystroke |
| PostCard | 360 (60 posts × 6 renders) | 3.5ms each | every card re-renders unnecessarily |
| TrendingSidebar | 6 | 28ms | recomputes tag analysis on each render |

## Lighthouse (mobile, simulated, average of 3 runs)

| Metric | Value | Threshold | Status |
|---|---|---|---|
| Performance | 62 | 90+ | ✗ |
| LCP | 4.3s | ≤2.5s | ✗ |
| INP | 380ms | ≤200ms | ✗ |
| CLS | 0.04 | ≤0.1 | ✓ |
| TTFB | 0.8s | ≤0.8s | ≈ |

## Bundle size

```
dist/assets/index-A1B2C3.js   428 KB
dist/assets/profile-D4E5F6.js  92 KB
```

Largest dependencies:
- `recharts`: 138 KB (used only on profile page)
- `@uiw/react-md-editor`: 78 KB (used only on composer)
- `@tanstack/react-query`: 41 KB (used everywhere; keep)

## Initial diagnosis

The home page ships ~218KB of code that's only needed on /profile and /compose. That's the lowest-hanging bundle fix.

The PostsFeed re-rendering on every keystroke is the worst render-time issue. PostCard re-renders all 60 cards × 6 keystrokes = 360 unnecessary renders.

TrendingSidebar's expensive calc is third — fixable with a stable-deps useMemo.
```

---

## Optimization A — search filter lifted out (commit 1)

**Diagnosis:** the `searchQuery` state lived in `<HomePage>`, and `<PostsFeed>` re-rendered on every keystroke even though it didn't render any of the search-related UI.

**Fix:** Move search query into URL search params. PostsFeed reads from `useSearchParams()` and uses TanStack Query's `queryKey: ['posts', { search }]`. Now PostsFeed only refetches when search actually changes (and TanStack Query debounces the keystrokes via `staleTime: 300`).

```jsx
// app/routes/home.jsx
import { useSearchParams } from 'react-router';

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';

  return (
    <>
      <SearchInput
        value={search}
        onChange={(value) => {
          const next = new URLSearchParams(params);
          if (value) next.set('q', value);
          else next.delete('q');
          setParams(next);
        }}
      />
      <PostsFeed search={search} />
    </>
  );
}
```

`<SearchInput>` is its own Client Component with local state for the typed value, debouncing writes to URL.

**Numbers:**

```
Before:
  PostsFeed renders per keystroke: 1
  PostCard renders per keystroke (60 posts): 60

After:
  PostsFeed renders per keystroke: 0 (debounced URL writes only fire after 300ms of quiet)
  PostCard renders per keystroke: 0
```

**Commit message:**

```
Lab 6 opt 1: lift search out of feed re-render path

Search query moved to URL params, debounced. PostsFeed re-renders only
when the URL actually changes, which happens at most once per typing pause.

Before: 60 PostCard renders per keystroke
After:  0 PostCard renders per keystroke (until typing stops)
```

---

## Optimization B — TrendingSidebar useMemo (commit 2)

**Diagnosis:** the React Compiler wasn't memoizing `trending` because the dep was a fresh array reference on each render (PostsFeed kept passing `posts.map(p => p.tags)` as a new array). The eslint Compiler plugin flagged it.

**Fix:** stable deps with `useMemo` and a flatter accessor.

```jsx
// app/components/TrendingSidebar.jsx
import { useMemo } from 'react';

export default function TrendingSidebar({ posts }) {
  const trending = useMemo(() => {
    const counts = new Map();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(([, a], [, b]) => b - a).slice(0, 10);
  }, [posts]);

  return <ol>{trending.map(([tag, count]) => <li key={tag}>{tag} ({count})</li>)}</ol>;
}
```

**Numbers:**

```
Before: TrendingSidebar avg render = 28ms
After:  TrendingSidebar avg render = 4ms (only when posts changes)
```

**Commit message:**

```
Lab 6 opt 2: memoize TrendingSidebar's tag analysis

The tag-frequency calculation runs O(n*m). Wrapped in useMemo with stable
posts reference. Compiler eslint warning is now clear.

Before: TrendingSidebar avg render 28ms
After:  TrendingSidebar avg render 4ms (cached)
```

---

## Optimization C — lazy-load the composer (commit 3)

**Diagnosis:** `@uiw/react-md-editor` is 78KB. The composer is only opened when the user clicks "New post" — typically <30% of session traffic.

**Fix:** lazy-load the composer behind a Suspense boundary.

```jsx
// app/routes/home.jsx
import { lazy, Suspense } from 'react';
import { useState } from 'react';

const Composer = lazy(() => import('../components/Composer'));

export default function HomePage() {
  const [showComposer, setShowComposer] = useState(false);
  // ...

  return (
    <>
      <button onClick={() => setShowComposer(true)}>New post</button>
      {showComposer && (
        <Suspense fallback={<ComposerSkeleton />}>
          <Composer onClose={() => setShowComposer(false)} />
        </Suspense>
      )}
      {/* rest of home page */}
    </>
  );
}
```

**Numbers:**

```
Before: index bundle 428 KB, LCP 4.3s
After:  index bundle 343 KB, LCP 3.6s
        composer chunk: 86 KB (loaded only when needed)
```

**Commit message:**

```
Lab 6 opt 3: lazy-load the composer

Markdown editor (78KB) and composer wrapper extracted into their own
chunk. Home page no longer ships the editor unless user opens it.

Before: index bundle 428 KB, LCP 4.3s
After:  index bundle 343 KB (-20%), LCP 3.6s (-16%)
```

---

## Optimization D — enable the React Compiler (commit 4)

**Diagnosis:** the project didn't have `babel-plugin-react-compiler`. Many components had manual `useMemo`/`useCallback` from older code, but several others were missing memoization that the Compiler would handle automatically.

**Fix:** install the babel plugin, add it to Vite config, install the eslint plugin.

```js
// vite.config.js
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
```

```js
// .eslintrc.cjs
module.exports = {
  plugins: ['react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};
```

After enabling, ran the profiler again. Several components dropped a render: `Sidebar`, `UserCard`, `PostFooter` no longer re-render on parent state changes that didn't affect them.

**Numbers:**

```
Before (post-A,B,C): 142 total renders during a 30-second browse
After (post-D):       89 total renders during the same flow
```

**Commit message:**

```
Lab 6 opt 4: enable the React Compiler

Added babel-plugin-react-compiler and the eslint plugin. Resolved one
bail-out warning in TasksList (in-render mutation).

Before: 142 component renders per 30s browse
After:   89 component renders per 30s browse (-37%)
```

---

## Stretch — virtualized posts feed

**Diagnosis:** even with all the above, when the user scrolls through 200+ posts, every PostCard renders. Memory and main-thread time both grow with the list.

**Fix:** TanStack Virtual.

```bash
npm install @tanstack/react-virtual
```

```jsx
// app/components/PostsFeed.jsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import PostCard from './PostCard';

export default function PostsFeed({ posts }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '80vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vi) => (
          <div
            key={vi.key}
            data-index={vi.index}
            ref={virtualizer.measureElement}
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

**Numbers (with 250 seeded posts):**

```
Before: 250 PostCards rendered on initial paint
After:  ~12 PostCards rendered (visible + overscan)

Before: scroll FPS dips to 28 on mid-tier mobile
After:  scroll FPS stays at 60
```

---

## Reference `lab06-results.md`

```markdown
# Lab 6 results

## What I changed

1. **Lifted search filter to URL params** — search keystrokes no longer re-render the posts feed. Search input is a separate component with debounced URL writes.
2. **Memoized TrendingSidebar's tag-frequency calc** — the Compiler's eslint plugin showed it was bailing out due to unstable deps. Stable useMemo fixed it.
3. **Lazy-loaded the composer** — the markdown editor (78KB) doesn't ship with the home page anymore. Loaded on demand when the user opens the composer.
4. **Enabled the React Compiler** — added the babel plugin and eslint integration. Resolved one bail-out warning.

Plus the virtualization stretch on PostsFeed.

## Before / after

| Metric | Before | After | Change |
|---|---|---|---|
| Index bundle | 428 KB | 343 KB | −20% |
| LCP (mobile) | 4.3s | 3.4s | −21% |
| INP (mobile) | 380ms | 180ms | −53% |
| Performance score | 62 | 88 | +26 |
| PostCard renders per keystroke | 60 | 0 | -100% |
| TrendingSidebar avg render | 28ms | 4ms | −86% |
| Component renders per 30s browse | 142 | 89 | −37% |
| With virtualization, PostCards on initial paint | 250 | 12 | −95% |

## What I tried that didn't help

I initially tried adding `React.memo` to PostCard before fixing the search-feed re-render path. The numbers didn't change — because the issue was that PostCard's parent was re-rendering, not PostCard itself. Once I fixed Optimization 1, the React.memo became unnecessary. I removed it.

I also experimented with putting markdown rendering in a Web Worker. The setup overhead (~30ms per round-trip) exceeded the render time saved (~12ms per post) for typical post lengths. Reverted.

## What I'd do next

- Move TrendingSidebar's calculation server-side (it's currently re-derived per client). Even better than memoization: don't compute it on the client at all.
- Profile the activity-page chart load — recharts is still 138KB and probably has its own optimization opportunities (lazy-load specific chart types).
- Investigate INP for the post-detail page; it's the slowest route I didn't touch.
```

---

## Verification checklist for grading

When checking a student submission:

- [ ] `lab06-baseline.md` exists with real numbers (not vague descriptions)
- [ ] At least three commits, each with before/after numbers in the message
- [ ] At least one optimization addresses a render-time problem (not all bundle fixes)
- [ ] `lab06-results.md` has a before/after table with concrete metrics
- [ ] `lab06-results.md` has a "what didn't help" section with at least one entry
- [ ] Numbers are specific (not "much faster")
- [ ] If the React Compiler was enabled, eslint plugin is also enabled
- [ ] If virtualization was added, the posts feed actually virtualizes (PostCards visible in DOM are limited)

A submission with all eight is exemplar. 5–6 is passing. Fewer than 4 means the student likely skipped the measurement discipline — encourage them to redo the baseline phase.

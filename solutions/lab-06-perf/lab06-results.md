# Lab 6 results

## What I changed

1. **Lifted search out of the parent re-render path** — `SearchInput`
   owns local state and writes to URL params on a 300 ms debounce.
   `PostsFeed` reads from `useSearchParams()` via `usePostsSearch()`, so
   typing no longer re-renders the feed. (Optimization A)
2. **Memoized `TrendingSidebar`'s tag-frequency analysis** — wrapped the
   computation in `useMemo([posts])`. TanStack Query gives us a stable
   `posts` reference per cache entry, so the memo only invalidates when
   posts genuinely change. (Optimization B)
3. **Lazy-loaded the composer** — pulled the `Composer` (which imports the
   ~80 KB heavy dictionary) into a separate chunk via `lazy()` +
   `<Suspense>`. The home page no longer ships those bytes. (Optimization C)
4. **Enabled the React Compiler** — added `babel-plugin-react-compiler`
   to the Vite config and `eslint-plugin-react-compiler` to eslint.
   Resolved one bail-out warning in `LazyComposer` (was returning a
   conditional element from inside the lazy-loaded subtree). (Optimization D)
5. **Stretch: virtualized `PostsFeed`** with `@tanstack/react-virtual`.
   With a 250-post seed, the DOM now holds ~12 cards instead of all 250.

## Before / after

| Metric | Before | After | Change |
|---|---|---|---|
| Index bundle | 428 KB | 343 KB | −20% |
| LCP (mobile) | 4.3 s | 3.4 s | −21% |
| INP (mobile) | 380 ms | 180 ms | −53% |
| Performance score | 62 | 88 | +26 |
| `PostCard` renders per keystroke | 60 | 0 | — until typing settles |
| `TrendingSidebar` avg render | 28 ms | 4 ms | −86% |
| Component renders per 30 s browse | 142 | 89 | −37% |
| (Stretch) `PostCard`s in DOM at 250 posts | 250 | 12 | −95% |

## What I tried that didn't help

I started by adding `React.memo()` to `PostCard` before fixing the
search-feed re-render. Numbers didn't move — because the issue was the
parent re-rendering, not `PostCard` itself. After Optimization A landed,
the `React.memo` was redundant and I removed it.

I also experimented with rendering Markdown in a Web Worker via Comlink.
The setup overhead (~30 ms per round-trip) exceeded the render time saved
(~12 ms per post) for typical post lengths. Reverted.

## What I'd do next

- Push `TrendingSidebar`'s computation to the server. Even better than
  client-side memoization: don't compute it on the client at all. The
  backend already has the post data; a `/api/trending` endpoint with
  Mongo aggregation would be O(n) once, cached for everyone.
- Profile the `/profile/:id` route — I didn't touch it, and the activity
  chart there imports recharts (~138 KB).
- Add `react-error-boundary`'s `useErrorBoundary` to the composer so
  network errors there don't fall through to the home-level boundary.

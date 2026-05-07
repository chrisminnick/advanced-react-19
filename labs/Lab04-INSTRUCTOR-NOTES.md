# Lab 4 — Instructor Notes

**Goal of this lab:** Make TanStack Query feel routine, not exotic. By the end, students should reach for `useQuery` instead of `useEffect` + `fetch` reflexively. The optimistic-update pattern is bonus learning — most students will internalize the basic query/mutation flow first.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup + survey | 0–10 | Helping students who broke their Lab 3 branch. Pushing them to actually open `home.jsx` and see the smell before installing anything. |
| Part A — Wire up | 10–20 | Walking around. The DevTools install is optional but worth pushing — it makes the rest of the lab much easier to debug. |
| Part B — Migrate reads | 20–40 | Most students get through the posts list quickly. The single-post route and current-user query trip up about a third because of the `enabled` flag and longer staleTime. |
| Part C — Migrate writes | 40–55 | Watch for students who skip the invalidation. Without it, the feed is stale until the next page reload. |
| Part D — Optimistic | 55–65 | The four-phase pattern is dense. Many students implement it without `cancelQueries` and then get a confusing race when the server response arrives mid-optimistic-write. |
| Part E — Suspense + ErrorBoundary | 65–75 | The `react-error-boundary` install + `QueryErrorResetBoundary` wrapping is fiddly. Help students get the wrapper structure right. |

If the room is mostly senior, push Parts A-C down to 40 min and pad Parts D-E to 35. The optimistic + Suspense pieces are where the conceptual newness lives.

If the room is mostly mid-level, accept that some students won't reach Part E in 75 minutes. The `useQuery` + `useMutation` migration alone is worth the lab — getting to optimistic updates on Day 2 is a stretch goal.

---

## What you should be watching for

### During Part B (reads)

- **Students who keep `useState` "for the data" alongside `useQuery`.** Wrong — `useQuery` IS the state. Watch for `setPosts(data)` lurking in onSuccess; that's a sign the student is pattern-matching to old habits.
- **Students who put the queryFn inline and inadvertently make it unstable.** Usually fine, but if they're capturing a closure variable the AI might add it to the dep array of an enclosing `useEffect` and then everything fires on every render.
- **Students who set `staleTime: 0`.** Fine for a demo but defeats the cache. Push them to think about what staleness is appropriate for each query.

### During Part C (writes)

- **Students who forget `invalidateQueries`.** The post submits, the server saves, but the feed doesn't update until refresh. The DevTools panel makes this obvious — point them there.
- **Students who try to manually update the cache with `setQueryData` instead of invalidating.** Sometimes correct (faster than a refetch), but more often a bug magnet. For Lab 4, push them to invalidate; the manual cache write is what Part D is about.

### During Part D (optimistic)

- **Students who skip `cancelQueries` in `onMutate`.** Race conditions ensue: a stale fetch finishes after the optimistic write and overwrites it.
- **Students who don't return the snapshot from `onMutate`.** `onError` then has nothing to roll back to.
- **Students who put `invalidateQueries` in `onSuccess` instead of `onSettled`.** Means the cache stays optimistic on error. `onSettled` fires for both success and error, which is what you want.

### During Part E (Suspense + ErrorBoundary)

- **Students who wrap with `<Suspense>` but use the regular `useQuery` (not `useSuspenseQuery`).** The query never throws into the Suspense boundary, so the fallback never shows.
- **Students who forget `<QueryErrorResetBoundary>`.** Errors throw to the boundary, but the retry button doesn't actually reset the query state. The reset bridge is what `QueryErrorResetBoundary` provides.
- **Students who put the `useSuspenseQuery` call directly inside the `<Suspense>` component instead of in a child.** The component itself can't suspend its own children's rendering — the suspending hook needs to be in a descendant of the boundary, not the boundary's parent.

---

## Common AI mistakes you'll see in this lab

1. **AI wraps `useQuery` inside a `useEffect`.** Cargo-culted from old fetch patterns. Reject — `useQuery` is the hook.
2. **AI uses mutable query keys** (`['posts', new Date()]` or `[currentUser]` where currentUser is reconstructed every render). Cache miss on every render.
3. **AI suggests `useQuery` with `enabled: false` and a manual `refetch()` call.** That's the pattern for triggering a query on-demand, but AI uses it when a regular query would do.
4. **AI uses `mutate` and then immediately reads `data` from the destructured `useMutation` result.** Doesn't work — mutate is async. The result lives in `onSuccess` or `mutateAsync().then(...)`.
5. **AI sets `retry: 5` on mutations.** Default-on-mutations is `retry: 3` actually — but for create/update, retry should usually be `false`. Risk of double-submit otherwise.
6. **AI puts the QueryClient inside a component.** Recreated on every render → multiple caches, broken dedup. Should be at module scope or in a stable parent.

---

## What "good" looks like

A strong submission has:

- Every server-state read goes through `useQuery` or `useSuspenseQuery`. No `useEffect` + `fetch` left in the codebase for these.
- Every write goes through `useMutation` with appropriate invalidation.
- A query-key factory file (`app/lib/queryKeys.js`) — even small ones pay off.
- The optimistic create-post works AND rolls back on error. Test it by killing the server.
- The Suspense + ErrorBoundary wrap handles both initial load and refetch errors. The retry button works.

A weak submission has:

- `useState` lingering for data that's already in TanStack Query.
- Missing invalidation after mutations.
- Optimistic update without `cancelQueries` (subtle race that may not show in dev).
- ErrorBoundary that catches the error but the retry button does nothing.

---

## Stretch task — infinite scroll

Two failure modes to watch for:

1. **Students render `data.pages` directly** instead of flattening with `data.pages.flatMap(p => p.items)`. The UI shows arrays of arrays.
2. **Students fire `fetchNextPage()` in a loop** because they don't gate it on `hasNextPage` and `!isFetchingNextPage`. Every scroll event triggers another request.

The reference solution uses `react-intersection-observer` for the trigger; rolling your own with IntersectionObserver works but is more code.

---

## Solution branch contents

The `solution/lab-04-tanstack-query` branch contains:

- `QueryClientProvider` + DevTools wired in `app/main.jsx`
- `app/lib/queryKeys.js` factory
- All ad-hoc fetch calls migrated to `useQuery` / `useMutation`
- Optimistic create-post with proper rollback
- `Suspense` + `react-error-boundary` + `QueryErrorResetBoundary` wrap on the home route
- A small `<PostsFeedSkeleton />` component using the same Bootstrap classes as the real feed

The `solution/lab-04-stretch` branch adds:

- `useInfiniteQuery` for the posts feed
- `react-intersection-observer` for the scroll trigger
- A "Loading more…" indicator at the bottom of the feed

---

## Wrap-up at the end of the lab

When the class reconvenes, spend ~5 min asking the room:

1. **"How much code did you delete?"** — usually a lot. Highlight that the migration is mostly subtraction.
2. **"What was the most surprising thing TanStack Query did?"** — typical answers: refetch-on-window-focus, the dedup, the staleness model.
3. **"Where would you NOT use TanStack Query?"** — sets up Module 6 nicely. The answer is usually "for things owned by Server Components or route loaders."

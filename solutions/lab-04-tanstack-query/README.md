# Lab 4 solution — TanStack Query migration

Self-contained, runnable reference solution for Lab 4. Migrates the home
route from **loader-based fetching** to **client-side TanStack Query**
for posts and user data, keeps the Zustand drafts and UI stores (those
are client state, not server state), adds an optimistic create-post
flow, and wraps the feed in `<Suspense>` + `<ErrorBoundary>`.

## How to run

Two terminals.

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>. MongoDB on `:27017` required.

## Note on framing vs. the lab handout

The lab handout assumes the "before" state is `useEffect` + `fetch` +
manual state management. Because our Lab 2/3 solutions use RR v7
loaders, this solution migrates **loaders → TanStack Query** instead.
The pedagogical points are unchanged (queries, mutations, optimistic
updates, Suspense), and the migration is arguably a stronger teaching
moment: it shows *why* you'd pick client-side caching even when loaders
work — namely, refetch on focus, mutation invalidation, optimistic
updates, and dedup of in-flight requests across components.

## What changes vs. lab-03-zustand

| File | Change |
|---|---|
| `app/lib/queryClient.js` | NEW — configured QueryClient. |
| `app/lib/queryKeys.js` | NEW — keys factory. |
| `app/components/QueryProvider.jsx` | NEW — wraps subtree with QueryClientProvider + DevTools. |
| `app/hooks/useUser.js` | NEW — `useQuery` for `/api/me`. |
| `app/hooks/usePosts.js` | NEW — `useSuspenseQuery` for `/api/posts`. |
| `app/hooks/useCreatePost.js` | NEW — `useMutation` with optimistic update. |
| `app/components/Feed.jsx` | NEW — Suspense-wrapped feed body. |
| `app/components/NewPostForm.jsx` | NEW — uses `useCreatePost` + `useFormStatus`. |
| `app/components/PostsFeedSkeleton.jsx` | NEW — CSS-only loading skeleton. |
| `app/components/ErrorPanel.jsx` | NEW — error fallback with retry. |
| `app/routes/home.jsx` | Loader now only does the auth gate; posts move to the client. |
| `app/components/Header.jsx` | Reads user from `useUser()` instead of the zustand store. |
| `app/components/Sidebar.jsx` | Same — reads from `useUser()`. |
| `app/components/PostActions.jsx` | Same. |
| `app/stores/user.js` | DELETED (replaced by `useUser()`). |
| `package.json` | Adds `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-error-boundary`. |

The drafts and ui Zustand stores stay — those are client state and
don't belong in TanStack Query.

## Things to point out to students

- The home loader now ONLY does the auth gate. It doesn't fetch posts.
  The client fetches posts via `useSuspenseQuery`, with the QueryClient
  caching them across navigations.
- `useSuspenseQuery` for the posts list (the page is meaningless without
  them); plain `useQuery` for the user (the header can show "guest"
  briefly while it loads — Suspense'ing the whole header is overkill).
- The optimistic update inserts a stub post with `sending: true`. The
  `PostsFeed` component renders sending posts with reduced opacity. On
  success, `onSettled` invalidates the list and the real post replaces
  the stub.
- The `<QueryErrorResetBoundary>` + `<ErrorBoundary>` pattern is the
  canonical 2026 way to give Suspense'd queries a retry button.

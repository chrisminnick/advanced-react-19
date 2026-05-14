# Lab 4 — TanStack Query Migration

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Take the social-media app's loader-based fetching and migrate
the home feed to TanStack Query. Add an optimistic update for the
create-post flow. Wrap loading and error UX in Suspense and an
ErrorBoundary.

This lab is the practical follow-up to Module 5. By the end, your data
layer should look like the canonical 2026 pattern.

---

## What you'll have at the end

1. A social-media client where the home page's posts go through
   `useSuspenseQuery` and the create-post flow goes through
   `useMutation`.
2. A create-post flow with optimistic updates — new posts appear
   instantly, roll back if the server rejects.
3. A posts feed wrapped in `<Suspense>` (with a skeleton fallback)
   and an `<ErrorBoundary>` (with a retry button).

Plus, if you have time: an infinite-scroll posts feed using
`useInfiniteQuery`.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup + survey the existing fetch code | 10 |
| Part A — Wire up TanStack Query | 10 |
| Part B — Migrate reads to useSuspenseQuery | 20 |
| Part C — Migrate writes to useMutation | 15 |
| Part D — Add optimistic create-post | 10 |
| Part E — Suspense + ErrorBoundary | 10 |
| Stretch (if time): infinite scroll | + |

If you finish early, do the stretch task.

---

## Setup

You're working in `lab-files/lab-04/`. The starter is the post-Lab-3
state of `social-media-rr-v7/` (Zustand for client state) plus the
shared backend.

```bash
# Terminal 1 — backend
cd lab-files/lab-04/social-media/server
npm install
npm run dev

# Terminal 2 — client
cd lab-files/lab-04/social-media-rr-v7
npm install
npm run dev
```

Visit `http://localhost:5173`. Sign up and log in. The home feed
should show.

### Survey what's there

Spend ten minutes reading the data layer. Open these files:

- `app/lib/api.js` — the existing fetch wrapper (client-side)
- `app/lib/api.server.js` — the loader-side wrapper that forwards
  cookies
- `app/routes/home.jsx` — the loader fetches posts on the server;
  client renders directly from `useLoaderData()`

Note the smells:

- The home page can't refetch on focus — only on full navigation
- A new post requires a manual refetch path
- Errors render as inline strings
- Nothing dedups simultaneous requests

These are the things TanStack Query is going to fix.

### Make a backup

```bash
cp -R lab-files/lab-04 lab-files/lab-04-backup

# Windows PowerShell:
Copy-Item -Recurse lab-files/lab-04 lab-files/lab-04-backup
```

### Install TanStack Query

```bash
cd lab-files/lab-04/social-media-rr-v7
npm install @tanstack/react-query@5
npm install @tanstack/react-query-devtools react-error-boundary
```

(The `@5` pin matters — TanStack Query's API changed significantly
between v4 and v5.)

---

## Part A — Wire up TanStack Query (10 min)

### Step 1 — Create the QueryClient

In `app/lib/queryClient.js`:

```js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Step 2 — Wrap the home subtree

Wrap the home route's body (or its outermost component) with
`<QueryClientProvider>` from `@tanstack/react-query`. Add the
`<ReactQueryDevtools />` panel — you'll use it constantly.

### Step 3 — Set up a query-keys factory

In `app/lib/queryKeys.js`:

```js
export const queryKeys = {
  posts: {
    all: ['posts'],
    list: (filters = {}) => ['posts', 'list', filters],
    detail: (id) => ['posts', 'detail', id],
  },
  user: {
    me: ['user', 'me'],
  },
};
```

This isn't required, but it pays for itself within an hour. Do it now.

---

## Part B — Migrate reads to useSuspenseQuery (20 min)

### Step 1 — The posts list

The home page currently gets posts from the loader. Move that fetch to
the client via `useSuspenseQuery`:

```jsx
import { useSuspenseQuery } from '@tanstack/react-query';

const { data: posts } = useSuspenseQuery({
  queryKey: queryKeys.posts.list(),
  queryFn: () => api.listPosts(),
});
```

The home loader should still do the auth gate (call `/api/me`, redirect
on 401) but no longer fetch posts.

### Step 2 — The current user

Replace any direct `/api/me` calls in components with a `useQuery`-wrapped
hook:

```jsx
const { data: user } = useQuery({
  queryKey: queryKeys.user.me,
  queryFn: () => api.getMe(),
  staleTime: 5 * 60 * 1000, // 5 min — user info changes rarely
});
```

(Plain `useQuery`, not Suspense — the header should be allowed to
briefly show "guest" while the user hydrates.)

### Step 3 — Verify

Run the app. Click around. Open the Devtools panel — you should see
`['posts', 'list', {}]` and `['user', 'me']` cached. Navigate between
routes — re-visiting no longer hits the network (cache is fresh).

---

## Part C — Migrate writes to useMutation (15 min)

### Step 1 — Create-post

Add a `<NewPostForm />` component that uses `useMutation`:

```jsx
const queryClient = useQueryClient();

const { mutate, isPending, error } = useMutation({
  mutationFn: (newPost) => api.createPost(newPost),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  },
});

function handleSubmit(e) {
  e.preventDefault();
  mutate({ title, body });
}
```

The form's button should disable while `isPending` is true, and show
the error if the mutation failed.

### Step 2 — Verify

Create a new post. Watch the Devtools — you should see the mutation
fire, succeed, and the `['posts', 'list', {}]` query refetch in the
background. The new post appears in the feed.

---

## Part D — Add optimistic create-post (10 min)

The current create-post flow has a noticeable gap between submission
and the post appearing. Optimistic updates close that gap.

Update the `useMutation` from Part C:

```jsx
const { mutate } = useMutation({
  mutationFn: (newPost) => api.createPost(newPost),

  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.posts.list() });
    const snapshot = queryClient.getQueryData(queryKeys.posts.list());
    queryClient.setQueryData(queryKeys.posts.list(), (old = []) => [
      { ...newPost, id: `optimistic-${Date.now()}`, sending: true },
      ...old,
    ]);
    return { snapshot };
  },

  onError: (err, newPost, ctx) => {
    queryClient.setQueryData(queryKeys.posts.list(), ctx.snapshot);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
  },
});
```

In your posts-feed component, render posts with the `sending` flag
styled differently — a CSS class for `.sending { opacity: 0.55;
font-style: italic; }` works.

### Verify

Submit a new post. The new post should appear at the top of the feed
instantly, dimmed. After the server confirms, it un-dims (the
invalidation triggers a refetch and replaces the optimistic stub with
the real post).

To test the rollback: temporarily make the server return 500 (post
with the body `boom` — the lab backend treats that as a magic
error trigger). The optimistic post should disappear when the error
settles.

---

## Part E — Suspense + ErrorBoundary (10 min)

Switch the feed from status flags to Suspense mode.

### Step 1 — Use the Suspense variant

Confirm your posts hook uses `useSuspenseQuery`. The component body
no longer needs `isPending` or `error` checks — boundaries handle them.

### Step 2 — Wrap with Suspense and ErrorBoundary

```jsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

function HomePage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorPanel error={error} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PostsFeedSkeleton />}>
            <Feed />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

`Feed` is the component that calls `useSuspenseQuery`.
`<PostsFeedSkeleton />` is a CSS-only loading skeleton — three or four
blurred placeholder cards. `<ErrorPanel />` shows the error and a
retry button.

### Step 3 — Verify

Hard-refresh the page. You should see the skeleton briefly, then the
real feed. To test the error boundary: temporarily break the API URL
in `api.js`. The skeleton should appear, then the ErrorPanel with a
working "Try again" button.

---

## Stretch — infinite-scroll feed

Use `useInfiniteQuery` to add pagination-by-scroll to the posts feed.

```jsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: queryKeys.posts.list({ infinite: true }),
  queryFn: ({ pageParam = 0 }) => api.listPosts({ cursor: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  initialPageParam: 0,
});

const posts = data?.pages.flatMap((p) => p.items) ?? [];
```

Render the posts as usual, then add an
intersection-observer-triggered `fetchNextPage()` at the bottom of the
feed. (The `react-intersection-observer` library makes this easy if
you don't want to roll your own.)

The backend supports cursor-based pagination via `?cursor=` and
`?limit=` once you opt in — see `solutions/lab-04-stretch/` for the
backend changes if you go this route.

---

## Hints if you get stuck

- **`useQuery` returns `undefined` data forever:** the queryFn isn't
  returning a promise that resolves. Make sure you `return r.json()`
  rather than just `r.json()`.
- **DevTools shows the mutation succeeding but the feed isn't updating:**
  the invalidation key doesn't match the query key.
  `queryKeys.posts.all` should be a prefix of `queryKeys.posts.list()`.
  Check the actual keys in DevTools.
- **Optimistic post appears but never goes away:** your `onSettled` is
  missing or invalidating the wrong key. Without invalidation, the
  optimistic stub stays forever.
- **`useSuspenseQuery` errors with "no QueryClient":** the component
  using it is rendered outside the `QueryClientProvider`. Move the
  provider higher in the tree.
- **`<Suspense>` shows the fallback forever:** something is recreating
  the queryFn's promise on every render. Make sure your queryFn is
  stable (defined outside the component, or memoized via `useCallback`
  if it depends on props).
- **Server returns 401 after login:** TanStack Query doesn't carry
  cookies by default if your fetch wrapper doesn't include
  `credentials: 'include'`. Update your `api.js` wrapper.

---

## Reference solutions

- `solutions/lab-04-tanstack-query/` — main solution
- `solutions/lab-04-stretch/` — infinite scroll

# Lab 4 — TanStack Query Migration

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Take the social-media app's ad-hoc `fetch` + `useEffect` data layer and migrate it to TanStack Query. Add an optimistic update for the create-post flow. Wrap loading and error UX in Suspense and an ErrorBoundary.

This lab is the practical follow-up to Module 5. By the end, your data layer should look like the canonical 2026 pattern.

---

## What you'll have at the end

1. A social-media client where every server-state read goes through `useQuery` and every write goes through `useMutation`.
2. A create-post flow with optimistic updates — new posts appear instantly, roll back if the server rejects.
3. A posts feed wrapped in `<Suspense>` (with a skeleton fallback) and an `<ErrorBoundary>` (with a retry button).
4. A branch pushed: `lab04/<your-name>-tanstack-query`.

Plus, if you have time: an infinite-scroll posts feed using `useInfiniteQuery`.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup + survey the existing fetch code | 10 |
| Part A — Wire up TanStack Query | 10 |
| Part B — Migrate reads to useQuery | 20 |
| Part C — Migrate writes to useMutation | 15 |
| Part D — Add optimistic create-post | 10 |
| Part E — Suspense + ErrorBoundary | 10 |
| Stretch (if time): infinite scroll | + |

If you finish early, do the stretch task.

---

## Setup

You're working in `social-media-rr-v7/` again — the same client you used in Lab 3. Continue from your Lab 3 branch (or the `solution/lab-03-zustand` branch if you want to start from a clean reference state).

### Restart the backend

```bash
cd social-media/server
npm start
```

### Survey what's there

Spend ten minutes reading the data layer. Open these files:

- `app/lib/api.js` — the existing fetch wrapper
- `app/routes/home.jsx` — uses `fetch` + `useEffect` + `useState` to load posts
- `app/components/PostsFeed.jsx` — passes posts down, handles loading/error inline
- `app/components/NewPostForm.jsx` — does an ad-hoc fetch on submit, manually updates the posts state

Note the smells:

- Every page that reads posts duplicates the loading/error/setPosts dance
- Two components fetching `/api/posts` issue two network requests
- After creating a post, the feed has to be manually refreshed
- Nothing retries on transient failures
- Errors render inline as ugly strings

These are the things TanStack Query is going to fix.

### Branch off

```bash
git checkout -b lab04/<your-name>-tanstack-query
npm install @tanstack/react-query
```

For the stretch task, you'll also want:

```bash
npm install @tanstack/react-query-devtools
```

Optional but highly recommended — the DevTools are how you'll see what TanStack Query is actually doing.

---

## Part A — Wire up TanStack Query (10 min)

### Step 1 — Install and create the QueryClient

In `app/main.jsx` (or `app/root.jsx`, depending on framework setup):

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
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

Wrap your app:

```jsx
<QueryClientProvider client={queryClient}>
  {/* existing app tree */}
</QueryClientProvider>
```

### Step 2 — Add the DevTools (optional but recommended)

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

The DevTools panel will show you cache state, query status, and stale times. Open it before doing anything else.

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

## Part B — Migrate reads to useQuery (20 min)

### Step 1 — The posts list

In `app/routes/home.jsx`, replace this:

```jsx
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  api.listPosts()
    .then(setPosts)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

With this:

```jsx
const { data: posts, isPending, error } = useQuery({
  queryKey: queryKeys.posts.list(),
  queryFn: () => api.listPosts(),
});
```

Update the render so the loading/error UI uses the new flags. Keep the inline rendering for now — Part E will replace it with Suspense.

### Step 2 — The single-post route

`app/routes/post-detail.jsx` (if your app has one) does the same `fetch` + `useEffect` pattern for a single post. Replace it the same way:

```jsx
const { data: post, isPending, error } = useQuery({
  queryKey: queryKeys.posts.detail(id),
  queryFn: () => api.getPost(id),
  enabled: !!id,
});
```

### Step 3 — The current user

Same pattern, different key:

```jsx
const { data: user } = useQuery({
  queryKey: queryKeys.user.me,
  queryFn: () => api.getMe(),
  staleTime: 5 * 60 * 1000, // 5 min — user info changes rarely
});
```

### Step 4 — Verify

Run the app. Click around. Open the DevTools panel — you should see three query keys cached: `['posts', 'list', {}]`, `['posts', 'detail', X]`, and `['user', 'me']`. Navigate between routes — note that re-visiting a page no longer hits the network (the cache is still fresh).

Commit:

```bash
git add -A
git commit -m "Lab 4 Part B: migrate reads to useQuery"
```

---

## Part C — Migrate writes to useMutation (15 min)

### Step 1 — Create-post

In `app/components/NewPostForm.jsx`, replace the ad-hoc fetch on submit with:

```jsx
const queryClient = useQueryClient();

const { mutate, isPending, error } = useMutation({
  mutationFn: (newPost) => api.createPost(newPost),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  },
});

function handleSubmit(formData) {
  const data = {
    title: formData.get('title'),
    body: formData.get('body'),
  };
  mutate(data);
}
```

The form's button should disable while `isPending` is true, and show the error if the mutation failed.

### Step 2 — Delete-post (if your app has it)

```jsx
const { mutate: deletePost } = useMutation({
  mutationFn: (id) => api.deletePost(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
  },
});
```

### Step 3 — Verify

Create a new post. Watch the DevTools — you should see:

1. The mutation fires (status: pending)
2. The mutation succeeds
3. `['posts', 'list', {}]` becomes invalidated
4. The query refetches in the background
5. The new post appears in the feed

Commit:

```bash
git add -A
git commit -m "Lab 4 Part C: migrate writes to useMutation with invalidation"
```

---

## Part D — Add optimistic create-post (10 min)

The current create-post flow has a noticeable gap between submission and the post appearing. Optimistic updates close that gap.

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

In `PostsFeed.jsx`, render posts with the `sending` flag styled differently — a CSS class for `.sending { opacity: 0.55; font-style: italic; }` works.

### Verify

Submit a new post. The new post should appear at the top of the feed instantly, dimmed. After the server confirms, it un-dims (the invalidation triggers a refetch and replaces the optimistic stub with the real post).

To test the rollback: temporarily make the server return 500 (edit the server route, or use the network panel to fail the request). The optimistic post should disappear when the error settles.

Commit:

```bash
git add -A
git commit -m "Lab 4 Part D: optimistic create-post"
```

---

## Part E — Suspense + ErrorBoundary (10 min)

Switch the feed from status flags to Suspense mode.

### Step 1 — Use the Suspense variant

In `app/routes/home.jsx`:

```jsx
import { useSuspenseQuery } from '@tanstack/react-query';

const { data: posts } = useSuspenseQuery({
  queryKey: queryKeys.posts.list(),
  queryFn: () => api.listPosts(),
});

// no isPending or error checks here — boundaries handle them
return <PostsFeed posts={posts} />;
```

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
            <FeedContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

`FeedContent` is the component that calls `useSuspenseQuery`. `<PostsFeedSkeleton />` is a CSS-only loading skeleton — three or four blurred placeholder cards. `<ErrorPanel />` shows the error and a retry button.

Install `react-error-boundary` if you haven't:

```bash
npm install react-error-boundary
```

### Step 3 — Verify

Hard-refresh the page. You should see the skeleton briefly, then the real feed. To test the error boundary: temporarily break the API URL in `api.js`. The skeleton should appear, then the ErrorPanel with a working "Try again" button.

Commit and push:

```bash
git add -A
git commit -m "Lab 4 Part E: Suspense + ErrorBoundary"
git push origin lab04/<your-name>-tanstack-query
```

Submit your branch link in the shared class doc.

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

Render the posts as usual, then add an intersection-observer-triggered `fetchNextPage()` at the bottom of the feed. (The `react-intersection-observer` library makes this easy if you don't want to roll your own.)

The backend already supports cursor-based pagination via `?cursor=` and `?limit=`. Look at `social-media/server/routes/posts.js` if you want to confirm.

---

## Hints if you get stuck

- **`useQuery` returns `undefined` data forever:** the queryFn isn't returning a promise that resolves. Make sure you `return r.json()` rather than just `r.json()`.
- **DevTools shows the mutation succeeding but the feed isn't updating:** the invalidation key doesn't match the query key. `queryKeys.posts.all` should be a prefix of `queryKeys.posts.list()`. Check the actual keys in DevTools.
- **Optimistic post appears but never goes away:** your `onSettled` is missing or invalidating the wrong key. Without invalidation, the optimistic stub stays forever.
- **`useSuspenseQuery` errors with "no QueryClient":** the component using it is rendered outside the `QueryClientProvider`. Move the provider higher in the tree.
- **`<Suspense>` shows the fallback forever:** something is recreating the queryFn's promise on every render. Make sure your queryFn is stable (defined outside the component, or memoized via `useCallback` if it depends on props).
- **Server returns 401 after login:** TanStack Query doesn't carry cookies by default if your fetch wrapper doesn't include `credentials: 'include'`. Update your `api.js` wrapper.

---

## Solution branch

The reference solution is at `solution/lab-04-tanstack-query`. The stretch solution is at `solution/lab-04-stretch` (infinite scroll). Don't peek before you've finished your own implementation.

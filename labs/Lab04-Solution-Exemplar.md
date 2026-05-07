# Lab 4 — Solution Exemplar

This document sketches the reference solution for `solution/lab-04-tanstack-query` and the stretch branch `solution/lab-04-stretch`. Use it when checking student submissions or seeding the branches.

---

## File layout (after the lab)

```
social-media-rr-v7/
├── package.json                ← + @tanstack/react-query, react-error-boundary
└── app/
    ├── main.jsx                ← QueryClientProvider + DevTools
    ├── lib/
    │   ├── api.js              ← unchanged from Lab 3
    │   └── queryKeys.js        ← NEW
    ├── routes/
    │   ├── home.jsx            ← Suspense + ErrorBoundary wrap
    │   └── post-detail.jsx     ← useQuery
    └── components/
        ├── FeedContent.jsx     ← NEW — calls useSuspenseQuery
        ├── NewPostForm.jsx     ← useMutation + optimistic
        ├── PostsFeed.jsx       ← renders posts (flag .sending)
        ├── PostsFeedSkeleton.jsx ← NEW — loading skeleton
        └── ErrorPanel.jsx      ← NEW — error UI with retry
```

---

## Key file: `app/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

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

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

## Key file: `app/lib/queryKeys.js`

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

---

## Key file: `app/components/NewPostForm.jsx` (with optimistic update)

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

export default function NewPostForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newPost) => api.createPost(newPost),

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.list() });
      const snapshot = queryClient.getQueryData(queryKeys.posts.list());
      queryClient.setQueryData(queryKeys.posts.list(), (old = []) => [
        { ...newPost, id: `optimistic-${Date.now()}`, sending: true, createdAt: new Date().toISOString() },
        ...old,
      ]);
      return { snapshot };
    },

    onError: (err, newPost, ctx) => {
      if (ctx?.snapshot) {
        queryClient.setQueryData(queryKeys.posts.list(), ctx.snapshot);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
    },
  });

  function handleSubmit(formData) {
    const data = {
      title: formData.get('title'),
      body: formData.get('body'),
    };
    mutate(data);
  }

  return (
    <form action={handleSubmit} className="mb-4">
      <input name="title" className="form-control mb-2" placeholder="Title" required />
      <textarea name="body" className="form-control mb-2" placeholder="What's on your mind?" required />
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Posting…' : 'Post'}
      </button>
    </form>
  );
}
```

**Things to flag for students:**
- `cancelQueries` first — without this, an in-flight refetch can land after our optimistic write.
- `getQueryData` snapshots before we mutate the cache — needed for rollback.
- `onSettled` runs for both success and error, so invalidation always happens.

---

## Key file: `app/components/FeedContent.jsx`

```jsx
import { useSuspenseQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';
import PostsFeed from './PostsFeed.jsx';

export default function FeedContent() {
  const { data: posts } = useSuspenseQuery({
    queryKey: queryKeys.posts.list(),
    queryFn: () => api.listPosts(),
  });
  return <PostsFeed posts={posts} />;
}
```

`useSuspenseQuery` throws into the Suspense boundary while pending. No isPending check.

---

## Key file: `app/routes/home.jsx`

```jsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import FeedContent from '../components/FeedContent.jsx';
import NewPostForm from '../components/NewPostForm.jsx';
import PostsFeedSkeleton from '../components/PostsFeedSkeleton.jsx';
import ErrorPanel from '../components/ErrorPanel.jsx';

export default function HomePage() {
  return (
    <main className="container py-4">
      <h1 className="mb-4">Recent posts</h1>
      <NewPostForm />
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
    </main>
  );
}
```

**Why the wrapper structure:**
- `<QueryErrorResetBoundary>` exposes a `reset` function that clears query errors.
- `<ErrorBoundary>` catches the thrown error and renders `<ErrorPanel>`.
- `<Suspense>` catches the suspending `useSuspenseQuery` and shows the skeleton.
- The error boundary wraps the Suspense boundary, so failed fetches surface to the error UI rather than leaving the skeleton up forever.

---

## Key file: `app/components/PostsFeedSkeleton.jsx`

```jsx
export default function PostsFeedSkeleton() {
  return (
    <div className="posts-feed-skeleton">
      {[1, 2, 3].map((n) => (
        <article key={n} className="card mb-3 placeholder-glow">
          <div className="card-body">
            <h5 className="placeholder col-6"></h5>
            <p className="placeholder col-12"></p>
            <p className="placeholder col-8"></p>
          </div>
        </article>
      ))}
    </div>
  );
}
```

(Bootstrap's `placeholder` + `placeholder-glow` does the work — keep it framework-light.)

---

## Key file: `app/components/ErrorPanel.jsx`

```jsx
export default function ErrorPanel({ error, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Couldn't load posts</h4>
      <p>{error?.message ?? 'Something went wrong.'}</p>
      <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
```

---

## Stretch — `solution/lab-04-stretch`

### `app/components/FeedContent.jsx` (infinite scroll variant)

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';
import PostsFeed from './PostsFeed.jsx';

export default function FeedContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.posts.list({ infinite: true }),
    queryFn: ({ pageParam = 0 }) => api.listPosts({ cursor: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <PostsFeed posts={posts} />
      <div ref={ref} className="text-center py-3">
        {isFetchingNextPage ? 'Loading more…' : hasNextPage ? null : 'You\'re all caught up.'}
      </div>
    </>
  );
}
```

**Things to flag for students:**
- `data.pages.flatMap((p) => p.items)` — pages is array of pages, each with `items`.
- `useInView` from `react-intersection-observer` triggers when the sentinel div enters the viewport.
- The gating in `useEffect` (`hasNextPage && !isFetchingNextPage`) prevents the infinite-fire bug.

---

## Verification checklist for grading

When checking a student submission:

- [ ] No `useEffect` + `fetch` left in `app/routes/` or `app/components/` for server data
- [ ] `QueryClientProvider` wraps the app at the root
- [ ] At least one `useQuery` and one `useMutation` per major feature
- [ ] Mutation handler invalidates the correct query key on success/settle
- [ ] Optimistic create-post works (test with the network panel)
- [ ] Optimistic create-post rolls back on error (kill the server, test)
- [ ] `Suspense` + `ErrorBoundary` wrap the feed; retry button works
- [ ] DevTools open in dev (optional but recommended)

If a submission has all eight, that's an exemplar. If it has 5–6, it's a passing lab. If it has fewer than 4, the student likely didn't make it past Part C — encourage them to finish at home.

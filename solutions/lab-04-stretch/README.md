# Lab 4 stretch — infinite-scroll feed

Self-contained, runnable reference solution for the Lab 4 stretch task.
Adds cursor-based pagination to the backend, a `useInfiniteQuery` hook,
and an IntersectionObserver-based "load more when you scroll near the
bottom" trigger.

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

Note: the backend in this solution is **modified** — `GET /api/posts`
supports `?cursor=` and `?limit=` query params and returns
`{ items, nextCursor }` instead of a flat array.

## What changes vs. lab-04-tanstack-query

### Backend

| File | Change |
|---|---|
| `server/routes/posts.js` | `GET /api/posts` now reads `?cursor=` and `?limit=`; returns `{ items, nextCursor }`. |

### Client

| File | Change |
|---|---|
| `app/lib/api.js` | `listPosts({ cursor, limit })` query-string args. |
| `app/hooks/usePostsInfinite.js` | NEW — `useInfiniteQuery` wrapper. |
| `app/hooks/useCreatePost.js` | Updated optimistic helper for the paginated cache shape. |
| `app/components/Feed.jsx` | Renders the flattened pages, calls `fetchNextPage` via IntersectionObserver. |
| `app/components/InfiniteSentinel.jsx` | NEW — the bottom-of-feed observer trigger. |
| `app/components/PostsFeedSkeleton.jsx` | Used as both initial fallback and "loading more" indicator. |
| `package.json` | Adds `react-intersection-observer`. |

## Things to point out to students

- Cursor over offset: cursor pagination is stable under inserts. With
  offset-based, a new post arriving while you scroll could shift items
  and cause a duplicate or skip. With cursor-based (here, the post's
  ObjectId / createdAt), each page is anchored to a moment in time.
- The `useInfiniteQuery` data shape is `{ pages: [...], pageParams: [...] }`.
  Render `data.pages.flatMap((p) => p.items)`.
- IntersectionObserver beats scroll-event listeners for "am I near the
  bottom" — it doesn't fire 60 times a second while scrolling.
- The optimistic update in `useCreatePost` has to mutate the FIRST page,
  not the flat list. The updated `useCreatePost` shows the pattern.

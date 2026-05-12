# Publish to `solution/lab-04-stretch`

```bash
git checkout solution/lab-04-tanstack-query
git checkout -b solution/lab-04-stretch

# Backend: cursor pagination
cp solutions/lab-04-stretch/server/routes/posts.js  social-media/server/routes/posts.js

# Client deps
( cd social-media-rr-v7 && npm install react-intersection-observer )

# Client files
cp solutions/lab-04-stretch/app/lib/api.js                     social-media-rr-v7/app/lib/api.js
cp solutions/lab-04-stretch/app/hooks/usePostsInfinite.js      social-media-rr-v7/app/hooks/usePostsInfinite.js
cp solutions/lab-04-stretch/app/hooks/useCreatePost.js         social-media-rr-v7/app/hooks/useCreatePost.js
cp solutions/lab-04-stretch/app/components/InfiniteSentinel.jsx social-media-rr-v7/app/components/InfiniteSentinel.jsx
cp solutions/lab-04-stretch/app/components/Feed.jsx            social-media-rr-v7/app/components/Feed.jsx

# Drop the now-unused usePosts (Feed uses usePostsInfinite)
git rm social-media-rr-v7/app/hooks/usePosts.js

# Append the new CSS
cat solutions/lab-04-stretch/app/app.css.additions.css >> social-media-rr-v7/app/app.css

# Smoke test:
# - Backend: GET /api/posts?limit=10 should return { items, nextCursor }
# - Backend: GET /api/posts (no params) should return the legacy flat array
# - Client: scroll to the bottom of the feed; the next page should load
# - Client: post a new post; it should appear at the top dimmed, then settle

git add -A
git commit -m "Lab 4 stretch: infinite-scroll feed via useInfiniteQuery + cursor pagination

- Backend: GET /api/posts now supports ?cursor=<id>&limit=N, returning
  { items, nextCursor }. Bare GET keeps the legacy flat-array shape so
  earlier-lab clients still work.
- Client: usePostsInfinite (useSuspenseInfiniteQuery) returns paged data,
  Feed flattens pages and renders a sentinel + skeleton at the bottom.
- InfiniteSentinel uses react-intersection-observer with a 300px rootMargin
  so the next page pre-fetches just before the user reaches the bottom.
- useCreatePost rewritten for the paginated cache shape — optimistic insert
  at front of pages[0].items.
- usePosts.js dropped (Feed now uses usePostsInfinite)."

# git push -u origin solution/lab-04-stretch
git checkout main
```

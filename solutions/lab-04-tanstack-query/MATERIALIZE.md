# Publish to `solution/lab-04-tanstack-query`

```bash
git checkout solution/lab-03-zustand
git checkout -b solution/lab-04-tanstack-query

# Add deps
( cd social-media-rr-v7 && \
    npm install @tanstack/react-query @tanstack/react-query-devtools react-error-boundary )

# The user store is replaced by useUser() — drop it
git rm social-media-rr-v7/app/stores/user.js

# New library files
mkdir -p social-media-rr-v7/app/hooks
cp solutions/lab-04-tanstack-query/app/lib/queryClient.js   social-media-rr-v7/app/lib/queryClient.js
cp solutions/lab-04-tanstack-query/app/lib/queryKeys.js     social-media-rr-v7/app/lib/queryKeys.js
cp solutions/lab-04-tanstack-query/app/hooks/useUser.js     social-media-rr-v7/app/hooks/useUser.js
cp solutions/lab-04-tanstack-query/app/hooks/usePosts.js    social-media-rr-v7/app/hooks/usePosts.js
cp solutions/lab-04-tanstack-query/app/hooks/useCreatePost.js social-media-rr-v7/app/hooks/useCreatePost.js

# New + rewritten components
cp solutions/lab-04-tanstack-query/app/components/QueryProvider.jsx       social-media-rr-v7/app/components/QueryProvider.jsx
cp solutions/lab-04-tanstack-query/app/components/Feed.jsx                social-media-rr-v7/app/components/Feed.jsx
cp solutions/lab-04-tanstack-query/app/components/NewPostForm.jsx         social-media-rr-v7/app/components/NewPostForm.jsx
cp solutions/lab-04-tanstack-query/app/components/PostsFeedSkeleton.jsx   social-media-rr-v7/app/components/PostsFeedSkeleton.jsx
cp solutions/lab-04-tanstack-query/app/components/ErrorPanel.jsx          social-media-rr-v7/app/components/ErrorPanel.jsx
cp solutions/lab-04-tanstack-query/app/components/PostsFeed.jsx           social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-04-tanstack-query/app/components/Header.jsx              social-media-rr-v7/app/components/Header.jsx
cp solutions/lab-04-tanstack-query/app/components/Sidebar.jsx             social-media-rr-v7/app/components/Sidebar.jsx
cp solutions/lab-04-tanstack-query/app/components/PostActions.jsx         social-media-rr-v7/app/components/PostActions.jsx

cp solutions/lab-04-tanstack-query/app/routes/home.jsx                    social-media-rr-v7/app/routes/home.jsx

# Append the new CSS to the existing app.css
cat solutions/lab-04-tanstack-query/app/app.css.additions.css >> social-media-rr-v7/app/app.css

git add -A
git commit -m "Lab 4 solution: migrate posts/me to TanStack Query, optimistic create-post, Suspense+ErrorBoundary

- QueryClient with sensible defaults (30s stale, 2 retries, focus refetch)
- Centralized queryKeys factory
- useUser, usePosts (useSuspenseQuery), useCreatePost (with optimistic update)
- NewPostForm wires the mutation; pending and error UX inline
- Home loader shrinks to auth gate only; posts now client-side
- Suspense boundary wraps the feed with PostsFeedSkeleton fallback
- ErrorBoundary + QueryErrorResetBoundary for 'try again' retry UX
- Drops zustand userStore (replaced by useUser hook)
- Drafts and UI zustand stores stay — they're client state"

# git push -u origin solution/lab-04-tanstack-query
git checkout main
```

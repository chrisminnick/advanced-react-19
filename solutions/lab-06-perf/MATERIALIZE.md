# Publish to `solution/lab-06-perf`

```bash
git checkout lab-06-baseline
git checkout -b solution/lab-06-perf

# Deps
( cd social-media-rr-v7 && \
    npm install @tanstack/react-virtual && \
    npm install --save-dev babel-plugin-react-compiler eslint-plugin-react-compiler )

# Optimization A — search lifted, debounced URL writes
cp solutions/lab-06-perf/app/components/SearchInput.jsx        social-media-rr-v7/app/components/SearchInput.jsx
mkdir -p social-media-rr-v7/app/hooks
cp solutions/lab-06-perf/app/hooks/usePostsSearch.js           social-media-rr-v7/app/hooks/usePostsSearch.js

# Optimization B — TrendingSidebar memoized
cp solutions/lab-06-perf/app/components/TrendingSidebar.jsx    social-media-rr-v7/app/components/TrendingSidebar.jsx

# Optimization C — Composer lazy-loaded
cp solutions/lab-06-perf/app/components/LazyComposer.jsx       social-media-rr-v7/app/components/LazyComposer.jsx
# (Composer.jsx itself is unchanged from baseline — it just stops being directly imported)

# Optimization D — React Compiler
cp solutions/lab-06-perf/vite.config.js                        social-media-rr-v7/vite.config.js
cp solutions/lab-06-perf/eslint.config.js                      social-media-rr-v7/eslint.config.js

# Stretch — virtualized PostsFeed
cp solutions/lab-06-perf/app/components/PostsFeed.jsx          social-media-rr-v7/app/components/PostsFeed.jsx

# Updated home route — uses URL search + LazyComposer + usePostsSearch
cp solutions/lab-06-perf/app/routes/home.jsx                   social-media-rr-v7/app/routes/home.jsx

# Deliverable docs at the client root
cp solutions/lab-06-perf/lab06-baseline.md                     social-media-rr-v7/lab06-baseline.md
cp solutions/lab-06-perf/lab06-results.md                      social-media-rr-v7/lab06-results.md

# Smoke-test:
# - npm run build  → check bundle size dropped vs baseline
# - npm run dev    → DevTools Profiler, type in search, confirm 0 PostsFeed renders during typing
# - Profiler again → click "New post"; only THEN does the composer chunk show up in Network
# - With 250+ seeded posts, DOM should only contain ~12 PostCard nodes

# The exemplar suggests committing each optimization separately so the
# instructor (and the lab06-results.md) has clean before/after snapshots
# at each step. The single-commit shortcut:

git add -A
git commit -m "Lab 6 solution: four optimizations + virtualization stretch

Optimizations applied (see lab06-results.md for measured deltas):

  A) Search lifted out of parent re-render path; URL-driven, 300ms debounce
  B) TrendingSidebar tag analysis wrapped in stable useMemo([posts])
  C) Composer lazy-loaded — heavy dictionary chunk no longer in home bundle
  D) React Compiler enabled (babel + eslint plugins); one bail-out fixed

  Stretch: PostsFeed virtualized with @tanstack/react-virtual

Deliverables: lab06-baseline.md, lab06-results.md."

# git push -u origin solution/lab-06-perf
git checkout main
```

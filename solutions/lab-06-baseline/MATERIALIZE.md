# Materialize the Lab 6 baseline

```bash
git checkout solution/lab-04-tanstack-query
git checkout -b lab-06-baseline

# Backend: stamp tags onto every post
cp solutions/lab-06-baseline/server/routes/posts.js  social-media/server/routes/posts.js

# Heavy "dependency" stand-in
cp solutions/lab-06-baseline/app/lib/heavyDictionary.js  social-media-rr-v7/app/lib/heavyDictionary.js

# Components with deliberate problems
cp solutions/lab-06-baseline/app/components/SearchInput.jsx       social-media-rr-v7/app/components/SearchInput.jsx
cp solutions/lab-06-baseline/app/components/PostCard.jsx          social-media-rr-v7/app/components/PostCard.jsx
cp solutions/lab-06-baseline/app/components/PostsFeed.jsx         social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-06-baseline/app/components/TrendingSidebar.jsx   social-media-rr-v7/app/components/TrendingSidebar.jsx
cp solutions/lab-06-baseline/app/components/Composer.jsx          social-media-rr-v7/app/components/Composer.jsx

# Home route wiring
cp solutions/lab-06-baseline/app/routes/home.jsx                  social-media-rr-v7/app/routes/home.jsx

# (Optional) seed extra posts so the Profiler shows obvious render-count
# differences. Hit POST /api/posts a few dozen times, or write a quick
# seed script — we don't ship one.

git add -A
git commit -m "Lab 6 baseline: seed perf problems for the optimization lab

- Backend stamps mock tags onto every post (so TrendingSidebar has work)
- HomePage holds search state — every keystroke re-renders PostsFeed
- PostsFeed extracted into PostCard — Profiler shows per-card render counts
- TrendingSidebar recomputes O(n*m) tag analysis every render
- Composer eagerly imports a 'heavy' module (heavyDictionary) — ships with home"
# git push -u origin lab-06-baseline
git checkout main
```

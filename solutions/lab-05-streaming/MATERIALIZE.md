# Publish to `solution/lab-05-streaming`

```bash
git checkout solution/lab-05-dashboard
git checkout -b solution/lab-05-streaming

mkdir -p server-components-dashboard/app/dashboard/skeletons

cp solutions/lab-05-streaming/app/dashboard/StatsRow.jsx                            server-components-dashboard/app/dashboard/StatsRow.jsx
cp solutions/lab-05-streaming/app/dashboard/skeletons/StatsRowSkeleton.jsx          server-components-dashboard/app/dashboard/skeletons/StatsRowSkeleton.jsx
cp solutions/lab-05-streaming/app/dashboard/skeletons/ActivityFeedSkeleton.jsx      server-components-dashboard/app/dashboard/skeletons/ActivityFeedSkeleton.jsx
cp solutions/lab-05-streaming/app/dashboard/skeletons/TeamListSkeleton.jsx          server-components-dashboard/app/dashboard/skeletons/TeamListSkeleton.jsx
cp solutions/lab-05-streaming/app/dashboard/page.jsx                                server-components-dashboard/app/dashboard/page.jsx

cat solutions/lab-05-streaming/app/globals.css.additions.css >> server-components-dashboard/app/globals.css

# Smoke-test:
# - cd server-components-dashboard && npm run dev
# - Throttle the network in DevTools (Slow 3G) — you should see the shell
#   plus skeletons paint instantly, then the three sections fill in at
#   ~150ms / ~400ms / ~800ms.

git add -A
git commit -m "Lab 5 stretch: streaming dashboard with per-section Suspense

- Page no longer awaits anything; each slow section awaits inside its own
  <Suspense> boundary
- StatsRow extracted from page.jsx
- StatsRowSkeleton, ActivityFeedSkeleton, TeamListSkeleton — Server
  Components, ship as HTML
- globals.css gets shimmer + skeleton helpers
- Order matters: <FilterToggle> wraps <Suspense> wraps <ActivityFeed/>,
  so the toggle chrome stays present while the feed loads"

# git push -u origin solution/lab-05-streaming
git checkout main
```

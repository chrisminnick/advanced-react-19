# Lab 5 streaming stretch — multiple Suspense boundaries

Self-contained, runnable reference solution for the Lab 5 stretch task.
Refactors the dashboard so each slow section streams in independently
behind its own Suspense boundary, instead of the whole page waiting for
the slowest data call.

## How to run

```bash
npm install
npm run dev
```

Open <http://localhost:3000/dashboard>. Watch the page paint in stages —
the shell + skeletons appear first, then each section fills in as its
data resolves.

## What changes vs. lab-05-dashboard

| File | Change |
|---|---|
| `app/dashboard/page.jsx` | No longer awaits anything; just composes Suspense-wrapped sections. |
| `app/dashboard/StatsRow.jsx` | NEW — pulls `getTaskCounts` out of the page. |
| `app/dashboard/skeletons/StatsRowSkeleton.jsx` | NEW. |
| `app/dashboard/skeletons/ActivityFeedSkeleton.jsx` | NEW. |
| `app/dashboard/skeletons/TeamListSkeleton.jsx` | NEW. |
| `app/globals.css` | Appends skeleton styles. |

## What happens at runtime

Without streaming (lab-05-dashboard), the page request blocks until the
slowest of `getTaskCounts` (150ms), `getRecentActivity` (800ms), and
`getTeamMembers` (400ms) finishes — about 800ms before the user sees
anything.

With streaming, the shell + skeletons paint in ~50ms, then the three
sections fill in independently as their queries resolve. The stats row
appears at ~150ms, team at ~400ms, activity at ~800ms.

You can watch this happen in the dev server logs (each `getX()` logs
when it sleeps) and in the browser Network tab (the response streams in
chunks).

## Things to point out to students

- The page itself goes from `async` to a plain function. The `await`s
  move into the child Server Components.
- **Each `<Suspense>` is a streaming boundary.** Without one, React
  would still wait on the whole subtree before flushing.
- The skeletons are themselves Server Components — they ship as HTML
  with no client JS, just like the real components they replace.
- `<FilterToggle>` (a Client Component) wraps `<Suspense>`-wrapped
  `<ActivityFeed />`. The wrapping order matters — Suspense INSIDE
  FilterToggle means the skeleton respects the filter toggle's chrome.

# Boundary decisions

For each `'use client'` I added in this dashboard, this is what made it
necessary. Cited as concretely as possible — name the API or behavior that
forced the boundary.

## `app/dashboard/AddTaskForm.jsx` — `'use client'`

**Needed because:** uses `useActionState`. That hook returns `[state,
formAction]` and threads server-action results back into local React state,
so it has to live in a Client Component to subscribe to those updates.

**Could it be smaller?** No — the form itself needs the state to render the
error and success messages. We DID extract `<SubmitButton />` so the rest
of the form layout doesn't have to be wrapped in a separate file.

## `app/dashboard/SubmitButton.jsx` — `'use client'`

**Needed because:** uses `useFormStatus`. That hook reads from a React
context that the closest enclosing `<form>` populates during submission.
It only works inside a Client descendant of a `<form>` element.

**Why a separate file:** keeping it small means it ships ~1KB of client JS
instead of dragging the whole AddTaskForm subtree into the same boundary.
(In this app the difference is trivial; in a larger form with rich
validation logic, it matters.)

## `app/dashboard/FilterToggle.jsx` — `'use client'`

**Needed because:** uses `useState` for the checkbox value. The activity
feed inside the toggle is still a Server Component — it's passed in as
`children`, which the server renderer hands the toggle. The toggle itself
never imports `<ActivityFeed />`; it just renders whatever children it
receives. This is the canonical "Client wraps Server" composition pattern
from Module 6.

**Real-world note:** in production you'd usually push the filter to the URL
(`?status=done`) via `useSearchParams` + a router push, then the parent
Server Component would re-render its children based on the new search
param. That keeps the source of truth on the server. For this lab the
toggle is a pure UI demo to make the pattern obvious.

## Components I deliberately did NOT mark `'use client'`

- **`StatCard`** — no state, no event handlers, no client-only APIs. Pure
  rendering. Ships zero JS.
- **`ActivityFeed`** and **`TeamList`** — async Server Components that read
  the data layer directly. No reason to ship them to the client.
- **`Dashboard`** (the page itself) — orchestrates everything but does
  nothing interactive. Awaits its own slow data and composes the children.
- **`addTaskAction`** — this uses the `'use server'` directive (in
  `app/actions/tasks.js`), not `'use client'`. It runs on the server when
  the form posts to it. The Client form imports it like any other function
  but, behind the scenes, the import gets replaced with a network call.

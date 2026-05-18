# Lab 5 solution — Server Components dashboard

Self-contained, runnable reference solution for Lab 5. Adds the four
required pieces to the dashboard:

1. Three Server-Component stat cards (open / in-progress / done).
2. Server-Component activity feed and team list.
3. A `<form>` posting to a Server Action with `useActionState` validation
   and `useFormStatus` pending state.
4. A Client-Component `FilterToggle` that owns local state and still
   accepts Server Components as `children`.

Plus a `BOUNDARY-NOTES.md` explaining each `'use client'` decision.

## How to run

Next.js is full-stack, so just one terminal — no separate backend.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/dashboard>. The dashboard's data sources are
all in-process (see [`lib/data.js`](./lib/data.js)) — no MongoDB or
external API needed.

## File map

| File | Change |
|---|---|
| `app/dashboard/page.jsx` | Replaces the stub with the full layout. |
| `app/dashboard/StatCard.jsx` | NEW — Server Component (rename of StubCard). |
| `app/dashboard/ActivityFeed.jsx` | NEW — Server Component, reads activity. |
| `app/dashboard/TeamList.jsx` | NEW — Server Component, reads team. |
| `app/dashboard/AddTaskForm.jsx` | NEW — Client Component, `useActionState`. |
| `app/dashboard/SubmitButton.jsx` | NEW — Client Component, `useFormStatus`. |
| `app/dashboard/FilterToggle.jsx` | Filled in — owns checkbox state, renders `children`. |
| `app/actions/tasks.js` | NEW — `'use server'` action with validation. |
| `BOUNDARY-NOTES.md` | NEW — explains every `'use client'` and why. |
| `app/dashboard/StubCard.jsx` | DELETED. |

## Things to point out to students

- `Dashboard`, `StatCard`, `ActivityFeed`, `TeamList` are all Server
  Components — no `'use client'`, no client JS shipped for them.
- `AddTaskForm` and `SubmitButton` are split: the form is a Client
  Component because it uses `useActionState`; the button is its own
  Client Component because `useFormStatus` only works inside a Client
  descendant of a `<form>`.
- `FilterToggle` is the only "interactive" Client Component, and it
  accepts the `<ActivityFeed />` Server Component as `children` — this
  is the canonical "Client wraps Server" composition pattern.
- The Server Action validates server-side. The same validation messages
  flow through `useActionState`'s state shape so the client renders them
  without a client-side validator.
- Disable JS in DevTools and the form still works (Server Actions
  progressive-enhance native form posts).

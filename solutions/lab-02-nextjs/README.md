# Lab 2 solution — Next.js client

Self-contained, runnable reference solution for Lab 2 Part B (Next.js
App Router). Contains the `social-media-nextjs/` client plus its own
copy of the Express auth backend.

## How to run

Two terminals.

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — Next.js dev server (port 3000)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:3000>. Sign up, log in, browse posts, log out.
MongoDB on `:27017` required.

## What this solution demonstrates

- `middleware.js` at the project root for protected-route auth checks.
- `(auth)/login/` and `(auth)/signup/` route group with Server Actions
  driven by `useActionState` + `useFormStatus`.
- `home/` page as a Server Component reading posts directly from the
  backend via `app/lib/api.server.js` (forwards the inbound `Cookie`
  header server-side).
- `logout/` Route Handler.
- `app/lib/session.js` helper for reading the session cookie in Server
  Components.

The backend is shared with the RR v7 solution — both speak to the same
Express + Mongoose service.

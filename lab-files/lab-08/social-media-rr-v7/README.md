# social-media-rr-v7 — React Router v7 framework-mode client

For Lab 8, the shared feature menu lives in `../lab08-backlog.md`.
Pick one option from that backlog, write `lab08-spec.md`, implement the
feature, add tests, then write `lab08-self-review.md`.

This is the workhorse React Router v7 client used by **Labs 2 through 7** of the Advanced React course (v2.0). It connects to the shared `social-media/server` backend.

## What's intentionally here

- **`app/root.jsx`** — the app shell with the `<Outlet />` for route content
- **`app/routes.js`** — minimal route config (just the index route)
- **`app/routes/_index.jsx`** — placeholder home page that points students at the labs
- **`app/lib/api.js`** — fetch wrapper for the social-media backend with the endpoint helpers Labs 2-4 build on
- **`app/app.css`** — minimal styling

## What's intentionally missing

This is the **pre-Lab-2 starter**. Subsequent labs add:

- **Lab 2** — `/login`, `/signup`, `/logout`, `/home` routes; loaders + actions; session helpers
- **Lab 3** — refactored client state with Zustand / Jotai / RTK
- **Lab 4** — TanStack Query for server state
- **Lab 6** — perf optimizations (these depend on bottlenecks deliberately seeded into `solution/lab-04-tanstack-query`, not into this starter)
- **Lab 7** — Vitest + RTL + MSW test setup

If you're starting Lab 3 or later directly, **branch from the previous lab's solution branch** (e.g., `solution/lab-02-rr-v7` for Lab 3) — that's where the per-lab seeded state lives.

## Running it

The backend needs to be running first:

```bash
# In one terminal
cd ../social-media/server
npm install
npm start
```

Then this client:

```bash
# In another terminal
cd social-media-rr-v7
npm install
npm run dev
```

Visit `http://localhost:5173`. You'll see the placeholder home page with links to the labs.

## Conventions

- **React 19 + React Router v7 framework mode**
- **JavaScript, not TypeScript** — per the course's locked decision
- **Path alias** `~/*` resolves to `./app/*` (RR v7 default)
- **Vite proxy** routes `/api/*` → `http://localhost:4000/*` so client fetches are same-origin

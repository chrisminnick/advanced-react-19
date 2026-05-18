# Lab 2 solution — React Router v7 client

Self-contained, runnable reference solution for Lab 2 Part A (RR v7).
Contains the modernized `social-media-rr-v7/` client plus its own copy
of the Express auth backend.

## How to run

Two terminals (one for the backend, one for the client).

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>. Sign up, log in, browse posts, log out.
The backend needs MongoDB running on `:27017` (the lab VM has it as a
Windows service).

## What this solution demonstrates

- Data-router `loader`s and `action`s for `/login`, `/signup`,
  `/logout`, and a protected `/home`.
- `app/lib/api.server.js` that **forwards the backend's `Set-Cookie`
  header** directly to the browser instead of wrapping it in a second
  cookie via `createCookieSessionStorage`. One cookie, one source of
  truth.
- Loaders forward the request's `Cookie` header back to the backend when
  fetching protected data.

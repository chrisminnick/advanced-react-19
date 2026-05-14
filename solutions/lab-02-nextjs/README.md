# Lab 2 solution — staged Next.js client

This folder is the **modernized `social-media-nextjs/`** that powers the
`solution/lab-02-nextjs` branch.

The solution is **additive** to the starter: it adds `middleware.js` at the
project root, a `(auth)/` route group with `login` and `signup`, a `home/`
page, a `logout/` route handler, a small `app/lib/session.js` helper, and a
`app/lib/api.server.js` so Server Components and Server Actions can talk
directly to the backend without going through Next's `/api/*` rewrites.

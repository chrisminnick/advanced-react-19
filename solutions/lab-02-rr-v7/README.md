# Lab 2 solution — staged RR v7 client

This folder is the **modernized `social-media-rr-v7/`** that powers the
`solution/lab-02-rr-v7` branch.

The solution is **additive** to the starter: it leaves the starter files in
place and adds (or replaces) the routes config, the four route files
(`login`, `signup`, `logout`, `home`), and a new `app/lib/api.server.js`
that handles cookie forwarding for loaders/actions.

The simplification compared to the "wrap in a session cookie" exemplar
the instructor will show you: instead of using `createCookieSessionStorage`
to wrap the backend's JWT in a second cookie, this solution **forwards
the backend's `Set-Cookie` header** directly to the browser. One cookie,
one source of truth. Loaders forward the request's `Cookie` header back
to the backend when fetching protected data.

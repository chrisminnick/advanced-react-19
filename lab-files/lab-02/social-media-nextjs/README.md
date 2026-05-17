# social-media-nextjs — Next.js 15 App Router parallel client

This is the **Lab 2 port target** — the Next.js 15 / App Router counterpart to `social-media-rr-v7`. Same backend (`social-media/server`), same feature set, different framework. Used by Lab 2's side-by-side comparison.

## What's intentionally here

- **`app/layout.jsx`** — root layout
- **`app/page.jsx`** — placeholder home page pointing students at the labs
- **`app/globals.css`** — minimal styling, matched to the RR v7 client
- **`app/lib/api.js`** — fetch wrapper for the social-media backend. Same endpoint helpers as the RR v7 client (`login`, `signup`, `logout`, `getMe`, `listPosts`, `getPost`, `createPost`)
- **`next.config.mjs`** — rewrites `/api/*` to `http://localhost:4000/api/*` so client and Server Components can both call `/api/...`

## What's intentionally missing

This is the **pre-Lab-2-port starter**. After Lab 2, this client has:

- `/login` and `/signup` (inside a `(auth)` route group)
- `/logout` (a route handler)
- `/home` (protected by middleware)
- `middleware.js` at the project root for the auth gate

Plus any Server Actions for login/signup/logout.

Lab 2 spells out exactly how to wire each of these — the starter is just the project shell.

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
cd social-media-nextjs
npm install
npm run dev
```

Visit `http://localhost:3000`. You'll see the placeholder home page.

If you have both the RR v7 client (on :5173) and this client (on :3000) running against the same backend simultaneously, that's the Lab 2 setup.

## Conventions

- **React 19 + Next.js 15** (App Router)
- **JavaScript, not TypeScript** — per the course's locked decision
- **The React Compiler is enabled** in `next.config.mjs`. Comment out if your team isn't using it yet
- **Path alias** `@/` resolves to the project root
- **Rewrites** route `/api/*` → `http://localhost:4000/api/*` so all fetches are same-origin in dev


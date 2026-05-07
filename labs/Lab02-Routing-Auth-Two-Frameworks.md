# Lab 2 — Routing + Auth in Two Frameworks

**Time:** 105 minutes

**Format:** Hands-on. Work alone or in pairs.

**Goal:** Implement the same authenticated routing — `/login`, `/signup`, `/logout`, and a protected `/home` — twice. First in React Router v7 framework mode, then port the same feature to Next.js 15 App Router. Reflect on what differs and what doesn't.

---

## What you'll have at the end

Two working clients that share one backend:

1. A **React Router v7** client at `social-media-rr-v7/` with login, signup, logout, and a protected home page that lists posts.
2. A **Next.js 15** client at `social-media-nextjs/` with the same feature set, using middleware-based auth.
3. A short written reflection comparing the two — saved as `lab02-reflection.md`.
4. Two solution branches pushed: `lab02/<your-name>-rr-v7` and `lab02/<your-name>-nextjs`.

Plus, if you have time: a protected nested route with a streaming layout (in either framework or both).

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup — three things running at once | 10 |
| Part A — Implement in React Router v7 | 50 |
| Part B — Port to Next.js App Router | 35 |
| Part C — Reflection + submit | 10 |
| Stretch (if time): nested streaming route | + |

If you finish early, do the stretch task or help a neighbor.

---

## Setup

You'll be running three things simultaneously: the shared Express backend, an RR v7 client, and a Next.js client. Each goes in its own terminal.

### Terminal 1 — backend

```bash
cd social-media/server
npm install
npm start
```

The server listens on `http://localhost:5000`. It exposes `/api/login`, `/api/signup`, `/api/me`, `/api/posts`, and a few others. CORS is configured to accept both Vite (5173) and Next.js (3000) origins.

### Terminal 2 — RR v7 client

```bash
cd social-media-rr-v7
npm install
npm run dev
```

You should see Vite log a URL around `http://localhost:5173`. The starter has a placeholder `/` route; you'll add the real routes during Part A.

### Terminal 3 — Next.js client

```bash
cd social-media-nextjs
npm install
npm run dev
```

You should see Next.js log `http://localhost:3000`. The starter has the App Router scaffolding and an empty home page; you'll fill it out during Part B.

### Verify the backend works

In a fourth terminal (or your favorite HTTP client):

```bash
curl http://localhost:5000/api/setup-check
# should return {"ok": true, "message": "backend ready"}
```

If that works, you're set. **Create your branches before changing anything:**

```bash
cd social-media-rr-v7
git checkout -b lab02/<your-name>-rr-v7

cd ../social-media-nextjs
git checkout -b lab02/<your-name>-nextjs
```

---

## Part A — React Router v7 (50 min)

You're implementing four routes:

| Route | Behavior |
|---|---|
| `/login` | Email + password form. POSTs to `/api/login`. On success, sets the session cookie and redirects to `/home`. |
| `/signup` | Name + email + password form. POSTs to `/api/signup`. On success, redirects to `/login`. |
| `/logout` | Clears the session cookie and redirects to `/login`. |
| `/home` | Protected. Loads posts from `/api/posts` and renders them. Redirects to `/login?next=/home` if not authenticated. |

### Step 1 — Wire up route configuration

Open `app/routes.ts`. Add the four routes. Use the `route()` and `index()` helpers from `@react-router/dev/routes`. The `/home` route should be wrapped in a layout route that handles the auth redirect.

### Step 2 — Implement `/login` and `/signup`

Each route file exports an `action` (handles the form POST) and a default component (renders the form). Use `<Form method="post">` from `react-router`. On success in the action, return a `redirect()` to the next route.

Hint: store the session token in an HTTP-only cookie via the response headers from the action. The starter has a `setSession` helper in `app/lib/session.server.ts` — use it.

### Step 3 — Implement `/logout`

A POST-only route. The action clears the session cookie and redirects to `/login`. The component can be a simple "Sign out" button inside a form.

### Step 4 — Implement `/home` with auth redirect

The route's `loader` should:

- Read the session cookie from the request.
- If no session, `throw redirect('/login?next=/home')`.
- Otherwise, fetch posts from the backend and return them.

The component reads the loader data with `useLoaderData()` and renders the post list.

### Step 5 — Test the full flow

- Hit `/home` in a fresh browser. You should be redirected to `/login?next=/home`.
- Sign up with a fake email. You should land on `/login`.
- Log in. You should land on `/home` and see posts.
- Sign out. You should land on `/login`.

When all four routes work end-to-end, commit:

```bash
git add -A
git commit -m "Lab 2 RR v7: login, signup, logout, protected home"
```

---

## Part B — Next.js App Router (35 min)

Port the same feature set to Next.js. The biggest structural difference: auth happens in **middleware**, not in route loaders.

### Step 1 — Wire up the App Router

Create these files (some may already exist as placeholders):

```
app/
├── (auth)/
│   ├── login/page.jsx
│   └── signup/page.jsx
├── home/page.jsx
├── logout/route.js
└── middleware.js
```

The `(auth)` route group keeps `/login` and `/signup` URLs at the top level while letting you share an auth layout if you want.

### Step 2 — Implement the middleware

`middleware.js` runs before every matching request. Check for the session cookie. If missing, redirect to `/login`. Use a `matcher` config to limit it to protected routes.

```js
export const config = { matcher: ['/home/:path*'] };
```

### Step 3 — Implement `/login` and `/signup`

Each `page.jsx` is a Server Component that renders a form. The form's action is a Server Action (a function with `'use server'`) that calls the backend, sets the session cookie, and redirects.

For setting cookies from a Server Action, use:

```js
import { cookies } from 'next/headers';
cookies().set('session', token, { httpOnly: true, secure: true, path: '/' });
```

### Step 4 — Implement `/logout`

A `route.js` exporting a POST handler. Clear the cookie, redirect to `/login`. (You can also do it as a Server Action inside a form — both work.)

### Step 5 — Implement `/home`

A Server Component that fetches posts from the backend (you can `await fetch()` directly — Server Components support that natively) and renders them. The middleware handles the auth redirect, so this component doesn't need to check.

### Step 6 — Test the full flow

Same as Part A — sign up, log in, see posts, log out. Commit:

```bash
git add -A
git commit -m "Lab 2 Next.js: login, signup, logout, protected home"
```

---

## Part C — Reflection + submit (10 min)

Create `lab02-reflection.md` somewhere convenient (the parent course folder is fine, or inside one of the client folders). Answer in one paragraph each:

1. **Which framework felt more natural for this task?** Why? Be specific — name a file, a concept, a trade-off.
2. **Where did the two diverge structurally?** What did each force you to do that the other didn't?
3. **If your team had to pick one tomorrow, which would you advocate for, and why?**

Push both branches:

```bash
git push origin lab02/<your-name>-rr-v7
git push origin lab02/<your-name>-nextjs
```

Drop links to both branches and your reflection in the shared class doc.

---

## Stretch — protected nested route with streaming layout

Pick one of the two clients and add a `/home/profile` route that:

1. Lives under the same auth-protected umbrella as `/home`.
2. Uses a layout that streams: the page shell renders immediately, the data-heavy parts of the profile arrive in their own Suspense boundaries.
3. Shows a nice loading skeleton (not a spinner — a skeleton).

In RR v7, that's nested route configuration + `<Suspense>` + `defer()` in the loader.

In Next.js, that's a `loading.jsx` for the segment + `<Suspense>` boundaries inside the page.

---

## Hints if you get stuck

### Both frameworks

- **CORS rejected by the backend**: confirm both `5173` and `3000` are in the server's allowed origins list. The shared backend is set up for both.
- **Session cookie not set**: check that the response sets the cookie with `Path=/`, `HttpOnly`, and (in dev) without `Secure`. Browser dev tools → Application → Cookies will show you what was sent.
- **`/api/me` returns 401 even after login**: the cookie isn't being sent on subsequent requests. Make sure your fetch calls include `credentials: 'include'` (RR v7) or that you're using the cookie-aware `fetch` (Next.js).

### React Router v7

- **`useLoaderData` returns null**: the loader didn't run or the route isn't wired into `routes.ts` properly. Check the routes file and the file naming.
- **`<Form>` posts but `action` doesn't run**: import `Form` from `react-router`, not from anywhere else. Plain `<form>` would just do a regular browser POST.
- **Cookie set in action isn't readable in loader on the same redirect**: redirects in RR v7 follow the `Set-Cookie` header. Check that you're returning the redirect from the action, not the component, and that the headers are merged.

### Next.js

- **Middleware redirects in a loop**: your matcher is too broad. `'/home/:path*'` matches `/home` and below. Don't put `/login` or `/signup` under it, or they'll redirect themselves to themselves.
- **Server Action gets a "cannot find module" error**: `'use server'` files must export only async functions and only Server-Component-compatible imports. Don't import a client-only library at the top.
- **`cookies().set()` errors with "must be in a Server Action or Route Handler"**: you tried to set a cookie from a Server Component. Move the set into the action.

---

## Solution branches

After the lab, the reference solutions are at:

- `solution/lab-02-rr-v7`
- `solution/lab-02-nextjs`
- `solution/lab-02-stretch` (if you want to see a streaming nested-route example)

Don't peek before you've finished your own implementation — the value of the lab is in the comparison, and you can't compare what you haven't built.

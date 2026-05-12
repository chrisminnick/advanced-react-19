# How to publish this to the `solution/lab-02-nextjs` branch

These files are the diff against the `social-media-nextjs/` starter that
becomes the `solution/lab-02-nextjs` branch.

## Prerequisites

- You're on `main`, working tree clean.
- The starter under `social-media-nextjs/` is the v2.0 scaffold.
- The `social-media/server` backend works.

## Script

```bash
git checkout -b solution/lab-02-nextjs

# Copy / overwrite — none of the starter files are deleted, only added to.
mkdir -p social-media-nextjs/app/lib \
         social-media-nextjs/app/\(auth\)/login \
         social-media-nextjs/app/\(auth\)/signup \
         social-media-nextjs/app/home \
         social-media-nextjs/app/logout

cp solutions/lab-02-nextjs/middleware.js                              social-media-nextjs/middleware.js
cp solutions/lab-02-nextjs/app/page.jsx                               social-media-nextjs/app/page.jsx
cp solutions/lab-02-nextjs/app/globals.css                            social-media-nextjs/app/globals.css
cp solutions/lab-02-nextjs/app/lib/api.server.js                      social-media-nextjs/app/lib/api.server.js
cp solutions/lab-02-nextjs/app/lib/session.js                         social-media-nextjs/app/lib/session.js
cp "solutions/lab-02-nextjs/app/(auth)/layout.jsx"                    "social-media-nextjs/app/(auth)/layout.jsx"
cp "solutions/lab-02-nextjs/app/(auth)/login/page.jsx"                "social-media-nextjs/app/(auth)/login/page.jsx"
cp "solutions/lab-02-nextjs/app/(auth)/login/LoginForm.jsx"           "social-media-nextjs/app/(auth)/login/LoginForm.jsx"
cp "solutions/lab-02-nextjs/app/(auth)/signup/page.jsx"               "social-media-nextjs/app/(auth)/signup/page.jsx"
cp "solutions/lab-02-nextjs/app/(auth)/signup/SignupForm.jsx"         "social-media-nextjs/app/(auth)/signup/SignupForm.jsx"
cp solutions/lab-02-nextjs/app/home/page.jsx                          social-media-nextjs/app/home/page.jsx
cp solutions/lab-02-nextjs/app/logout/route.js                        social-media-nextjs/app/logout/route.js

# Smoke-test
( cd social-media/server && npm install && npm run dev ) &
( cd social-media-nextjs && npm install && npm run dev ) &
# Visit http://localhost:3000 — sign up, log in, see /home, sign out.

git add -A
git commit -m "Lab 2 Next.js solution: login/signup/logout/home with middleware auth

- middleware.js: auth gate for /home/* — presence check on session cookie
- app/lib/session.js: cookie helpers (set / clear / get) using next/headers
- app/lib/api.server.js: server-only backend client; forwards session cookie
- app/(auth)/{login,signup}/page.jsx: Server Components with co-located
  Server Actions; forms are Client Components using useActionState +
  useFormStatus for error and pending UI
- app/home/page.jsx: Server Component; calls /api/me + /api/posts on the
  server, redirects to /login on 401
- app/logout/route.js: POST handler that clears the cookie and redirects"

# git push -u origin solution/lab-02-nextjs
git checkout main
```

## Notes about Next.js 15 changes

- `cookies()`, `headers()`, `params`, and `searchParams` became asynchronous
  in Next.js 15 (you may see `await cookies()` in newer code). The code in
  this solution uses the still-supported synchronous form. If you bump
  Next.js past 15.x, replace `cookies().get(...)` with
  `(await cookies()).get(...)` everywhere in `app/lib/`.
- The `(auth)` parentheses are a "route group" — they let `/login` and
  `/signup` share a layout without affecting URLs.

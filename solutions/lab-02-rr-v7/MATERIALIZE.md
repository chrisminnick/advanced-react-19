# How to publish this to the `solution/lab-02-rr-v7` branch

These files are the diff against the `social-media-rr-v7/` starter that
becomes the `solution/lab-02-rr-v7` branch.

## Prerequisites

- You're on `main`, working tree clean.
- The starter under `social-media-rr-v7/` is the v2.0 scaffold.
- The `social-media/server` backend works (Lab 1 / Task 39 done).

## Script

```bash
git checkout -b solution/lab-02-rr-v7

# Copy the staged files over (this overwrites the matching files in the starter
# and adds new ones — none of the starter's files are removed).
cp solutions/lab-02-rr-v7/app/routes.js              social-media-rr-v7/app/routes.js
cp solutions/lab-02-rr-v7/app/app.css                social-media-rr-v7/app/app.css
cp solutions/lab-02-rr-v7/app/lib/api.server.js      social-media-rr-v7/app/lib/api.server.js
cp solutions/lab-02-rr-v7/app/routes/_index.jsx      social-media-rr-v7/app/routes/_index.jsx
cp solutions/lab-02-rr-v7/app/routes/login.jsx       social-media-rr-v7/app/routes/login.jsx
cp solutions/lab-02-rr-v7/app/routes/signup.jsx      social-media-rr-v7/app/routes/signup.jsx
cp solutions/lab-02-rr-v7/app/routes/logout.jsx      social-media-rr-v7/app/routes/logout.jsx
cp solutions/lab-02-rr-v7/app/routes/home.jsx        social-media-rr-v7/app/routes/home.jsx

# Smoke-test
( cd social-media/server && npm install && npm run dev ) &
( cd social-media-rr-v7 && npm install && npm run dev ) &
# Visit http://localhost:5173 — sign up, log in, see the home feed, sign out.

git add -A
git commit -m "Lab 2 RR v7 solution: login/signup/logout/home with cookie-forward auth

- routes.js: register the four new routes
- app/lib/api.server.js: server-only backend client; forwards inbound Cookie
  header and surfaces backend Set-Cookie on the way out
- routes/login.jsx: action POSTs /api/login, forwards backend Set-Cookie to
  the browser, redirects to ?next or /home
- routes/signup.jsx: action POSTs /api/signup, redirects to /login
- routes/logout.jsx: action calls /api/logout and clears the cookie
- routes/home.jsx: loader gates on /api/me (401 -> redirect to /login?next=)
  and fetches /api/posts; component renders the feed
- _index.jsx: link out to the new routes
- app.css: auth + home styles"

# git push -u origin solution/lab-02-rr-v7
git checkout main
```

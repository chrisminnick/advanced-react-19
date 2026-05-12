# my-next-app (v2.0)

In-class demo for **Module 3 — Routing with RR v7 + Next.js**. Pairs with
the `routing-demo/` (RR v7) so the instructor can switch between the two
mid-lecture and compare.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Tour for the instructor (~5 minutes)

1. **`/`** — `app/page.js`. Pure Server Component. View source: the
   text is in the HTML response; no client JS for this page.
2. **`/about`** — Server Component (`page.js`) composing a Client
   Component (`Counter.js`). Only the counter ships JS; the surrounding
   prose stays static. The boundary is a single line: `'use client'` at
   the top of `Counter.js`.
3. **`/contact-us`** — Server Action via `useActionState` +
   `useFormStatus`. The action lives in `actions.js` (`'use server'` at
   the top); the form is a Client Component (`SubscribeForm.js`).
   Try the failure modes:
   - Empty email
   - Invalid email
   - `boom@example.com` (simulated server error)

## Files worth opening on screen

- `app/layout.js` — root layout, persists across navigations.
- `app/about/Counter.js` — minimum viable `'use client'`.
- `app/contact-us/actions.js` — minimum viable `'use server'`.
- `app/contact-us/SubscribeForm.js` — `useActionState` + `useFormStatus`
  pairing.

## What changed from v1

- Next.js 14 → **15**, React 18 → **19**.
- Boilerplate "create-next-app" landing page replaced with content that
  actually demonstrates the App Router patterns we teach.
- `/contact-us` upgraded from a stub `<h1>` to a full Server Action
  example with progressive enhancement (works without JS).
- `next.config.js` (CommonJS) replaced with `next.config.mjs` (ESM).
  The old `.js` file is unused and can be deleted.

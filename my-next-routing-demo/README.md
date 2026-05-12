# my-next-routing-demo (v2.0)

Companion to `my-next-app/`. Where that demo covers the basics, this one
shows the App Router's **routing primitives**: nested layouts, dynamic
segments, `loading.js` for streaming, `error.js` for error boundaries,
and `not-found.js`.

## Run

```bash
npm install
npm run dev
# open http://localhost:3001
```

(Different port from `my-next-app/` so you can run both side by side
during the lecture.)

## Tour for the instructor (~7 minutes)

1. **`/`** — the index. Just links to the other routes.

2. **`/blog`** — first time we see the **nested layout**. The blog
   sidebar (in `app/blog/layout.js`) appears. Click between blog posts —
   the sidebar doesn't unmount; only the post body re-renders.

3. **`/blog/hello-world`** — **dynamic segment** in
   `app/blog/[slug]/page.js`. Show `params.slug` arriving as `'hello-world'`.

4. **`/blog/streaming`** — same dynamic segment, but `data.js` adds a
   1.5s delay for this slug. The page shell + sidebar paint instantly,
   then `loading.js` (the shimmer skeleton) renders, then the real
   content streams in. Open the Network tab and watch it happen.

5. **`/blog/anything-else`** — calls `notFound()`. The
   `app/blog/not-found.js` boundary catches it. (Try `/blog/abc`.)

6. **`/blog/oops`** — page deliberately throws. The
   `app/blog/error.js` boundary catches it. Click "Try again" — `reset()`
   re-runs the page, which throws again, fallback re-renders. Useful
   for showing the lifecycle.

## Files worth opening on screen

- `app/layout.js` + `app/blog/layout.js` — outer + inner layout
  composition.
- `app/blog/[slug]/page.js` — dynamic segment + `notFound()` escalation.
- `app/blog/[slug]/loading.js` — sibling-of-page loading UI.
- `app/blog/error.js` — must be `'use client'` (owns the retry button).
- `app/blog/not-found.js` — sibling boundary for `notFound()`.

## What changed from v1

This was a create-next-app boilerplate — the index was the Vercel
landing page with no real demo content. v2 replaces all of it with
content that actually demonstrates the routing primitives.

- Next.js 14 → **15**, React 18 → **19**.
- Removed `next/font`'s Inter import; not relevant to the demo.
- Removed unused `page.module.css` boilerplate; styles live in
  `globals.css`.
- `next.config.js` (CommonJS) replaced with `next.config.mjs` (ESM).
  The old `.js` file is unused and can be deleted.
- Note for Next.js 15: `params` in route components is **async** — code
  uses `await params` accordingly. Older tutorials that show
  `params.slug` directly are pre-15.

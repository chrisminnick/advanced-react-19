# routing-demo (v2.0)

In-class demo for **Module 3 — Routing with RR v7 + Next.js**.

Five routes that show, in order, the building blocks of React Router v7's
data-router API: layout + nav + pending UI, plain elements, loaders,
nested loaders, actions, and error boundaries.

## Run

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Tour for the instructor (~5 minutes)

1. **`/`** — `HomePage`. Pure presentation, no data. Click around the
   nav links; the URL changes without a full page reload.
2. **`/about`** — same kind of page; reinforce that the nav doesn't
   re-mount the layout.
3. **`/products`** — has a **loader**. Watch the top-of-header progress
   bar appear during the 300ms artificial delay. By the time
   `<ProductsPage>` renders, `useLoaderData()` already has the data —
   no loading-state code in the component.
4. **`/products/p-101`** — nested loader on a dynamic segment. Then
   submit the **Buy** form — that fires the route's **action**, the
   nav state goes to `submitting`, and `useActionData()` shows the
   receipt (or the error message if you over-buy).
5. **`/products/nope`** — loader throws a 404; the `errorElement` at
   the root catches it. Same pattern catches anything an action throws.

The footer always shows `navigation.state` — `idle`, `loading`,
`submitting` — so students can see the lifecycle live.

## Files worth opening on screen

- `src/router.jsx` — the route tree. One config object describes everything.
- `src/routes/RootLayout.jsx` — `<Outlet />` + `useNavigation()` for
  the progress bar.
- `src/routes/ProductDetail.jsx` — loader, action, `<Form>`, and
  `useActionData()` all in one ~60-line file.
- `src/routes/RootError.jsx` — `useRouteError()` + `isRouteErrorResponse()`.

## What changed from v1

Pre-2026 this was a six-line `<BrowserRouter>` + `<Routes>` demo on
React 18 + react-router-dom 6. v2 swaps to React 19 + the unified
`react-router` package (v7), and replaces the JSX route definitions with
the data-router (`createBrowserRouter` + `RouterProvider`) so we can
demo loaders, actions, and error boundaries — the things that actually
make v7 worth learning.

# Lab 7 solution — Test suite from scratch

Self-contained, runnable reference solution for Lab 7. Adds Vitest +
React Testing Library + MSW v2, a baseline suite the instructor wrote
by hand, an AI-extended suite (paste from a real AI session), and a
`lab07-review.md` that marks every AI-generated test as **keep**,
**refactor**, or **delete**.

## How to run

The unit tests don't need a backend — MSW intercepts at the network
boundary.

```bash
npm install
npm test          # interactive watch mode
npm run test:run  # single CI-style run
```

To also boot the app locally, two more terminals:

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm run dev
```

Open <http://localhost:5173>. MongoDB on `:27017` required for the
running app (not for tests).

## What changes vs. lab-04-tanstack-query

| File | Change |
|---|---|
| `vitest.config.js` | NEW — separate from `vite.config.js`. |
| `app/test/setup.js` | NEW — MSW server lifecycle + jest-dom matchers. |
| `app/test/handlers.js` | NEW — MSW request handlers covering /api/login, /api/me, /api/posts. |
| `app/test/renderWithProviders.jsx` | NEW — wraps subject in QueryClientProvider + MemoryRouter. |
| `app/components/NewPostForm.test.jsx` | NEW — baseline + reviewed AI extensions. |
| `app/routes/login.test.jsx` | NEW — baseline + reviewed AI extensions. |
| `app/components/PostsFeed.test.jsx` | NEW — pure-render tests, no providers needed. |
| `lab07-review.md` | NEW — review of every AI-generated test in the suite. |
| `package.json` | Adds Vitest deps + `test` script. |

## Things to point out to students

- **Two test files with providers, one without.** `PostsFeed` is pure
  presentation; testing it requires no QueryClient, no router, no MSW.
  Drawing that line is half the testing skill.
- **Every test queries by role first**, then label, then text. There's
  one `getByText` in the suite (for an error message that's a `<p>`),
  and zero `getByTestId`.
- **`userEvent`, never `fireEvent`.** Always awaited.
- **MSW v2 (not v1).** `http` instead of `rest`, `HttpResponse` instead
  of `res(ctx.json(...))`. The setup file pins `onUnhandledRequest:
  'error'` so missing handlers fail loudly.
- **The review doc is the deliverable.** Each verdict cites a Module 8
  red flag by number — that's how the instructor grades it.

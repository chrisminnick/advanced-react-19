# Lab 7 solution — Test suite from scratch

Branches from `solution/lab-04-tanstack-query`. Adds Vitest + React Testing
Library + MSW v2, a baseline suite the instructor wrote by hand, an
AI-extended suite (paste from a real AI session), and a `lab07-review.md`
that marks every AI-generated test as **keep**, **refactor**, or **delete**.

## What changes vs. lab-04-tanstack-query

| File | Change |
|---|---|
| `vitest.config.js` | NEW — separate from `vite.config.js`. |
| `app/test/setup.js` | NEW — MSW server lifecycle + jest-dom matchers. |
| `app/test/handlers.js` | NEW — MSW request handlers covering /api/login, /api/me, /api/posts. |
| `app/test/renderWithProviders.jsx` | NEW — wraps subject in QueryClientProvider + MemoryRouter. |
| `app/components/NewPostForm.test.jsx` | NEW — baseline + reviewed AI extensions. |
| `app/components/Login.test.jsx` | NEW — baseline + reviewed AI extensions. |
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

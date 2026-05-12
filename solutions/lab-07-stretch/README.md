# Lab 7 stretch — one Playwright e2e

Branches from `solution/lab-07-tests`. Adds a single Playwright spec
covering the auth happy path: the user signs in, lands on `/home`, and
sees the feed.

## What changes vs. lab-07-tests

| File | Change |
|---|---|
| `playwright.config.js` | NEW — points at the dev server, headless Chromium. |
| `e2e/login.spec.js` | NEW — one happy-path test plus one wrong-credentials test. |
| `package.json` | Adds `@playwright/test`; adds `test:e2e` script. |
| `.gitignore` | Adds `playwright-report/`, `test-results/`. |

## Note

The Playwright tests hit the **real backend** through the **real Vite dev
server**. They're not mocked. That's the point of e2e: it's the only test
type that can catch a backend/frontend protocol mismatch.

That also means the backend has to be running and the test user has to
exist. The `e2e/setup.spec.js` global-setup file creates the test user
once before the run, and the spec relies on that. If you run e2e against
a dirty database, the second `signup` call returns 409 — that's expected
and the setup script handles it.

## Things to point out to students

- **Playwright queries by role/label too.** Same accessibility-first
  philosophy as RTL. A test written well in RTL translates almost
  directly to Playwright's locator API.
- **The webServer config** spins up `npm run dev` automatically and
  reuses an existing server if one's already running. That's why you
  don't need a separate "start the server" step before `npx playwright
  test`.
- **One e2e is plenty.** Don't try to e2e every feature — they're slow,
  flaky, and hard to maintain. One end-to-end smoke for the critical
  user path (auth) is the canonical Module 8 advice.

# Lab 7 stretch — one Playwright e2e

Self-contained, runnable reference solution for the Lab 7 stretch task.
Adds a single Playwright spec covering the auth happy path: the user
signs in, lands on `/home`, and sees the feed.

## How to run

The e2e tests hit the **real backend** through the **real Vite dev
server** — no mocking. So you need both running before the test starts.

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — install + browsers (one-time per machine)
# from this solution folder
npm install
npx playwright install chromium

# Terminal 3 — run the e2e suite
# (the playwright config will boot `npm run dev` for you and reuse it
# if already running)
npm run test:e2e
```

You can also still run the unit-test suite inherited from lab-07-tests:

```bash
npm test          # interactive
npm run test:run  # single run
```

MongoDB on `:27017` required (the e2e tests hit the real backend, which
hits the real Mongo).

## What changes vs. lab-07-tests

| File | Change |
|---|---|
| `playwright.config.js` | NEW — points at the dev server, headless Chromium. |
| `e2e/login.spec.js` | NEW — one happy-path test plus one wrong-credentials test. |
| `package.json` | Adds `@playwright/test`; adds `test:e2e` script. |
| `.gitignore` | Adds `playwright-report/`, `test-results/`. |

## Note on the test user

The Playwright tests rely on a test user existing. The spec creates it
once via `/api/signup` and ignores the 409 if it already exists. If you
run e2e against a dirty database, that's expected.

## Things to point out to students

- **Playwright queries by role/label too.** Same accessibility-first
  philosophy as RTL. A test written well in RTL translates almost
  directly to Playwright's locator API.
- **The webServer config** spins up `npm run dev` automatically and
  reuses an existing server if one's already running. That's why you
  don't need a separate "start the dev server" step before `npm run
  test:e2e`.
- **One e2e is plenty.** Don't try to e2e every feature — they're slow,
  flaky, and hard to maintain. One end-to-end smoke for the critical
  user path (auth) is the canonical Module 8 advice.

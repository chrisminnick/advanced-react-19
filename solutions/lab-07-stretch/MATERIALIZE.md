# Publish to `solution/lab-07-stretch`

```bash
git checkout solution/lab-07-tests
git checkout -b solution/lab-07-stretch

( cd social-media-rr-v7 && \
    npm install -D @playwright/test && \
    npx playwright install chromium )

cp solutions/lab-07-stretch/playwright.config.js  social-media-rr-v7/playwright.config.js
mkdir -p social-media-rr-v7/e2e
cp solutions/lab-07-stretch/e2e/login.spec.js     social-media-rr-v7/e2e/login.spec.js

# Add to .gitignore (or run an editor):
( cd social-media-rr-v7 && \
    grep -qxF 'playwright-report/' .gitignore || echo 'playwright-report/' >> .gitignore && \
    grep -qxF 'test-results/'      .gitignore || echo 'test-results/'      >> .gitignore )

# Add to package.json scripts (manual edit):
#   "test:e2e": "playwright test"
#   "test:e2e:ui": "playwright test --ui"

# Smoke-test (backend AND vite dev server have to be reachable;
# playwright.config.js's webServer block boots Vite for you, but
# you still need social-media/server running on :5000):
( cd social-media/server && npm run dev ) &
( cd social-media-rr-v7 && npx playwright test )

git add -A
git commit -m "Lab 7 stretch: one Playwright e2e for the auth flow

- playwright.config.js: headless Chromium, baseURL :5173, auto-boots Vite dev server
- e2e/login.spec.js: happy-path sign-in + wrong-password assertion
- beforeAll seeds the test user (idempotent — 409 on re-run is fine)
- .gitignore drops playwright-report/ and test-results/"

# git push -u origin solution/lab-07-stretch
git checkout main
```

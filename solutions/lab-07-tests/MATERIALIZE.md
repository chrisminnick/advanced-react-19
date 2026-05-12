# Publish to `solution/lab-07-tests`

```bash
git checkout solution/lab-04-tanstack-query
git checkout -b solution/lab-07-tests

( cd social-media-rr-v7 && \
    npm install -D vitest @vitejs/plugin-react jsdom \
                   @testing-library/react @testing-library/user-event @testing-library/jest-dom \
                   msw )

# Vitest config
cp solutions/lab-07-tests/vitest.config.js                              social-media-rr-v7/vitest.config.js

# Test infrastructure
mkdir -p social-media-rr-v7/app/test
cp solutions/lab-07-tests/app/test/setup.js                             social-media-rr-v7/app/test/setup.js
cp solutions/lab-07-tests/app/test/handlers.js                          social-media-rr-v7/app/test/handlers.js
cp solutions/lab-07-tests/app/test/renderWithProviders.jsx              social-media-rr-v7/app/test/renderWithProviders.jsx

# Test suites
cp solutions/lab-07-tests/app/components/PostsFeed.test.jsx             social-media-rr-v7/app/components/PostsFeed.test.jsx
cp solutions/lab-07-tests/app/components/NewPostForm.test.jsx           social-media-rr-v7/app/components/NewPostForm.test.jsx
cp solutions/lab-07-tests/app/routes/login.test.jsx                     social-media-rr-v7/app/routes/login.test.jsx

# Review deliverable
cp solutions/lab-07-tests/lab07-review.md                               social-media-rr-v7/lab07-review.md

# Add the test script to package.json (manual edit — easiest in your editor):
#   "scripts": { ..., "test": "vitest", "test:run": "vitest run" }

# Smoke-test
( cd social-media-rr-v7 && npm test -- --run )
# All three test files should pass; nothing red.

git add -A
git commit -m "Lab 7 solution: Vitest + RTL + MSW v2 baseline suite + reviewed AI extension

- vitest.config.js separate from vite.config.js so it doesn't pull in reactRouter()
- app/test/setup.js: MSW server lifecycle + jest-dom matchers; onUnhandledRequest:'error'
- app/test/handlers.js: /api/login, /api/me, /api/posts handlers with magic-password failure modes
- app/test/renderWithProviders.jsx: fresh QueryClient per call, MemoryRouter, no-retry config
- PostsFeed.test.jsx: 3 pure-presentation tests, no providers needed
- NewPostForm.test.jsx: 4 baseline tests + 2 kept-from-AI tests
- login.test.jsx: 3 light tests on the rendered form (action runs server-side in prod)
- lab07-review.md: 8 AI tests reviewed; kept 2, refactored 1, deleted 5; cited red flags by number"

# git push -u origin solution/lab-07-tests
git checkout main
```

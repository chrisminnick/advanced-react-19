# Lab 7 — Test Suite from Scratch

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Set up Vitest + React Testing Library + MSW, write a baseline
test suite for one feature by hand, then have an AI extend it. Mark
every AI-generated test as keep, refactor, or delete — with a written
reason. The review skill is the load-bearing part.

---

## What you'll have at the end

1. A working Vitest + RTL + MSW test setup in the social-media client.
2. A baseline test suite (3–5 tests) for one feature, written by you,
   focused on behavior.
3. An AI-extended test suite (8–15 more tests).
4. A `lab07-review.md` file at the root of `lab-files/lab-07/` marking
   every AI-generated test as **keep**, **refactor**, or **delete**
   with a reason citing Module 8's red-flag list.

Plus, if you have time: one Playwright e2e test for the auth flow.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup — Vitest + RTL + MSW | 15 |
| Part A — Baseline test suite (you write) | 25 |
| Part B — AI extends the suite | 15 |
| Part C — Review every AI test | 20 |
| Stretch (if time): one Playwright e2e | + |

If you finish early, do the stretch task or extend the AI-review
write-up with a "what AI did well" section.

---

## Setup

You're working in `lab-files/lab-07/`. The starter is the post-Lab-4
state of `social-media-rr-v7/` (TanStack Query is in place) plus the
shared backend.

```bash
# Terminal 1 — backend
cd lab-files/lab-07/social-media/server
npm install
npm run dev

# Terminal 2 — client
cd lab-files/lab-07/social-media-rr-v7
npm install
npm run dev
```

Verify the app still runs at `http://localhost:5173` before you start.

### Make a backup

```bash
cp -R lab-files/lab-07 lab-files/lab-07-backup

# Windows PowerShell:
Copy-Item -Recurse lab-files/lab-07 lab-files/lab-07-backup
```

### Install testing deps

```bash
cd lab-files/lab-07/social-media-rr-v7
npm install -D vitest@2 @vitejs/plugin-react jsdom \
               @testing-library/react@16 @testing-library/user-event@14 @testing-library/jest-dom@6 \
               msw@2
```

### Wire up Vitest

Create `vitest.config.js` (separate from `vite.config.js` so we don't
clobber the RR v7 starter's plugin and dev-server config):

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.js'],
    globals: true,
  },
});
```

Vitest auto-detects `vitest.config.js` and uses it instead of
`vite.config.js`.

Create `app/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server };
```

Create `app/test/handlers.js`:

```js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/posts', () =>
    HttpResponse.json([
      { id: 1, title: 'First post', body: 'Hello', author: 'a@b.com', createdAt: '2026-05-10T10:00:00Z' },
      { id: 2, title: 'Second post', body: 'World', author: 'c@d.com', createdAt: '2026-05-10T11:00:00Z' },
    ])
  ),
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 99, ...body, author: 'test@example.com', createdAt: new Date().toISOString() }, { status: 201 });
  }),
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (password === 'wrong') {
      return HttpResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    return HttpResponse.json({ token: 'fake-token', user: { id: '1', email, name: 'Test User' } });
  }),
  http.get('/api/me', () =>
    HttpResponse.json({ id: '1', email: 'test@example.com', name: 'Test User' })
  ),
];
```

Add a script to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

Run `npm test`. You should see a "no test files found" message, which
is fine — you'll add tests in Part A.

---

## Part A — Baseline test suite, written by you (25 min)

Pick **one** feature to test. Suggested options:

- **PostsFeed** — pure presentation; renders a list of posts; shows an
  empty state; styles `sending` differently
- **NewPostForm** — validates input, submits via TanStack Query
  mutation, optimistic update, error path

Write **3–5 behavior-focused tests** for that feature. Save them as
`<Feature>.test.jsx` next to the component.

### Rules for your hand-written suite

- Query by **role first**, then label, then text. Never `getByTestId`
  unless you've exhausted the alternatives.
- Use `userEvent`, never `fireEvent`. Always `await` it.
- Each test asserts on what the user sees — visible text, focused
  element, navigation.
- Don't spy on hooks or internal state.
- Don't use `setTimeout` for waits. Use `findBy` or `waitFor`.

### Example test (LoginForm — your version may differ)

```jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/renderWithProviders';
import NewPostForm from './NewPostForm';

describe('NewPostForm', () => {
  it('disables the submit button when the body is empty', () => {
    renderWithProviders(<NewPostForm />);
    expect(screen.getByRole('button', { name: /post/i })).toBeDisabled();
  });

  it('clears the inputs after a successful submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewPostForm />);
    await user.type(screen.getByPlaceholderText(/what's on your mind/i), 'hi there');
    await user.click(screen.getByRole('button', { name: /post/i }));
    expect(await screen.findByPlaceholderText(/what's on your mind/i)).toHaveValue('');
  });
});
```

(You'll want a `renderWithProviders` helper that wraps your component
in `QueryClientProvider` + `MemoryRouter`. See
`solutions/lab-07-tests/app/test/renderWithProviders.jsx` for a
reference if you want to peek at the shape — but write your own first.)

Run `npm test` and confirm your suite passes.

---

## Part B — Have AI extend the suite (15 min)

### Step 1 — Pick your AI assistant

Same rule as Lab 1 — use whatever you have.

### Step 2 — Give it the test file and a clear instruction

Try a prompt like:

> Here's my baseline test suite for [feature]. Add 8 more tests
> covering edge cases and additional behaviors. Use Vitest + React
> Testing Library + MSW. Query by role/label/text, not test IDs. Use
> user-event, not fireEvent. Keep each test focused on a single
> behavior. Follow the conventions in AGENTS.md.

The instructions matter — without the role/label/user-event guidance,
AI will default to getByTestId and fireEvent.

### Step 3 — Don't read the AI output yet

Just paste it in. We're going to review it in Part C.

Run `npm test`. Some of the AI tests will fail, some will pass.
That's expected. **Don't fix the failures yet** — failures are part of
what you're reviewing.

---

## Part C — Review every AI test (20 min)

This is the load-bearing part of the lab. Open
`lab-files/lab-07/lab07-review.md` and create a section for every
AI-generated test.

### Per-test format

For each test the AI added, decide: **keep, refactor, or delete** —
and write a one-sentence reason. Cite the Module 8 red-flag list when
applicable.

```markdown
## AI test #1 — "renders the post list"

**Verdict:** keep
**Reason:** queries by role, asserts on visible text, single behavior. Solid baseline test.

## AI test #2 — "calls setLoading when fetching"

**Verdict:** delete
**Reason:** spies on internal state via `vi.spyOn` (Module 8 red flag #1). Tests
implementation. The behavior — that the loading state shows — is already covered
by AI test #1's render assertion.

## AI test #3 — "shows the search results after typing"

**Verdict:** refactor
**Reason:** uses `fireEvent.change` instead of `userEvent.type` (red flag #4).
Refactored to use userEvent and findBy. Updated test passes.
```

### Red flags from Module 8

Use these when justifying a "delete" or "refactor" verdict:

1. `vi.spyOn` on React hooks — testing internals
2. `getByTestId` everywhere instead of `getByRole`
3. `expect(setState).toHaveBeenCalledWith(...)` — implementation coupling
4. `fireEvent` instead of `userEvent`
5. Mocking individual functions in `api.js` — should mock at the network
6. `setTimeout`-based waits — flakiness factory
7. Tests that pass without rendering anything — checking pure utils only
8. Snapshot tests for entire components

### Apply your verdicts

For each test:

- **Keep** — leave it alone
- **Refactor** — rewrite it according to your reason. Test should still pass.
- **Delete** — remove it from the file

Run `npm test` again. All remaining tests should pass.

---

## Stretch — one Playwright e2e

If you have time, add a single Playwright test for the login flow.

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Create `e2e/login.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('user can sign in and reach the home feed', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/password/i).fill('correctpass');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByRole('heading', { name: /recent posts/i })).toBeVisible();
});
```

See `solutions/lab-07-stretch/playwright.config.js` for a reference
config. The `webServer` block boots Vite for you so you don't need a
separate startup step.

---

## Hints if you get stuck

- **`Error: Element type is invalid` when rendering:** check that you
  wrap the component in any required providers (`QueryClientProvider`,
  `MemoryRouter`, etc.). Create a `renderWithProviders` helper if every
  test needs the same wrapping.
- **`Unable to find an accessible element with role 'button'`:** the
  component might render buttons as `<div onClick>`. That's a real
  accessibility bug — fix the component, not the test.
- **MSW handler not matching:** check the URL exactly. Trailing slashes
  matter. Use `onUnhandledRequest: 'error'` in test setup so unmocked
  requests fail loudly.
- **`act` warnings in console:** you forgot to await a userEvent or a
  state update. The warning shows you the line.
- **AI test uses `vi.useFakeTimers()`:** usually unnecessary in a
  behavior test. Refactor to use `findBy` or remove.
- **AI test imports your component's hooks directly to spy on them:**
  definitely refactor or delete.

---

## Reference solutions

- `solutions/lab-07-tests/` — main solution with `lab07-review.md`
  showing the kind of judgment to aim for
- `solutions/lab-07-stretch/` — Playwright stretch

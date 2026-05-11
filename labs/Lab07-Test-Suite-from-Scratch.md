# Lab 7 — Test Suite from Scratch

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Set up Vitest + React Testing Library + MSW, write a baseline test suite for one feature by hand, then have an AI extend it. Mark every AI-generated test as keep, refactor, or delete — with a written reason. The review skill is the load-bearing part.

---

## What you'll have at the end

1. A working Vitest + RTL + MSW test setup in the social-media client.
2. A baseline test suite (3–5 tests) for one feature, written by you, focused on behavior.
3. An AI-extended test suite (8–15 more tests).
4. A `lab07-review.md` file marking every AI-generated test as **keep**, **refactor**, or **delete** with a reason citing Module 8's red-flag list.
5. A branch pushed: `lab07/<your-name>-tests`.

Plus, if you have time: one Playwright e2e test for the auth flow.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup — Vitest + RTL + MSW | 15 |
| Part A — Baseline test suite (you write) | 25 |
| Part B — AI extends the suite | 15 |
| Part C — Review every AI test | 15 |
| Submit | 5 |
| Stretch (if time): one Playwright e2e | + |

If you finish early, do the stretch task or extend the AI-review write-up with a "what AI did well" section.

---

## Setup

You're working in `social-media-rr-v7/` again. Continue from any of your earlier branches — `solution/lab-04-tanstack-query` is a clean baseline if you want one.

### Restart the backend

```bash
cd social-media/server
npm start
```

### Branch and install testing deps

Start from your most recent green branch (typically `lab06/<your-name>-perf`, or `solution/lab-04-tanstack-query` for a clean baseline):

```bash
cd social-media-rr-v7
git checkout lab06/<your-name>-perf   # or: git checkout solution/lab-04-tanstack-query
git checkout -b lab07/<your-name>-tests
npm install -D vitest@2 @vitejs/plugin-react jsdom @testing-library/react@16 @testing-library/user-event@14 @testing-library/jest-dom@6 msw@2
```

### Wire up Vitest

Create `vitest.config.js` (separate from `vite.config.js` so we don't clobber the RR v7 starter's plugin and dev-server config):

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

Vitest auto-detects `vitest.config.js` and uses it instead of `vite.config.js`.

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
      { id: 1, title: 'First post', body: 'Hello', author: { name: 'Marisol' } },
      { id: 2, title: 'Second post', body: 'World', author: { name: 'Diego' } },
    ])
  ),
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 99, ...body }, { status: 201 });
  }),
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (password === 'wrong') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return HttpResponse.json({ token: 'fake-token', user: { id: 1, email } });
  }),
  http.get('/api/me', () =>
    HttpResponse.json({ id: 1, email: 'test@example.com', name: 'Test User' })
  ),
];
```

Add a script to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

Run `npm test`. You should see a "no test files found" message, which is fine — you'll add tests in Part A.

---

## Part A — Baseline test suite, written by you (25 min)

Pick **one** feature to test. Suggested options (pick the one that has a clear UI in your branch):

- **PostsFeed** — renders a list of posts; shows an empty state; surfaces errors
- **NewPostForm** — validates input, submits via TanStack Query mutation, optimistic update
- **LoginForm** — handles correct credentials, wrong credentials, pending state

Write **3–5 behavior-focused tests** for that feature. Save them in `app/components/<Feature>.test.jsx` next to the component.

### Rules for your hand-written suite

- Query by **role first**, then label, then text. Never `getByTestId` unless you've exhausted the alternatives.
- Use `userEvent`, never `fireEvent`. Always `await` it.
- Each test asserts on what the user sees — visible text, focused element, navigation.
- Don't spy on hooks or internal state.
- Don't use `setTimeout` for waits. Use `findBy` or `waitFor`.

### Example test (LoginForm — your version may differ)

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../test/setup';
import { http, HttpResponse } from 'msw';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('signs the user in on valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  it('shows an error message on wrong password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('disables the button while submission is pending', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    const button = screen.getByRole('button', { name: /sign in/i });
    user.click(button);

    expect(button).toBeDisabled();
  });
});
```

Run `npm test` and confirm your suite passes. Commit:

```bash
git add -A
git commit -m "Lab 7 Part A: baseline test suite for <feature>"
```

---

## Part B — Have AI extend the suite (15 min)

### Step 1 — Pick your AI assistant

Same rule as Lab 1 — use whatever you have.

### Step 2 — Give it the test file and a clear instruction

Try a prompt like:

> Here's my baseline test suite for [feature]. Add 8 more tests covering edge cases and additional behaviors. Use Vitest + React Testing Library + MSW. Query by role/label/text, not test IDs. Use user-event, not fireEvent. Keep each test focused on a single behavior.

The instructions matter — without the role/label/user-event guidance, AI will default to getByTestId and fireEvent.

### Step 3 — Don't read the AI output yet

Just paste it in. We're going to review it in Part C.

Run `npm test`. Some of the AI tests will fail, some will pass. That's expected. **Don't fix the failures yet** — failures are part of what you're reviewing.

Commit (yes, even broken):

```bash
git add -A
git commit -m "Lab 7 Part B: AI-extended test suite (unreviewed)"
```

The unreviewed commit is deliberate — it preserves what the AI produced as a snapshot you can refer back to.

---

## Part C — Review every AI test (15 min)

This is the load-bearing part of the lab. Open `lab07-review.md` and create a section for every AI-generated test.

### Per-test format

For each test the AI added, decide: **keep, refactor, or delete** — and write a one-sentence reason. Cite the Module 8 red-flag list when applicable.

```markdown
## AI test #1 — "renders the post list"

**Verdict:** keep
**Reason:** queries by role, asserts on visible text, single behavior. Solid baseline test.

## AI test #2 — "calls setLoading when fetching"

**Verdict:** delete
**Reason:** spies on internal state via `vi.spyOn` (Module 8 red flag #1). Tests implementation. The behavior — that the loading state shows — is already covered by AI test #1's render assertion.

## AI test #3 — "shows the search results after typing"

**Verdict:** refactor
**Reason:** uses `fireEvent.change` instead of `userEvent.type` (red flag #4). Refactored to use userEvent and findBy. Updated test passes.

## AI test #4 — "renders without crashing"

**Verdict:** delete
**Reason:** smoke test, no real assertion. Adds CI time without value.

## AI test #5 — "matches snapshot"

**Verdict:** delete
**Reason:** snapshot test for the entire component (red flag #8). Will fail on every refactor. Replace with focused behavior tests.
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

Commit:

```bash
git add -A
git commit -m "Lab 7 Part C: reviewed and refactored AI-extended suite"
```

---

## Submit (5 min)

Push your branch:

```bash
git push origin lab07/<your-name>-tests
```

Submit your branch link and your `lab07-review.md` in the shared class doc.

---

## Stretch — one Playwright e2e

If you have time, add a single Playwright test for the login flow.

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Create `e2e/login.spec.ts`:

```ts
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

Add a config:

```js
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
```

Run with `npx playwright test`. The first run will bring up a real browser; you can also try `npx playwright test --ui` for the visual debugger.

---

## Hints if you get stuck

- **`Error: Element type is invalid` when rendering:** check that you wrap the component in any required providers (QueryClientProvider, BrowserRouter, etc.). Create a `renderWithProviders` helper if every test needs the same wrapping.
- **`Unable to find an accessible element with role 'button'`:** the component might render buttons as `<div onClick>`. That's a real accessibility bug — fix the component, not the test.
- **MSW handler not matching:** check the URL exactly. Trailing slashes matter. Use `onUnhandledRequest: 'error'` in test setup so unmocked requests fail loudly.
- **`act` warnings in console:** you forgot to await a userEvent or a state update. The warning shows you the line.
- **AI test uses `vi.useFakeTimers()`:** usually unnecessary in a behavior test. Refactor to use `findBy` or remove.
- **AI test imports your component's hooks directly to spy on them:** definitely refactor or delete.

---

## Solution branch

After the lab, the reference solution is at `solution/lab-07-tests`. The stretch (with Playwright) is at `solution/lab-07-stretch`. Both contain a benchmark `lab07-review.md` showing the kind of judgment to aim for.

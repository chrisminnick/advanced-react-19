# Lab 7 — Solution Exemplar

This document sketches `solution/lab-07-tests`. Use it when checking student submissions or seeding the branch.

---

## File layout (after the lab)

```
social-media-rr-v7/
├── package.json                    ← + vitest, RTL, msw, etc.
├── vite.config.js                  ← test config added
└── src/
    ├── test/
    │   ├── setup.js                ← MSW + globals
    │   └── handlers.js             ← MSW handlers
    └── components/
        └── LoginForm.test.jsx      ← the test suite
```

---

## Reference baseline test suite

The reference baseline tests `LoginForm` — 4 behavior-focused tests.

### `src/components/LoginForm.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/setup';
import LoginForm from './LoginForm';

function renderWithProviders(ui) {
  // Wrap in QueryClientProvider, BrowserRouter, etc. as needed
  return render(ui);
}

describe('LoginForm — baseline', () => {
  it('signs the user in on valid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  it('shows an error on wrong password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('disables submit while pending', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    const button = screen.getByRole('button', { name: /sign in/i });
    user.click(button); // intentionally not awaited so we can check pending state
    expect(button).toBeDisabled();
  });

  it('keeps the email value when password validation fails', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('/api/login', () =>
        HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      )
    );
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'kept@example.com');
    await user.type(screen.getByLabelText(/password/i), 'whatever');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await screen.findByText(/invalid credentials/i);
    expect(screen.getByLabelText(/email/i)).toHaveValue('kept@example.com');
  });
});
```

All four query by role/label, use `userEvent`, await async work, and assert on visible state.

---

## Simulated AI-extended suite (the "before review" state)

This represents what an AI assistant typically produces when asked to extend the baseline. Some are useful, most are problematic.

### Additional tests the AI added

```jsx
// AI test #1
it('renders the login form without crashing', () => {
  render(<LoginForm />);
});

// AI test #2
it('matches snapshot', () => {
  const { container } = render(<LoginForm />);
  expect(container).toMatchSnapshot();
});

// AI test #3
it('calls setEmail when typing in email field', async () => {
  const setEmail = vi.fn();
  vi.spyOn(React, 'useState').mockReturnValueOnce(['', setEmail]);
  render(<LoginForm />);
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'a@b.com' },
  });
  expect(setEmail).toHaveBeenCalledWith('a@b.com');
});

// AI test #4
it('shows the email field', () => {
  render(<LoginForm />);
  expect(screen.getByTestId('email-input')).toBeInTheDocument();
});

// AI test #5
it('handles login API call', async () => {
  const mockApi = vi.spyOn(api, 'login').mockResolvedValueOnce({ token: 'x' });
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'p');
  await userEvent.click(screen.getByRole('button'));
  expect(mockApi).toHaveBeenCalledWith('a@b.com', 'p');
});

// AI test #6
it('waits for login response', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'correctpass');
  await userEvent.click(screen.getByRole('button'));
  await new Promise((r) => setTimeout(r, 500));
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});

// AI test #7
it('signs the user in on valid credentials', async () => {
  // duplicate of baseline test #1
  const user = userEvent.setup();
  render(<LoginForm />);
  await user.type(screen.getByLabelText(/email/i), 'a@b.com');
  await user.type(screen.getByLabelText(/password/i), 'correctpass');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});

// AI test #8
it('navigates to /home on success', async () => {
  const user = userEvent.setup();
  renderWithProviders(<LoginForm />);
  await user.type(screen.getByLabelText(/email/i), 'a@b.com');
  await user.type(screen.getByLabelText(/password/i), 'correctpass');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByRole('heading', { name: /recent posts/i })).toBeInTheDocument();
});
```

---

## Reference `lab07-review.md`

```markdown
# Lab 7 AI test review

Reviewed against the AI-extended `LoginForm.test.jsx` (8 tests added).

## AI test #1 — "renders the login form without crashing"

**Verdict:** delete
**Reason:** smoke test with no assertions (red flag #7). Already implicitly covered by every other test that successfully renders.

## AI test #2 — "matches snapshot"

**Verdict:** delete
**Reason:** full-component snapshot test (red flag #8). Will fail on every CSS/markup tweak. The behavior assertions in tests #1, #2, and #4 of the baseline already cover the visible output.

## AI test #3 — "calls setEmail when typing in email field"

**Verdict:** delete
**Reason:** spies on `React.useState` (red flag #1) AND uses `fireEvent.change` (red flag #4) AND uses `getByPlaceholderText` for an input that has a label (lower-priority query). Three red flags in one test. Behavior is already tested in baseline test #4 (email value is preserved).

## AI test #4 — "shows the email field"

**Verdict:** refactor
**Reason:** uses `getByTestId` (red flag #2). The component renders a `<label>Email</label>` with a labeled input, so `getByLabelText(/email/i)` works. Refactored. Test now confirms the labeled email input is in the document. Kept as a quick presence check.

## AI test #5 — "handles login API call"

**Verdict:** refactor
**Reason:** mocks `api.login` directly via `vi.spyOn` (red flag #5) — should mock at the network layer with MSW. Refactored to use a server.use() override that asserts on the request payload via the handler. Now tests behavior (correct credentials submitted) without coupling to the api.js implementation.

## AI test #6 — "waits for login response"

**Verdict:** refactor
**Reason:** uses `setTimeout` for arbitrary wait (red flag #6). Refactored to use `screen.findByText(/welcome/i)` which polls until the element appears. Renamed test to "shows welcome message after login" since the wait was incidental.

## AI test #7 — "signs the user in on valid credentials"

**Verdict:** delete
**Reason:** verbatim duplicate of baseline test #1.

## AI test #8 — "navigates to /home on success"

**Verdict:** keep
**Reason:** queries by role with accessible name, uses userEvent, asserts on visible content. Real behavior I hadn't tested in my baseline (post-login navigation). Solid addition.

---

## Summary

- 8 AI-generated tests
- 4 deleted (#1, #2, #3, #7)
- 3 refactored (#4, #5, #6)
- 1 kept as-is (#8)

Final test count: 4 baseline + 1 AI-kept + 3 AI-refactored = 8 tests.

The AI's instinct to add coverage was correct (post-login navigation in #8 was a real gap), but the implementations skewed toward implementation-coupling and red-flag patterns. The keep-rate of 50% (counting refactors) feels right for the seed prompt; tighter prompts would likely raise it.
```

---

## After the review — what `LoginForm.test.jsx` looks like

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/setup';
import LoginForm from './LoginForm';

function renderWithProviders(ui) {
  return render(ui);
}

describe('LoginForm', () => {
  // Baseline 1
  it('signs the user in on valid credentials', async () => { /* ... */ });
  // Baseline 2
  it('shows an error on wrong password', async () => { /* ... */ });
  // Baseline 3
  it('disables submit while pending', async () => { /* ... */ });
  // Baseline 4
  it('keeps the email value when password validation fails', async () => { /* ... */ });

  // AI test #4 — refactored
  it('renders an email input with an accessible label', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  // AI test #5 — refactored to use MSW for assertion
  it('submits the entered credentials to /api/login', async () => {
    let requestBody;
    server.use(
      http.post('/api/login', async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ token: 'x', user: { id: 1, email: requestBody.email } });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'submit@test.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await screen.findByText(/welcome/i);
    expect(requestBody).toEqual({ email: 'submit@test.com', password: 'correctpass' });
  });

  // AI test #6 — refactored to use findByText
  it('shows the welcome message after successful login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  // AI test #8 — kept as-is
  it('navigates to the home feed on success', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('heading', { name: /recent posts/i })).toBeInTheDocument();
  });
});
```

8 tests total. All pass. All test behavior. Survive a refactor of the LoginForm internals.

---

## Verification checklist for grading

When checking a student submission:

- [ ] Vitest + RTL + MSW are installed and working (`npm test` passes)
- [ ] Baseline suite has 3–5 tests, all using `userEvent` and role/label queries
- [ ] `lab07-review.md` exists with a verdict for every AI-generated test
- [ ] Reasons cite specific red flags from Module 8
- [ ] The final test file passes (`npm test` clean)
- [ ] Student deleted at least one AI test and refactored at least one (mix shows real triage)
- [ ] No `getByTestId` in the final suite
- [ ] No `fireEvent` in the final suite
- [ ] No `setTimeout` waits in the final suite

A submission with all eight is exemplar. 5–6 is passing. Fewer than 4 means the student didn't complete Part C — a redo is appropriate.

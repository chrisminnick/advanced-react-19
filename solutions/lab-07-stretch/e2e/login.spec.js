import { test, expect, request as apiRequest } from '@playwright/test';

const TEST_EMAIL = 'lab07-e2e@example.com';
const TEST_PASSWORD = 'lab07-pass';

// Make sure the test user exists. Signing up an already-existing user
// returns 409 from the backend — that's fine, it means the previous run
// left them around.
test.beforeAll(async () => {
  const ctx = await apiRequest.newContext({ baseURL: 'http://localhost:5000' });
  const res = await ctx.post('/api/signup', {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD, displayName: 'E2E User' },
  });
  if (![200, 201, 409].includes(res.status())) {
    throw new Error(`signup setup failed: ${res.status()} ${await res.text()}`);
  }
  await ctx.dispose();
});

test('user can sign in and reach the home feed', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(TEST_EMAIL);
  await page.getByLabel('Password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByRole('heading', { name: /recent posts/i })).toBeVisible();
  // Header greeting reflects who signed in.
  await expect(page.getByText(/signed in as/i)).toBeVisible();
});

test('wrong password shows an error and stays on /login', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(TEST_EMAIL);
  await page.getByLabel('Password').fill('definitely-not-the-password');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Error renders inline; URL doesn't change.
  await expect(page.getByRole('alert')).toContainText(/invalid email or password/i);
  await expect(page).toHaveURL(/\/login/);
});

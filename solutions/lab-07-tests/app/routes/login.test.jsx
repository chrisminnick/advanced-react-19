// Light test for the login route's UI. The action runs server-side in
// production (RR v7 loaders/actions execute on the server), so testing
// the action handler is a separate concern from testing the rendered
// form. These tests cover what's interactive in the browser.

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/renderWithProviders.jsx';
import LoginPage from './login.jsx';

describe('LoginPage (rendered form)', () => {
  it('renders email + password fields and a sign-in button', () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    expect(
      screen.getByRole('textbox', { name: /email/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders a "next" hidden field carrying the search param', () => {
    renderWithProviders(<LoginPage />, { route: '/login?next=/home/profile' });

    const next = document.querySelector('input[name="next"]');
    expect(next).toHaveValue('/home/profile');
  });

  it('lets the user type their credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');

    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('a@b.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('secret123');
  });
});

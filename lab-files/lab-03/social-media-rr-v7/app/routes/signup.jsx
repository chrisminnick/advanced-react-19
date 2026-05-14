import { Form, Link, redirect, useActionData } from 'react-router';
import * as api from '../lib/api.server.js';

export function meta() {
  return [{ title: 'Create account' }];
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  try {
    await api.signup({ email, password, displayName });
  } catch (err) {
    if (err.status === 409) return { error: 'That email is already registered.' };
    return { error: err.message };
  }

  return redirect('/login');
}

export default function SignupPage() {
  const actionData = useActionData();

  return (
    <main className="auth-page">
      <h1>Create account</h1>
      <Form method="post" className="auth-form">
        <label>
          Display name
          <input name="displayName" type="text" autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {actionData?.error && (
          <p role="alert" className="error">{actionData.error}</p>
        )}
        <button type="submit">Create account</button>
      </Form>
      <p>
        Already have one? <Link to="/login">Sign in.</Link>
      </p>
    </main>
  );
}

import { Form, Link, redirect, useActionData, useSearchParams } from 'react-router';
import * as api from '../lib/api.server.js';

export function meta() {
  return [{ title: 'Sign in' }];
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const next = formData.get('next') || '/home';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const { response } = await api.login(email, password);

    // The backend's response carries Set-Cookie for the session. Forward it
    // verbatim — the browser will store it and send it back on every
    // subsequent request to this origin (Vite proxies same-origin in dev).
    const setCookie = response.headers.get('set-cookie');
    return redirect(next, {
      headers: setCookie ? { 'Set-Cookie': setCookie } : undefined,
    });
  } catch (err) {
    if (err.status === 401) return { error: 'Invalid email or password.' };
    return { error: err.message };
  }
}

export default function LoginPage() {
  const actionData = useActionData();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/home';

  return (
    <main className="auth-page">
      <h1>Sign in</h1>
      <Form method="post" className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {actionData?.error && (
          <p role="alert" className="error">{actionData.error}</p>
        )}
        <button type="submit">Sign in</button>
      </Form>
      <p>
        No account yet? <Link to="/signup">Create one.</Link>
      </p>
    </main>
  );
}

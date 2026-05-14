import { Form, redirect } from 'react-router';
import * as api from '../lib/api.server.js';

export async function action({ request }) {
  // Tell the backend to clear its server-side state (no-op for stateless JWT,
  // but it's good hygiene and matches what cookie sessions would need).
  let setCookie = null;
  try {
    const { response } = await api.logout(request);
    setCookie = response.headers.get('set-cookie');
  } catch {
    // Even if the backend errored, clear the cookie locally.
  }

  // Belt-and-suspenders: also clear the cookie on this side, in case the
  // backend's response didn't carry one (or carried one for a different path).
  const fallbackClear = 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';

  return redirect('/login', {
    headers: { 'Set-Cookie': setCookie ?? fallbackClear },
  });
}

export default function LogoutPage() {
  return (
    <main className="auth-page">
      <h1>Sign out</h1>
      <Form method="post">
        <button type="submit">Sign out</button>
      </Form>
    </main>
  );
}

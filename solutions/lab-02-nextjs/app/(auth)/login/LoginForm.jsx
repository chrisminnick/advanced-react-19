'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// Pulled into a Client Component so we can use useActionState/useFormStatus
// for the error message and the disabled state during submit. The action
// itself stays on the server (it's passed in as a prop from the page).
export default function LoginForm({ action, next }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <main className="auth-page">
      <h1>Sign in</h1>
      <form action={formAction} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {state?.error && (
          <p role="alert" className="error">{state.error}</p>
        )}
        <SubmitButton />
      </form>
      <p>
        No account yet? <Link href="/signup">Create one.</Link>
      </p>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

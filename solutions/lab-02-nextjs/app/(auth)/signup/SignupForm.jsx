'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

export default function SignupForm({ action }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <main className="auth-page">
      <h1>Create account</h1>
      <form action={formAction} className="auth-form">
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
        {state?.error && (
          <p role="alert" className="error">{state.error}</p>
        )}
        <SubmitButton />
      </form>
      <p>
        Already have one? <Link href="/login">Sign in.</Link>
      </p>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating…' : 'Create account'}
    </button>
  );
}

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const initial = { ok: false, error: null, email: '' };

// Client Component that wires the Server Action to React 19's
// useActionState. The hook returns [state, dispatchableAction] —
// dispatch via <form action={...}> and the action runs on the server.
export default function SubscribeForm({ action }) {
  const [state, dispatch] = useActionState(action, initial);

  return (
    <form action={dispatch} className="subscribe">
      <label>
        Email
        <input
          name="email"
          type="email"
          defaultValue={state.email}
          required
          autoComplete="email"
        />
      </label>
      {state.error && <p role="alert" className="error">{state.error}</p>}
      {state.ok && (
        <p role="status" className="success">
          Thanks — we'll email <strong>{state.email}</strong>.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Subscribing…' : 'Subscribe'}
    </button>
  );
}

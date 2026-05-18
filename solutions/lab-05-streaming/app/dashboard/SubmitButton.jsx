'use client';

import { useFormStatus } from 'react-dom';

// useFormStatus only works inside a Client Component descendant of a <form>.
// Extracted here so the rest of AddTaskForm can stay declarative.
export default function SubmitButton({ label = 'Add task', pendingLabel = 'Adding…' }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

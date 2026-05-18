'use server';

import { createTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';

// Server Action: runs on the server when the form posts to it. The function
// signature is the one useActionState expects: (prevState, formData) =>
// nextState. The returned object becomes the new `state` in the Client
// Component.
//
// Validation lives here, on the server. The same response shape carries the
// error message and the previously-submitted values so the form can
// re-render with the user's input intact.
export async function addTaskAction(prevState, formData) {
  const title = formData.get('title')?.toString().trim() ?? '';
  const status = formData.get('status')?.toString() ?? 'open';

  if (!title) {
    return { ok: false, error: 'Title is required.', title, status };
  }
  if (title.length > 100) {
    return {
      ok: false,
      error: 'Title must be 100 characters or less.',
      title,
      status,
    };
  }
  if (!['open', 'in-progress', 'done'].includes(status)) {
    return { ok: false, error: 'Invalid status.', title, status };
  }

  await createTask({ title, status });

  // Tell Next to drop the cached HTML for /dashboard so the stats card and
  // activity feed re-fetch on next render.
  revalidatePath('/dashboard');

  // Reset the form's values on success.
  return { ok: true, title: '', status: 'open' };
}

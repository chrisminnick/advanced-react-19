'use server';

// 'use server' at the top marks every export here as a Server Action.
// Server Actions are async functions that:
//   - Run on the server
//   - Are callable from Client Components via a regular import
//   - Get serialized form data as their second argument when used as a
//     <form action={...}> handler
//
// useActionState calls them with (prevState, formData).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(prevState, formData) {
  const email = formData.get('email')?.toString().trim() ?? '';

  if (!email) {
    return { ok: false, error: 'Email is required.', email };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'That doesn’t look like a valid email.', email };
  }
  if (email === 'boom@example.com') {
    // Realistic backend-error simulation. Throwing would escape to the
    // route's error boundary; returning lets us render inline.
    return { ok: false, error: 'Server error: try again later.', email };
  }

  // Pretend we wrote to a database.
  await new Promise((r) => setTimeout(r, 300));
  return { ok: true, email };
}

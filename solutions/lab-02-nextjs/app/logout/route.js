import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/app/lib/session';
import * as api from '@/app/lib/api.server';

// POST /logout. Called from a regular HTML form on the home page.
// Clears the cookie locally AND tells the backend (so server-side state
// can also be invalidated, today a no-op for stateless JWTs).
export async function POST(request) {
  try {
    await api.logoutOnBackend();
  } catch {
    // Even if the backend errored, clear locally.
  }
  clearSessionCookie();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}

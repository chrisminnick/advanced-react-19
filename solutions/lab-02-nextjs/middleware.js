import { NextResponse } from 'next/server';

// Auth gate. Runs before every request that matches `config.matcher`.
//
// We deliberately keep this dumb: presence of the cookie is enough to let the
// request through. The page itself still calls /api/me and will redirect on
// 401 — the middleware's job is just to avoid rendering a logged-out page
// with a flash of personal data.
export function middleware(request) {
  const session = request.cookies.get('session');
  if (!session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // Only protect /home (and any nested routes you add under it).
  // Don't include /login or /signup here — that would loop.
  matcher: ['/home/:path*'],
};

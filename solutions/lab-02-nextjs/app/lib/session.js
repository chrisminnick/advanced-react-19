import 'server-only';
import { cookies } from 'next/headers';

// Cookie name + options shared by login/signup/logout. Mirrors what the
// backend would set on its own, so a Set-Cookie from /api/login and a
// Set-Cookie from cookies().set() here are interchangeable.
export const SESSION_COOKIE = 'session';

const BASE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: process.env.NODE_ENV === 'production',
};

export function setSessionCookie(token) {
  cookies().set(SESSION_COOKIE, token, {
    ...BASE_OPTIONS,
    maxAge: 24 * 60 * 60, // 24h, matching the backend's TOKEN_TTL
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export function getSessionToken() {
  return cookies().get(SESSION_COOKIE)?.value ?? null;
}

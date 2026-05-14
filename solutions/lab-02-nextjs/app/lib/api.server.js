// Server-only API client used by Server Components, Server Actions, and
// Route Handlers. Talks directly to the backend; bypasses the /api/* rewrites
// configured in next.config.mjs (those are for client-side fetches).
//
// Why a separate file from app/lib/api.js?
//   - On the server we don't have a browser cookie jar. The session cookie
//     has to be passed in explicitly via the headers we call cookies() to
//     read.
//   - This file imports `next/headers`, which is server-only. Keeping it
//     separate means we don't accidentally pull next/headers into client
//     bundles.
//
// Usage:
//   import * as api from '@/app/lib/api.server';
//   const me = await api.getMe();
//   const posts = await api.listPosts();

import 'server-only';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:4000';

async function request(path, init = {}) {
  // Forward the inbound `session` cookie so the backend sees the user.
  const sessionCookie = cookies().get('session');
  const cookieHeader = sessionCookie
    ? `session=${sessionCookie.value}`
    : undefined;

  const res = await fetch(`${BACKEND}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(
      `${res.status} ${res.statusText}${text ? ': ' + text : ''}`
    );
    err.status = res.status;
    err.response = res;
    throw err;
  }

  if (res.status === 204) return { data: null, response: res };
  return { data: await res.json(), response: res };
}

// --- Auth ---

export function login(email, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function signup({ email, password, displayName }) {
  return request('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function getMe() {
  return request('/api/me');
}

export function logoutOnBackend() {
  return request('/api/logout', { method: 'POST' });
}

// --- Posts ---

export function listPosts() {
  return request('/api/posts');
}

export function getPost(id) {
  return request(`/api/posts/${id}`);
}

export function createPost(post) {
  return request('/api/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

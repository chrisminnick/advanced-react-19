// Single source of network calls. Updated for Lab 4 stretch: listPosts
// supports cursor + limit. Other endpoints are unchanged from the starter.

const BASE = '/api';

async function request(path, init = {}) {

  if (typeof window === "undefined") {
    // Suspend forever during SSR; the client re-runs this fetch after hydration.
    return new Promise(() => {});
  }
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function signup(name, email, password) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function logout() {
  return request('/logout', { method: 'POST' });
}

export function getMe() {
  return request('/me');
}

// Posts
//
// listPosts({ cursor, limit }) hits the paginated endpoint and gets back
// { items, nextCursor }. Calling with no args still works (legacy flat
// array shape) — but the infinite-scroll path always passes at least limit.
export function listPosts(params = {}) {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set('cursor', params.cursor);
  if (params.limit) qs.set('limit', String(params.limit));
  const tail = qs.toString();
  return request(`/posts${tail ? '?' + tail : ''}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function createPost(post) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

const api = { login, signup, logout, getMe, listPosts, getPost, createPost };
export default api;

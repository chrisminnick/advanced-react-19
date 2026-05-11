// Single source of network calls. Mirrors the RR v7 client's api.js so labs
// can compare apples-to-apples.
//
// Same-origin in dev because next.config.mjs rewrites /api/* to localhost:5000.
// All requests include the session cookie automatically.
//
// Don't store auth tokens in localStorage — Module 10 covers why.

const BASE = '/api';

async function request(path, init = {}) {
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

export function listPosts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/posts${qs ? '?' + qs : ''}`);
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

const api = {
  login, signup, logout, getMe,
  listPosts, getPost, createPost,
};

export default api;

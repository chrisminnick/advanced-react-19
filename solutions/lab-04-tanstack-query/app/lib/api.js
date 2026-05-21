// Single source of network calls. Lab 4 students extend this; Lab 7 mocks it via MSW handlers.
//
// In dev, fetches go to /api/* which the Vite proxy routes to the social-media backend
// at localhost:4000. In production, configure the proxy in your hosting layer.
//
// All requests include `credentials: 'include'` so the session cookie is sent automatically.
// Don't store auth tokens in localStorage — see Module 10 for the reasoning.

const BASE = '/api';

// Browser fetch client. Posts are prefetched on the server in the home
// loader and handed to the client via dehydrate()/HydrationBoundary, so
// useSuspenseQuery resolves from cache during SSR and never calls these
// functions on the server. No SSR branch is needed here.
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
  // 204 No Content
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

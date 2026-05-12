// Adds reaction endpoints to the existing client. The rest of api.js stays
// the same as solution/lab-04-tanstack-query (and lab-07-tests) — this
// file just shows the new exports.

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

// --- Auth (unchanged) ---
export const login   = (email, password) => request('/login',  { method: 'POST', body: JSON.stringify({ email, password }) });
export const signup  = (name, email, password) => request('/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
export const logout  = () => request('/logout', { method: 'POST' });
export const getMe   = () => request('/me');

// --- Posts (unchanged) ---
export const listPosts  = () => request('/posts');
export const getPost    = (id) => request(`/posts/${id}`);
export const createPost = (post) => request('/posts', { method: 'POST', body: JSON.stringify(post) });

// --- Reactions (NEW) ---
// Server returns the post's reactions object: { heart: { count, mine }, ... }
export const addReaction    = (postId, type) =>
  request(`/posts/${postId}/reactions/${type}`, { method: 'POST' });

export const removeReaction = (postId, type) =>
  request(`/posts/${postId}/reactions/${type}`, { method: 'DELETE' });

const api = {
  login, signup, logout, getMe,
  listPosts, getPost, createPost,
  addReaction, removeReaction,
};
export default api;

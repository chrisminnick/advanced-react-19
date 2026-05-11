import axios from 'axios';

// Same-origin URLs — Vite proxies /api → http://localhost:5000.
// `withCredentials: true` so the session cookie is sent on every request.
// (Lab 1 still uses Bearer-token auth in addition; cookies are how the
// new social-media starters work and we keep the option open here.)
const api = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export default api;

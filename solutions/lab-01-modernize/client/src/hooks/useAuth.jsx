import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy init: read the saved token once. Lab 2 swaps this out for cookie-only
  // auth (Module 10's recommended pattern); Lab 1 keeps the Bearer-token path
  // for parity with the legacy starter.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Sync the token into the axios default headers + localStorage. This is a
  // legitimate `useEffect`: it's synchronizing React state with two external
  // systems (the API client and browser storage).
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
    }
  }, [token]);

  // Hydrate the user when the token changes. The `cancelled` flag avoids
  // calling setUser after the effect's cleanup runs (a classic race when
  // /api/me is slow and the user logs out before it returns). TanStack Query
  // would handle this for us — that's Module 5.
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    api
      .get('/api/me')
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        if (!cancelled) setToken(null);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(email, password) {
    const res = await api.post('/api/login', { email, password });
    // Backend returns both modern (`token`/`user`) and legacy
    // (`accessToken`/`userId`/`displayName`) fields. We use the modern shape.
    setToken(res.data.token);
    setUser(res.data.user);
  }

  async function logout() {
    try {
      await api.post('/api/logout');
    } finally {
      setToken(null);
    }
  }

  const value = { user, token, login, logout, currentUser: user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

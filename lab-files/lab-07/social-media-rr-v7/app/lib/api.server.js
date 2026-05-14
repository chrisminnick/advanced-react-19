// Server-only API client used by RR v7 loaders/actions.
//
// Why a separate file from app/lib/api.js?
//   - Loaders/actions run on Node, not the browser. There is no automatic
//     cookie jar — we must explicitly forward the request's `Cookie` header
//     to the backend, and propagate the backend's `Set-Cookie` back.
//   - Keeping this in a `.server.js` file tells RR v7's bundler not to ship
//     it (or its imports) to the browser.

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:5000';

async function request(path, init = {}) {
  const res = await fetch(`${BACKEND}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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
  const data = res.status === 204 ? null : await res.json();
  // Return both the body and the response so callers can grab Set-Cookie.
  return { data, response: res };
}

// Forward the inbound Cookie header so the backend sees the user's session.
function withCookie(request, init = {}) {
  const cookie = request.headers.get('cookie');
  if (!cookie) return init;
  return {
    ...init,
    headers: { ...(init.headers ?? {}), Cookie: cookie },
  };
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

export function logout(request) {
  return fetchPassthrough(request, '/api/logout', { method: 'POST' });
}

export function getMe(request) {
  return fetchPassthrough(request, '/api/me');
}

// --- Posts ---

export function listPosts(request) {
  return fetchPassthrough(request, '/api/posts');
}

// Helper for endpoints where we need to forward the user's cookies.
async function fetchPassthrough(request, path, init = {}) {
  return await (async () => {
    const opts = withCookie(request, init);
    const res = await fetch(`${BACKEND}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(opts.headers ?? {}),
      },
      ...opts,
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
    const data = res.status === 204 ? null : await res.json();
    return { data, response: res };
  })();
}

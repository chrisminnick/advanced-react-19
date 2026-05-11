# social-media-server (v2.0)

Backend used by the Advanced React course (May 2026 rewrite).

This single Express 5 / Mongoose 8 server is the backend for **all** lab clients:

- `social-media-rr-v7/` — Lab 2A starter (React Router v7 framework mode)
- `social-media-nextjs/` — Lab 2B starter (Next.js 15 App Router)
- `social-media/` — original chat-style starter, kept for Lab 1 reference
- `real-time-chat/` — Lab 1 starter (socket.io chat client). Auth goes here; socket traffic still goes to `real-time-chat/server` on port 8081.

## Requirements

- Node 22+
- MongoDB 6+ running locally (default URL: `mongodb://localhost:27017/social-network`)

## Quick start

```bash
cd social-media/server
npm install
cp .env.example .env   # if present — otherwise the defaults below kick in
npm run dev            # node --watch — restarts on file change
```

The server boots on **port 5000** (override with `PORT` or `SERVER_PORT`).

Confirm it's running:

```bash
curl http://localhost:5000/api/setup-check
# { "ok": true, "message": "social-media backend ready", "version": "2.0.0", "mongo": "connected" }
```

## Environment

All settings have working defaults so the server boots out of the box:

| Variable               | Default                                          | Notes                                           |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `PORT`                 | `5000`                                           | `SERVER_PORT` is also accepted as a fallback.   |
| `MONGO_URL`            | `mongodb://localhost:27017/social-network`       | Full connection string.                         |
| `ACCESS_TOKEN_SECRET`  | `dev-only-not-for-production`                    | **Set this** before deploying anywhere real.    |
| `ALLOWED_ORIGINS`      | `""`                                             | Comma-separated. Dev origins below are always allowed. |
| `NODE_ENV`             | _(unset)_                                        | When `production`, cookies are flagged Secure.  |

**Always-allowed dev origins** (in addition to `ALLOWED_ORIGINS`):

- `http://localhost:5173` — Vite default (RR v7 starter, modernized chat)
- `http://localhost:5174` — Vite fallback when 5173 is taken
- `http://localhost:3000` — Next.js + CRA default (Next.js starter, legacy chat)
- `http://localhost:3001` — CRA fallback

## API surface

All routes are JSON. Auth is JWT, accepted as **either** an `HttpOnly` `session` cookie (preferred, what new clients use) **or** an `Authorization: Bearer <token>` header (what the legacy chat client uses).

### Health

| Method | Path                | Auth | Notes |
| ------ | ------------------- | ---- | ----- |
| `GET`  | `/api/setup-check`  | none | Used by the pre-Day-1 setup-check script. |

### Auth

These routes are mounted at **both** `/api/user/*` (legacy chat client) **and** `/api/*` (new clients) — they're aliases of the same router.

| Method | Path                                | Auth | Notes |
| ------ | ----------------------------------- | ---- | ----- |
| `POST` | `/api/signup` · `/api/user/signup`  | none | Body: `{ email, password, displayName? }`. |
| `POST` | `/api/login`  · `/api/user/login`   | none | Sets `session` cookie. Response body has both legacy keys (`accessToken`, `userId`, `displayName`) and modern keys (`token`, `user{id,email,name}`). |
| `POST` | `/api/logout` · `/api/user/logout`  | none | Clears the `session` cookie. |
| `GET`  | `/api/me`     · `/api/user/me`      | cookie or Bearer | Returns `{ id, email, name }`. |

### Posts

| Method   | Path              | Auth | Notes |
| -------- | ----------------- | ---- | ----- |
| `GET`    | `/api/posts`      | yes  | Returns posts sorted newest first. |
| `POST`   | `/api/posts`      | yes  | Body: `{ title, body }` (the legacy `text` field is also accepted). |
| `GET`    | `/api/posts/:id`  | yes  | 404 if not found. |
| `PUT`    | `/api/posts/:id`  | yes  | Body: `{ title?, body? }`. |
| `DELETE` | `/api/posts/:id`  | yes  | 404 if not found. |

Post response shape: `{ id, title, body, author, createdAt }`.

## What changed in v2.0

- **Express 5** (was 4) — async error handling is built-in.
- **Mongoose 8** (was 6) — all queries rewritten as `async`/`await` (callback API removed in v7+). Connection no longer passes `useNewUrlParser`.
- **HttpOnly cookies** for auth, alongside the legacy Bearer-token flow. The Module 10 / Lab 8 security discussion uses this as the worked example.
- **Dual CORS allowlist** so a single backend can serve the RR v7 starter (Vite, port 5173), the Next.js starter (port 3000), and the legacy chat client (port 3000) at the same time during a class.
- **`/api/setup-check`** endpoint for the pre-Day-1 setup script.
- **Aliased routes** (`/api/user/*` and `/api/*`) so old and new clients can target the same server without modification.
- **Posts model** now stores `title`, `body`, `author`, plus Mongoose `timestamps`.

## Troubleshooting

**`ECONNREFUSED 127.0.0.1:27017`** — MongoDB isn't running. `brew services start mongodb-community` (macOS) or `sudo systemctl start mongod` (Linux).

**`CORS: origin http://... not allowed`** — your client is on a port that isn't in the dev allowlist. Add it via `ALLOWED_ORIGINS=http://localhost:1234` in `.env`.

**`TypeError: User.findOne is not a function` (or similar)** — you're on the v1 server. Re-run `npm install` after pulling v2.0; the upgrade pulled new majors of `mongoose` and `express`.

**Cookies not being sent from the client** — double-check your fetch calls include `credentials: 'include'`, and that the server's CORS allowlist contains the exact origin (scheme + host + port).

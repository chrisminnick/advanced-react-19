# Lab 1 — Solution Exemplar

This document sketches what the modernized chat app should look like at the end of Lab 1. It's the reference for the `solution/lab-01-modernize` branch.

It is not a complete file-by-file dump — it shows the patterns and the key files. Use it when checking student submissions or when seeding the solution branch.

---

## Project structure (after modernization)

```
real-time-chat/
├── client/
│   ├── package.json          ← React 19, Vite, no react-scripts
│   ├── vite.config.js        ← new
│   ├── index.html            ← moved from public/, Vite convention
│   └── src/
│       ├── main.jsx          ← was index.js; uses createRoot from React 19
│       ├── App.jsx           ← function component
│       ├── routes/
│       │   ├── ProtectedRoutes.jsx
│       │   └── index.jsx
│       ├── components/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Chat.jsx      ← function component, uses useChatConnection
│       │   └── MessageList.jsx
│       ├── hooks/
│       │   ├── useAuth.js    ← custom hook, replaces AuthContext class
│       │   └── useChatConnection.js  ← custom hook, owns socket lifecycle
│       └── api/
│           └── client.js     ← axios with interceptors
├── server/                   ← unchanged for Lab 1
└── STARTER-NOTES.md          ← explains starter is intentionally legacy
```

---

## Key file: `client/package.json`

```json
{
  "name": "real-time-chat-client",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "1.7.9",
    "bootstrap": "5.3.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-router-dom": "7.0.0",
    "socket.io-client": "4.8.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "4.3.4",
    "vite": "6.0.7"
  }
}
```

(Pin exact versions, not `^`, so the lab is reproducible across cohorts.)

---

## Key file: `client/vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
});
```

---

## Key file: `client/src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## Key file: `client/src/hooks/useChatConnection.js`

This is the central modernization. The legacy version had a `ChatProvider` class with `componentDidMount` setting up the socket and `componentWillUnmount` tearing it down. The modernized version is a custom hook with a single `useEffect` for the socket lifecycle.

```js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useChatConnection(token) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io({ auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('message', (msg) => {
      // Functional updater — closes over the current messages, not the captured ones
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  function sendMessage(text) {
    socketRef.current?.emit('message', { text });
  }

  return { messages, connected, sendMessage };
}
```

**Things to point out to students:**
- One `useEffect`, not three. Setup + teardown in the same effect.
- Functional `setMessages((prev) => …)` — not `setMessages([...messages, msg])`. The latter would capture a stale `messages` from when the effect ran.
- `socketRef` so the imperative `sendMessage` can reach the live socket without putting it in state and triggering re-renders.
- `useEffect` depends on `token` only. When the user logs out (token clears), the effect cleans up.

---

## Key file: `client/src/components/Chat.jsx`

```jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useChatConnection } from '../hooks/useChatConnection.js';
import MessageList from './MessageList.jsx';

export default function Chat() {
  const { user, token } = useAuth();
  const { messages, connected, sendMessage } = useChatConnection(token);
  const [draft, setDraft] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
  }

  return (
    <div className="container">
      <header>
        <h1>Hello, {user.name}</h1>
        <span className={connected ? 'badge bg-success' : 'badge bg-warning'}>
          {connected ? 'Connected' : 'Connecting…'}
        </span>
      </header>

      <MessageList messages={messages} currentUser={user} />

      <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3">
        <input
          className="form-control"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
        />
        <button className="btn btn-primary" disabled={!connected}>Send</button>
      </form>
    </div>
  );
}
```

**Notes:**
- No `useEffect` to derive `connected` from anything. It's returned by the hook.
- No `useEffect` to update `draft` when something else changes. It's local state, updated by the input handler.
- `<button disabled={!connected}>` — derived from state inline. No effect needed.

---

## Key file: `client/src/hooks/useAuth.js`

The legacy version was a class-based `AuthProvider` plus a `withAuth` HOC. The modernized version is a Context + custom hook.

```js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Sync token to API client and localStorage
  useEffect(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Load the current user when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    api.get('/api/me').then((res) => {
      if (!cancelled) setUser(res.data);
    });
    return () => { cancelled = true; };
  }, [token]);

  async function login(email, password) {
    const res = await api.post('/api/login', { email, password });
    setToken(res.data.token);
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Notes:**
- `useState(() => localStorage.getItem('token'))` — lazy init so we read localStorage once.
- The two `useEffect`s are both true synchronizations with external systems (localStorage and the API), which is what `useEffect` is for.
- `cancelled` flag to avoid calling `setUser` after the effect's cleanup runs. Still not perfect (better with TanStack Query, but that's Module 5).

---

## Stretch — `useOptimistic`

The stretch task adds an outer container that holds the optimistic state and passes both `addOptimistic` and the optimistic messages down.

```jsx
// Chat.jsx with useOptimistic
import { useOptimistic, useState } from 'react';
import { useChatConnection } from '../hooks/useChatConnection.js';
import { useAuth } from '../hooks/useAuth.js';
import MessageList from './MessageList.jsx';

export default function Chat() {
  const { user, token } = useAuth();
  const { messages, connected, sendMessage } = useChatConnection(token);

  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (current, draft) => [
      ...current,
      { id: draft.id, text: draft.text, author: user, sending: true, createdAt: new Date().toISOString() },
    ]
  );

  async function handleSubmit(formData) {
    const text = formData.get('text');
    if (!text?.trim()) return;
    const id = crypto.randomUUID();
    addOptimistic({ id, text });
    sendMessage(text);
  }

  return (
    <div className="container">
      <h1>Hello, {user.name}</h1>
      <MessageList messages={optimistic} currentUser={user} />
      <form action={handleSubmit} className="d-flex gap-2 mt-3">
        <input name="text" className="form-control" placeholder="Type a message" />
        <button className="btn btn-primary" disabled={!connected}>Send</button>
      </form>
    </div>
  );
}
```

`MessageList` should respect a `sending` flag on the message and render those bubbles with a faded style:

```css
.message.sending {
  opacity: 0.55;
  font-style: italic;
}
```

---

## Reference `lab01-ai-review.md` — what students should produce

The students' write-up should look something like this. Use it as a benchmark.

```markdown
# Lab 1 AI Review

I used Cursor with claude-sonnet-4-6 for the modernization pass. Three real issues:

## 1. Derived state in useChatConnection.js (line 12)

The AI produced:
```js
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  setUnreadCount(messages.filter(m => !m.read).length);
}, [messages]);
```

This is wrong: `unreadCount` is derivable from `messages`, so it shouldn't be state. It causes a double-render every time a message arrives. I replaced it with:

```js
const unreadCount = messages.filter(m => !m.read).length;
```

## 2. Stale closure in socket handler (Chat.jsx, line 28)

The AI wrote:
```js
useEffect(() => {
  socket.on('typing', () => setTyping([...typing, user.name]));
}, []);
```

The empty dep array means `typing` is captured from the first render and never updated. Functional updater fix:

```js
socket.on('typing', () => setTyping(prev => [...prev, user.name]));
```

## 3. forwardRef left behind in MessageInput.jsx

Despite the prompt asking for ref-as-a-prop, the AI kept `forwardRef`:

```js
const MessageInput = forwardRef((props, ref) => <input ref={ref} {...props} />);
```

Replaced with React 19 ref-as-a-prop:

```js
function MessageInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```
```

# Lab 1 AI Review (reference)

This is the reference write-up for Lab 1 — what students should produce in
`lab01-ai-review.md` at the root of `real-time-chat/`.

I used Cursor with claude-sonnet-4-6 for the modernization pass. The prompt
was the one from the lab handout. Three real issues followed.

---

## 1. Stale closure in the socket handler

**Where:** `client/src/hooks/useChatConnection.js`, the original effect body.

**What the AI did:**

```js
useEffect(() => {
  const socket = io({ auth: { token } });
  socket.on('message', (msg) => {
    setMessages([...messages, msg]); // ← captures `messages` from this render
  });
  return () => socket.disconnect();
}, [token]);
```

**Why it's wrong:** the handler closes over the `messages` array that
existed when the effect last ran. If three messages arrive in quick
succession, only the last one ends up in state — the first two are
overwritten by the second and third callbacks computing
`[...originalEmptyArray, msg]`. Classic stale-closure bug.

**What I replaced it with:**

```js
socket.on('message', (msg) =>
  setMessages((prev) => [...prev, msg])
);
```

Functional updater — React passes the current state in, no closure
problem.

---

## 2. `useState` for derived data

**Where:** `client/src/components/Chat.jsx`, original AI version had:

```js
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  setUnreadCount(messages.filter((m) => !m.read).length);
}, [messages]);
```

**Why it's wrong:** `unreadCount` is fully derivable from `messages`. Storing
it in state causes a double-render every time a message arrives (one for
the new message, one for the new count) and means the two values can drift
out of sync if anyone ever forgets to update both. This is the #1 thing on
the Module 2 review checklist.

**What I replaced it with:**

```js
const unreadCount = messages.filter((m) => !m.read).length;
```

A plain calculation in the component body. Recomputed on every render —
which is fine, it's an O(n) walk over a small array — and always
in sync with `messages`.

---

## 3. `forwardRef` left behind

**Where:** `client/src/components/MessageInput.jsx` (the AI extracted this
from the original input). Despite the prompt explicitly asking for
ref-as-a-prop, the AI kept the React 18 pattern:

```js
import { forwardRef } from 'react';

const MessageInput = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

export default MessageInput;
```

**Why it's wrong:** React 19 deprecates `forwardRef` for new code. `ref` is
just a prop. Keeping `forwardRef` works today but it's the kind of
zombie pattern that lingers for years if you don't kill it during a
modernization.

**What I replaced it with:**

```js
export default function MessageInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

(In the final solution I inlined the input into `Chat.jsx` since it
wasn't being reused — but the same fix applies wherever the AI dropped
a `forwardRef`.)

---

## Aside — what the AI got *right* worth noting

For honesty: the AI nailed two things I expected it to miss.

- It moved the socket creation inside the `useEffect` and returned a
  cleanup function that called `socket.disconnect()`. The original
  starter created a module-singleton socket; the AI was right to
  scope it to the connection's lifecycle.
- It used `useState(() => localStorage.getItem('token'))` for the lazy
  initializer — caught the "this runs on every render unless you wrap
  it in a function" trap on its own.

So the takeaway isn't "AI is bad at hooks" — it's "AI is bad at hooks in
predictable ways, and a checklist catches them."

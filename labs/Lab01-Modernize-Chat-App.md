# Lab 1 — Modernize the Chat App

**Time:** 90 minutes

**Format:** Hands-on. Work alone or in pairs.

**Goal:** Take a deliberately legacy React-18-on-CRA chat app and modernize
it to React 19 + Vite + function components + hooks. Use an AI assistant
for the first pass, then catch and fix what it got wrong.

---

## What you'll have at the end

A working real-time chat app that:

1. Runs on Vite, not Create React App
2. Uses React 19, not React 18
3. Has zero class components — all function components with hooks
4. Has no `useEffect` for things that aren't synchronization with external systems
5. Comes with a short written review of three mistakes the AI made and how you fixed them

Plus, if you have time: messages that appear instantly thanks to `useOptimistic`.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup + run the starter | 10 |
| Part 1 — Modernize with AI | 50 |
| Part 2 — Review the AI's work | 30 |
| Stretch (if time): `useOptimistic` | + |

If you finish early, do the stretch task or help a neighbor.

---

## Setup

The course repo is already on your VM at `C:\advanced-react-19` (or
`~/advanced-react-19` if you're on Mac/Linux).

Open `lab-files/lab-01/` in your editor. You'll see two top-level
folders:

```
lab-files/lab-01/
├── real-time-chat/      ← chat app (client + chat server)
└── social-media/server/ ← auth backend
```

Read `lab-files/lab-01/README.md` — it has the three-terminal startup
sequence. The short version:

```bash
# Terminal 1 — auth backend (port 5000)
cd lab-files/lab-01/social-media/server
npm install
npm run dev

# Terminal 2 — socket.io chat server (port 8081)
cd lab-files/lab-01/real-time-chat/server
npm install
npm start

# Terminal 3 — chat client (port 3000)
cd lab-files/lab-01/real-time-chat/client
npm install
npm start
```

Open <http://localhost:3000>. Sign up with a fake email, then log in.
Open a second browser (Chrome and Firefox both, or Chrome + Edge) and
chat with yourself.

If the chat works, you're set. **Make a backup copy of your starter
state before you start changing things** — that way if you wreck the
codebase past recovery you can copy it back fresh:

```bash
# From the repo root, in any terminal:
cp -R lab-files/lab-01 lab-files/lab-01-backup

# Windows PowerShell:
Copy-Item -Recurse lab-files/lab-01 lab-files/lab-01-backup
```

You'll work directly inside `lab-files/lab-01/real-time-chat/client/`
for most of this lab. The chat server doesn't change.

---

## Part 1 — Modernize with AI (45 min)

The starter is intentionally a museum piece: class components,
`componentDidMount`, `setState({})`, and `forwardRef`. Your job is to
drag it into 2026.

### Step 1 — Pick your AI assistant

Use whatever you have. Cursor, Claude Code, Copilot Chat, Windsurf,
Codeium — they all work. The lab is tool-agnostic.

Make sure your assistant can read `AGENTS.md` (or `CLAUDE.md`) at the
repo root before you start. Those files tell the AI what conventions
this codebase follows; without them, the AI defaults to whatever it
sees most often online (often: class components and `getByTestId`).

### Step 2 — Give the AI the goal

Tell it (or paste a prompt like) something like:

> Modernize this React app from React 18 / CRA / class components to
> React 19 / Vite / function components and hooks. Convert every class
> component to a function component. Replace `componentDidMount` and
> `componentWillUnmount` with `useEffect`. Replace `this.setState` with
> `useState` or `useReducer`. Replace `forwardRef` with the React 19
> ref-as-a-prop pattern. Don't change the app's behavior; only the
> implementation. Follow the conventions in AGENTS.md.

Don't accept its first attempt blindly. Read what it produced.

### Step 3 — Run the converted app

Run `npm run dev` after each AI batch (the modernized client uses Vite
on port 5173). Fix runtime errors. Common failure points:

- The AI converted `componentDidMount` to a `useEffect(() => {...}, [])` —
  but moved a value into the effect that should be in the dep array.
  You'll see it firing once when it should fire every time, or vice versa.
- The AI wrapped state setters in their own `useEffect`. Often wrong —
  these should be inside the event handlers that triggered them.
- The AI converted `this.setState({ count: this.state.count + 1 })` to
  `setCount(count + 1)`. That's race-prone. Use `setCount(n => n + 1)`.
- The AI broke socket event handler cleanup, leading to multiple
  subscriptions stacking up across re-renders.

You don't need to ship a version that's identical to the AI's first
draft — fix what's wrong as you go.

### Step 4 — Check off the modernization checklist

Before you move on, your client code should have:

- [ ] No `class` declarations in `src/`
- [ ] No `componentDidMount`, `componentWillUnmount`, `componentDidUpdate`,
      `getDerivedStateFromProps`, `componentDidCatch` anywhere
- [ ] No `forwardRef` (use `ref` as a regular prop)
- [ ] No `setState` calls (use `useState` or `useReducer`)
- [ ] No `useEffect` for derived state — anything you can compute from
      props/state should be a plain calculation
- [ ] React 19 in `package.json` (not `^18`)
- [ ] `npm run dev` works; you can sign up, log in, and chat across two browsers

---

## Part 2 — Review the AI's work (25 min)

This is the part of the lab the rest of the course depends on. Don't
skip it.

### Step 1 — Use the checklist from Module 2

Open the slide deck for Module 2 to the "AI hook mistakes — your review
checklist" slide. You're looking for:

- `useState` for derived data that should be a plain calculation
- `useEffect` to reset state on prop change (use a `key` prop instead)
- `useEffect` to fetch data (in this app, it's borderline-OK — but
  watch for it being misused)
- Stale closure in `useEffect` (missing dep, or use functional `setState`)
- Hooks inside conditionals, callbacks, or after early returns
- Custom hooks called conditionally

### Step 2 — Find at least three issues

Find at least three real issues in the AI-generated code. Real issues —
not style preferences, not naming. Things that are wrong or fragile.

For each one, write:

1. **Where it is** — file path and line number(s)
2. **What the AI did** — the wrong code, copy-pasted
3. **Why it's wrong** — what's the actual bug or smell
4. **What you replaced it with** — the corrected code

Save these as `lab01-ai-review.md` at the root of `lab-files/lab-01/`.

---

## Stretch task — `useOptimistic` for instant messages

If you finish early, add optimistic message sending so a message appears
in the chat thread instantly when the user hits send, instead of waiting
for the server round-trip.

You'll need:

```js
const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,
  (current, newMessage) => [...current, { ...newMessage, sending: true }]
);
```

Then in your form's submit handler:

```js
async function handleSend(formData) {
  const text = formData.get('text');
  addOptimistic({ text, author: currentUser, id: crypto.randomUUID() });
  await sendMessage(text); // socket emit or HTTP post
}
```

Wire `handleSend` as a form action — `<form action={handleSend}>` — so
React treats it as a transition. (Without that, the optimistic value
reverts on the next render.) Render `optimisticMessages` instead of
`messages`. Add a CSS class for `.sending` that dims the bubble until
the server confirms.

If the AI helps you with this — review the `useOptimistic` setup
carefully. AI tools as of mid-2026 still get the reducer signature
wrong about a third of the time.

---

## Future feature ideas (post-lab, if you want to keep playing)

The original "Future Features" section from the 2024 lab is still
relevant:

- Direct messages (1:1 instead of single global channel)
- Multiple channels with channel switching
- Typing indicators
- Read receipts
- Image/file uploads
- Emoji reactions
- Message editing and deletion (with audit trail)

These are not part of Lab 1. Pick one over lunch if you want a personal
challenge.

---

## Hints if you get stuck

- **I broke something past recovery:** delete `lab-files/lab-01/` and
  restore from your backup copy.
- **Vite import errors after the AI's first pass:** the AI may have
  used `process.env.REACT_APP_X` (CRA convention). Vite uses
  `import.meta.env.VITE_X`. Update your env names and the references.
- **Socket.io reconnects on every render:** your `useEffect` is missing
  the empty dependency array, or you're recreating the socket inside
  the component body. Move the socket to a `useRef` initialized once,
  or to a module-scope singleton.
- **Class-based context provider didn't convert cleanly:** rewrite the
  provider as a function component using `useState` or `useReducer`,
  then export it.
- **Auth `setState({ user })` was conditional inside `componentDidMount`:**
  the AI probably converted it to a `useState` initialized with a
  function. Check that the function returns the right initial value.
- **The chat UI shows the same message twice:** you have two socket
  subscriptions. The cleanup in `useEffect` isn't firing. Make sure you
  `return () => socket.off('message', handler)` in the effect.

---

## Reference solution

After the lab, the reference solution lives in
`solutions/lab-01-modernize/`. Read its `README.md` first; it explains
what changed and why. Don't peek before you've done your own review —
the value of the lab is in finding the bugs yourself.

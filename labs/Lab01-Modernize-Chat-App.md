# Lab 1 — Modernize the Chat App

**Time:** 90 minutes

**Format:** Hands-on. Work alone or in pairs.

**Goal:** Take a deliberately legacy React-18-on-CRA chat app and modernize it to React 19 + Vite + function components + hooks. Use an AI assistant for the first pass, then catch and fix what it got wrong.

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
| Part 1 — Modernize with AI | 45 |
| Part 2 — Review the AI's work | 25 |
| Part 3 — Submit | 10 |
| Stretch (if time): `useOptimistic` | + |

If you finish early, do the stretch task or help a neighbor.

---

## Setup

If you haven't already, clone the lab repo:

```bash
git clone https://github.com/chrisminnick/advanced-react.git
cd advanced-react
```

Open `real-time-chat/` in your editor. You'll see two folders: `client/` and `server/`. Read `STARTER-NOTES.md` at the top — it explains what's intentionally legacy and why.

Start the server:

```bash
cd real-time-chat/server
npm install
npm start
```

In a second terminal, start the client:

```bash
cd real-time-chat/client
npm install
npm run dev
```

Open the URL the client prints (Vite default: `http://localhost:5173`). Sign up with a fake email, then log in. Open a second browser (Chrome and Firefox both, or Chrome + Edge) and chat with yourself.

If the chat works, you're set. **Create a feature branch before you change anything:**

```bash
git checkout -b lab01/<your-name>-modernize
```

---

## Part 1 — Modernize with AI (45 min)

The starter is intentionally a museum piece: class components, `componentDidMount`, `setState({})`, and `forwardRef`. Your job is to drag it into 2026.

### Step 1 — Pick your AI assistant

Use whatever you have. Cursor, Claude Code, Copilot Chat, Windsurf, Codeium — they all work. The lab is tool-agnostic.

### Step 2 — Give the AI the goal

Tell it (or paste a prompt like) something like:

> Modernize this React app from React 18 / CRA / class components to React 19 / Vite / function components and hooks. Convert every class component to a function component. Replace `componentDidMount` and `componentWillUnmount` with `useEffect`. Replace `this.setState` with `useState` or `useReducer`. Replace `forwardRef` with the React 19 ref-as-a-prop pattern. Don't change the app's behavior; only the implementation.

Don't accept its first attempt blindly. Read what it produced.

### Step 3 — Run the converted app

Run `npm run dev` after each AI batch. Fix runtime errors. Common failure points:

- The AI converted `componentDidMount` to a `useEffect(() => {...}, [])` — but moved a value into the effect that should be in the dep array. You'll see it firing once when it should fire every time, or vice versa.
- The AI wrapped state setters in their own `useEffect`. Often wrong — these should be inside the event handlers that triggered them.
- The AI converted `this.setState({ count: this.state.count + 1 })` to `setCount(count + 1)`. That's race-prone. Use `setCount(n => n + 1)`.
- The AI broke socket event handler cleanup, leading to multiple subscriptions stacking up across re-renders.

You don't need to ship a version that's identical to the AI's first draft — fix what's wrong as you go.

### Step 4 — Check off the modernization checklist

Before you move on, your client code should have:

- [ ] No `class` declarations in `src/`
- [ ] No `componentDidMount`, `componentWillUnmount`, `componentDidUpdate`, `getDerivedStateFromProps`, `componentDidCatch` anywhere
- [ ] No `forwardRef` (use `ref` as a regular prop)
- [ ] No `setState` calls (use `useState` or `useReducer`)
- [ ] No `useEffect` for derived state — anything you can compute from props/state should be a plain calculation
- [ ] React 19 in `package.json` (not `^18`)
- [ ] `npm run dev` works; you can sign up, log in, and chat across two browsers

---

## Part 2 — Review the AI's work (25 min)

This is the part of the lab the rest of the course depends on. Don't skip it.

### Step 1 — Use the checklist from Module 2

Open the slide deck for Module 2 to the "AI hook mistakes — your review checklist" slide. You're looking for:

- `useState` for derived data that should be a plain calculation
- `useEffect` to reset state on prop change (use a `key` prop instead)
- `useEffect` to fetch data (in this app, it's borderline-OK — but watch for it being misused)
- Stale closure in `useEffect` (missing dep, or use functional `setState`)
- Hooks inside conditionals, callbacks, or after early returns
- Custom hooks called conditionally

### Step 2 — Find at least three issues

Find at least three real issues in the AI-generated code. Real issues — not style preferences, not naming. Things that are wrong or fragile.

For each one, write:

1. **Where it is** — file path and line number(s)
2. **What the AI did** — the wrong code, copy-pasted
3. **Why it's wrong** — what's the actual bug or smell
4. **What you replaced it with** — the corrected code

Save these as `lab01-ai-review.md` at the root of the chat app folder.

### Step 3 — Commit your work

```bash
git add -A
git commit -m "Modernize chat app to React 19 + function components + hooks"
```

---

## Part 3 — Submit (10 min)

Push your feature branch:

```bash
git push origin lab01/<your-name>-modernize
```

Submit a link to your branch and your `lab01-ai-review.md` file. Drop them in the shared class doc the instructor pointed you at.

---

## Stretch task — `useOptimistic` for instant messages

If you finish early, add optimistic message sending so a message appears in the chat thread instantly when the user hits send, instead of waiting for the server round-trip.

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

Wire `handleSend` as a form action — `<form action={handleSend}>` — so React treats it as a transition. (Without that, the optimistic value reverts on the next render.) Render `optimisticMessages` instead of `messages`. Add a CSS class for `.sending` that dims the bubble until the server confirms.

If the AI helps you with this — review the `useOptimistic` setup carefully. AI tools as of mid-2026 still get the reducer signature wrong about a third of the time.

---

## Future feature ideas (post-lab, if you want to keep playing)

The original `Future Features` section from the 2024 lab is still relevant:

- Direct messages (1:1 instead of single global channel)
- Multiple channels with channel switching
- Typing indicators
- Read receipts
- Image/file uploads
- Emoji reactions
- Message editing and deletion (with audit trail)

These are not part of Lab 1. Pick one over lunch if you want a personal challenge.

---

## Hints if you get stuck

- **Vite import errors after the AI's first pass:** the AI may have used `process.env.REACT_APP_X` (CRA convention). Vite uses `import.meta.env.VITE_X`. Update your env names and the references.
- **Socket.io reconnects on every render:** your `useEffect` is missing the empty dependency array, or you're recreating the socket inside the component body. Move the socket to a `useRef` initialized once, or to a module-scope singleton.
- **Class-based context provider didn't convert cleanly:** rewrite the provider as a function component using `useState` or `useReducer`, then export it.
- **Auth `setState({ user })` was conditional inside `componentDidMount`:** the AI probably converted it to a `useState` initialized with a function. Check that the function returns the right initial value.
- **The chat UI shows the same message twice:** you have two socket subscriptions. The cleanup in `useEffect` isn't firing. Make sure you `return () => socket.off('message', handler)` in the effect.

---

## Solution branch

After the lab, the reference solution is on the `solution/lab-01-modernize` branch in the lab repo. Don't peek before you've done your own review — the value of the lab is in finding the bugs yourself.

# Lab 1 solution — modernized chat app

Self-contained, runnable reference solution for Lab 1. Contains the
fully modernized chat client plus both backend services (socket.io chat
server and the social-media auth backend).

## How to run

Three terminals.

```bash
# Terminal 1 — auth backend (port 4000)
cd auth-server
npm install
npm run dev

# Terminal 2 — socket.io chat server (port 8081)
cd server
npm install
npm start

# Terminal 3 — chat client (port 5173)
cd client
npm install
npm run dev
```

Open <http://localhost:5173>, sign up with a fake email, log in, and
open the chat in a second browser to talk to yourself. MongoDB on
`:27017` required.

## What's in here

- `client/` — the fully modernized chat client (React 19, Vite 6,
  function components, hooks, ref-as-a-prop, no `forwardRef` or
  `componentDidMount`).
- `server/` — the socket.io chat server (port 8081), unchanged from the
  starter — Lab 1 only modernizes the client.
- `auth-server/` — the social-media auth backend (port 4000), also
  unchanged from the starter.
- `lab01-ai-review.md` — reference write-up of three real bugs an AI
  assistant produced during the modernization pass, and how the solution
  fixes them. Use this as a benchmark for grading student submissions
  (instructors) or as a sanity check for your own AI-assisted refactor
  (students).

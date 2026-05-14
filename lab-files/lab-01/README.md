# Lab 1 — starter

What's in here:

```
lab-01/
├── real-time-chat/      ← chat client (CRA, React 18, class components) + chat server (socket.io)
└── social-media/server/ ← auth backend (used for login/signup; lives on port 4000)
```

## How to run (three terminals)

```bash
# Terminal 1 — auth backend (port 4000)
cd social-media/server
npm install
npm run dev

# Terminal 2 — socket.io chat server (port 8081)
cd real-time-chat/server
npm install
npm start

# Terminal 3 — chat client (port 3000, CRA dev server)
cd real-time-chat/client
npm install
npm start
```

Open <http://localhost:3000>, sign up, log in, and chat. Open the
chat in two different browsers to talk to yourself.

The chat client is **intentionally legacy** — class components,
`componentDidMount`, race-prone `setState`, `forwardRef`. Lab 1 has
you modernize all of it. See `labs/Lab01-Modernize-Chat-App.md` for
the full handout.

## Reference solution

After you've taken your own pass: `solutions/lab-01-modernize/`.

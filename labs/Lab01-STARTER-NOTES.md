# Starter notes — `real-time-chat/client/`

## This is intentionally legacy

If you opened this folder and thought "wait, why is this written like a 2019 React tutorial?" — that's the point. This is the Lab 1 starter for the Advanced React course. It is deliberately stuck in 2024:

- React 18.2 (not 19)
- Create React App (`react-scripts`)
- Class components with `componentDidMount`, `componentWillUnmount`, `setState`
- `forwardRef` everywhere
- `process.env.REACT_APP_*` for env vars

**Don't fix it before the lab.** The lab is the fix.

## What you'll do in Lab 1

You'll modernize this codebase to:

- React 19
- Vite
- Function components with hooks
- `ref` as a regular prop
- `import.meta.env.VITE_*`

…using an AI assistant for the first pass, and then reviewing and correcting what the AI got wrong. See `labs/Lab01-Modernize-Chat-App.md` in the course materials root for the full instructions.

## Not legacy

The server (`real-time-chat/server/`) is up-to-date for 2026 — Express 5, Mongoose 8, Socket.io 4.8, modern bcrypt and jsonwebtoken. You shouldn't need to touch it during Lab 1.

## Why this exists

The 2024 version of this course modernized class components in passing. The 2026 version makes that conversion the first hands-on lab — and uses it to establish a habit students need for the rest of the course: **review AI-generated React code before you trust it.**

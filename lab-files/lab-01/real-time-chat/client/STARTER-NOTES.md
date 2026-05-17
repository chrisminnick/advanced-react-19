# Starter notes — `real-time-chat/client/`

## This is intentionally legacy

If you opened this folder and thought "wait, why is this written like a 2019 React tutorial?" — that's the point. This is the **Lab 1 starter** for the Advanced React course (v2.0). It is deliberately stuck in 2024:

- **React 18.2** (not 19)
- **Create React App** (`react-scripts`)
- **Class components** with `componentDidMount`, `componentWillUnmount`, `componentDidUpdate`, `setState`
- **`static contextType`** for context consumption (no `useContext`)
- **Render-prop wrappers** to bridge React Router hooks into class components
- **Race-prone `setState({ x: this.state.x + 1 })`** (no functional updaters)
- **`process.env.REACT_APP_*`-style** env vars (CRA convention)

**Don't fix it before the lab.** The lab is the fix.

## What you'll do in Lab 1

You'll modernize this codebase to:

- React 19
- Vite
- Function components with hooks
- `useContext` (or the new `use(context)` hook)
- Direct calls to `useParams`, `useNavigate`, etc. — no wrapper components
- Functional `setState` updaters
- `import.meta.env.VITE_*` env vars

…using an AI assistant for the first pass, and then reviewing and correcting what the AI got wrong.

See the **Lab 1** section of `student/advanced-react-labs-v2.pdf` (at the repo root) for the full lab instructions.

## Files that are class components

| File | Class? | Notes |
|---|---|---|
| `src/components/App.js` | yes | Trivial wrapper |
| `src/components/Chat.js` | yes | The big one — state, refs, lifecycle, context, custom socket effect |
| `src/components/Login.js` | yes | State + context + Navigate-on-mount |
| `src/components/Signup.js` | yes | Same shape as Login; includes a deliberately-stale `setState` check |
| `src/components/Logout.js` | yes | Side effect in `componentDidMount` |
| `src/provider/authProvider.js` | yes | `<AuthContext.Provider>` with localStorage sync via `componentDidMount`/`componentDidUpdate` |
| `src/components/ChatHeader.js` etc. | no | Tiny presentational components — already function components, no state |
| `src/routes/index.js` | no | Uses RR's createBrowserRouter — already function-shaped |
| `src/routes/ProtectedRoutes.js` | no | Tiny outlet wrapper |

The presentational and routing files are already function components and stay that way — Lab 1 isn't about converting every line, it's about converting the components that actually have state and effects.

## Why this exists

The 2024 version of this course modernized class components in passing. The 2026 version makes that conversion the **first hands-on lab** — and uses it to establish a habit students need for the rest of the course: **review AI-generated React code before you trust it.**

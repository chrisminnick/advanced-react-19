# AGENTS.md

Project context for AI coding assistants (Cursor, Claude Code, Copilot,
Windsurf, Codeium). If you're a tool reading this on first turn: this
file is the source of truth for "what does this codebase look like and
what should new code match." Read it once. Don't propose patterns it
forbids without flagging them as a deliberate departure.

## What this is

`advanced-react-19` is a 3-day instructor-led course (Webucator /
Watzthis) plus the lab projects students work in. The lab clients are
deliberately structured to teach the canonical 2026 React patterns —
keep them that way.

## Stack

| Layer | What it is |
|---|---|
| React | 19 (function components only, hooks, Server Components where applicable) |
| Backend | Node 22+, Express 5, Mongoose 8, MongoDB 8 |
| Auth | JWT in HttpOnly cookie + Bearer-token alias for legacy clients |
| RR v7 client | Vite 6, React Router 7 framework mode, TanStack Query 5 (server state), Zustand 5 (client state), `react-error-boundary` |
| Next.js client | Next 15 App Router, React 19, Server Actions, `useActionState` + `useFormStatus` |
| Testing | Vitest 2, React Testing Library 16, MSW 2, Playwright (e2e only) |
| Compiler | React Compiler enabled via `babel-plugin-react-compiler` + `eslint-plugin-react-compiler` |

Pin exact versions in lab project `package.json`s (no `^` or `~`) so
every cohort gets the same install. Bumps happen deliberately, not on
auto-update.

## Repo layout

```
lab-files/                  ← per-lab self-contained starter snapshots
  lab-01/                     ← real-time-chat (legacy CRA + React 18) + social-media/server
  lab-02/                     ← social-media-rr-v7 + social-media-nextjs + social-media/server
  lab-03/                     ← Lab 3 baseline (bloated AppContext) + social-media/server
  lab-04/                     ← Lab 3 Zustand state + social-media/server
  lab-05/                     ← server-components-dashboard (standalone)
  lab-06/                     ← Lab 4 TQ + perf seeds + social-media/server (with tags)
  lab-07/                     ← Lab 4 TQ state + social-media/server
  lab-08/                     ← Lab 7 tests state + social-media/server
demos/                      ← Module 3 in-class demos
  routing-demo/               ← RR v7 data router
  my-next-app/                ← Next 15 basics
  my-next-routing-demo/       ← Next 15 routing primitives
solutions/                  ← per-lab solution snapshots
  lab-01-modernize/, lab-02-rr-v7/, lab-02-nextjs/, lab-03-{zustand,jotai,rtk}/,
  lab-04-{tanstack-query,stretch}/, lab-05-{dashboard,streaming}/,
  lab-06-{baseline,perf}/, lab-07-{tests,stretch}/, lab-08-exemplar/
setup-check/                ← pre-Day-1 environment check script (npm run check)
instructor/                 ← decks + speaker notes
labs/                       ← lab handouts (Lab0N-*.md) + instructor notes + exemplars
student/                    ← combined student manual
scripts/                    ← repo maintenance (e.g., restructure-cleanup.sh)
```

**Workflow:** there are no feature branches. Students open
`lab-files/lab-NN/` for whichever lab they're on, edit in place, and
compare against `solutions/lab-NN-*/` when they finish. If they want
to skip ahead, the next lab's folder (`lab-files/lab-(N+1)/`) is a
clean restart point.

## Conventions — DO

- **Function components and hooks only.** No class components in any
  modernized client (the `real-time-chat/client` starter is the one
  exception, and only until Lab 1 modernizes it).
- **Server state lives in TanStack Query.** Reads use `useQuery` /
  `useSuspenseQuery`; writes use `useMutation`. Mutation invalidation
  goes through the keys factory at `app/lib/queryKeys.js`.
- **Client state lives in Zustand.** One store per feature, accessed via
  per-slice selectors (`useStore((s) => s.field)`), never the whole
  store. Action names describe transitions (`addDraft`, `removeDraft`),
  not setters.
- **Auth is HttpOnly-cookie first.** New code uses `credentials:
  'include'` and forwards the inbound `Cookie` header server-side.
  Bearer tokens are an alias for legacy clients (chat).
- **Server Components are the default in Next.js.** Mark `'use client'`
  only when a file genuinely needs `useState`, an event handler, a DOM
  ref, or a browser-only API. The smaller the Client Component, the
  better — extract Client islands rather than mark a whole page.
- **Server Actions are the default for forms in Next.js.** Use
  `useActionState` + `useFormStatus` for pending and error UI.
- **RR v7 routes use the data-router API.** `createBrowserRouter` +
  `RouterProvider`, with `loader` for reads, `action` for writes,
  `errorElement` for error handling. Use loaders even for client-side
  navigation.
- **Tests query by role first**, then label, then text. `getByTestId`
  is a last resort, used with a written justification.
- **Tests use `userEvent`, never `fireEvent`.** Always `await user.type(...)`,
  `await user.click(...)`, etc.
- **Network mocks are MSW handlers**, not `vi.fn` on `api.js`. Mock at
  the network boundary, not at the function call.
- **`useEffect` is for synchronization with external systems only**
  (DOM, localStorage, sockets, browser APIs). Not for derived state, not
  for data fetching, not for resetting state on prop change.
- **Use the React Compiler.** Don't add `React.memo`, `useMemo`, or
  `useCallback` unless the eslint-plugin-react-compiler flagged a
  bail-out, OR you can point at a Profiler trace showing the wrap is
  needed.

## Conventions — DO NOT

These map to Module 8 + Module 9's red-flag lists. Each one is a real
mistake AI assistants commonly make in this codebase.

- **Don't write class components** (in modernized clients).
- **Don't use `componentDidMount` / `componentWillUnmount` /
  `componentDidUpdate` / `getDerivedStateFromProps` / `componentDidCatch`.**
- **Don't use `forwardRef`.** React 19's ref-as-a-prop replaces it.
- **Don't fetch with `useEffect + fetch`.** That's TanStack Query (or a
  loader in RR v7, or `await` in a Next Server Component) territory.
- **Don't store derived data in `useState`.** Compute it inline; it's
  cheap and stays in sync.
- **Don't `useEffect` to reset state on prop change.** Pass a `key` prop
  to remount instead.
- **Don't use stale closures in event handlers or sockets.** Use the
  functional updater form: `setX((prev) => …)`.
- **Don't read `this.state.X` immediately after `this.setState({ X })`**
  (and the function-component equivalent: don't read state right after
  setting it). State updates are async.
- **Don't put server state in a Zustand / Redux / Jotai store.** That's
  what TanStack Query exists for.
- **Don't add `'use client'` to a Next.js page when the interactivity
  can be extracted into a child Client Component.**
- **Don't import a server-only module (e.g., something that uses `next/headers`)
  into a `'use client'` file.** Add `import 'server-only'` to the
  server-only file to get a clearer error.
- **Don't use `localStorage` for auth tokens.** HttpOnly cookies. (The
  Lab 1 chat client uses `localStorage` for its Bearer token; that's
  legacy and Lab 2 onwards switches.)
- **Don't `vi.spyOn` React hooks in tests.** That's testing
  implementation, not behavior.
- **Don't use `getByTestId` when `getByRole` + name would work.**
- **Don't use `fireEvent` in component tests.** `userEvent` is the
  default everywhere.
- **Don't snapshot whole components.** Snapshots fail on every
  refactor; the resulting noise teaches teams to ignore failing tests.
- **Don't add a `.babelrc` or a custom Babel config to a Vite or Next
  project** unless you can name a specific feature it unlocks.

## Where to put new code

Paths below are relative to whichever `lab-files/lab-NN/` folder
you're working in, OR to `solutions/lab-NN-*/` if you're updating a
solution snapshot.

- New backend routes: `social-media/server/routes/<name>.js` + mount in
  `app.js`.
- New API client functions: `app/lib/api.js` (RR v7 client) or
  `app/lib/api.server.js` (server-side, forwards cookies).
- New TanStack Query hook: `app/hooks/use<Name>.js` next to the others.
- New Zustand store: `app/stores/<feature>.js`.
- New RR v7 route: `app/routes/<name>.jsx` + entry in `app/routes.js`.
- New Next.js route: `app/<segment>/page.jsx` (+ `loading.js` /
  `error.js` / `not-found.js` siblings as appropriate).
- New Server Action: `app/<segment>/actions.js` with `'use server'` at
  the top, OR co-located in a page with `'use server'` inside a
  function body.
- New Client Component for a Server Action form: `<Name>Form.jsx` next
  to the page that uses it; receives the action as a prop so the page
  stays a Server Component.
- New tests: `app/components/<Name>.test.jsx` next to the component, or
  `app/routes/<Name>.test.jsx` next to the route.

## When you must depart from these conventions

Document it. Either:

1. Add a comment in the code explaining what's special and why, OR
2. Note it in the commit message as a deliberate departure.

The course teaches that "the AI's choice has to be defended." Same rule
applies to the AI itself.

## Verification

Before marking work as done:

- `npm run build` succeeds in the affected project.
- `npm test -- --run` passes (or you've documented why a failing test
  was deleted, not left red).
- `eslint` reports no errors on the changed files. (The
  `react-compiler/react-compiler` rule is `error`, not `warn` — bail-out
  warnings are real findings, not noise.)
- `setup-check/` passes (`npm run check`) if you touched anything that
  affects deps.

## Out of scope

- TypeScript-first. The course is JavaScript with TS-where-it-matters
  notes; don't TypeScript-ify whole files unless asked.
- Custom design systems. The labs use minimal CSS; don't pull in
  Tailwind, MUI, Mantine, etc.
- New testing frameworks. Vitest is the choice; don't propose Jest.
- Micro-frontends. Cut from v2 of the course; don't reintroduce.

# server-components-dashboard — Lab 5 starter

This is the Lab 5 starter for the Advanced React course (v2.0). It's a small Next.js 15 + React 19 project with mock data, a stub dashboard page, and the seam for students to extend.

## What's intentionally here

- **`lib/data.js`** — a mock data layer with `getTaskCounts`, `getRecentActivity`, `getTeamMembers`, `getTasks`, `createTask`. Each function has a deliberate `await sleep(...)` so the streaming-stretch task in Lab 5 produces visible benefit. The file imports `'server-only'` to prevent transitive leaks into Client Components.
- **`app/dashboard/page.jsx`** — a stub Server Component. One stat card is rendered; the rest is what students will build.
- **`app/dashboard/StubCard.jsx`** — a tiny example Server Component card. Copy-paste this shape for the three stats cards.
- **`app/dashboard/FilterToggle.jsx`** — an empty Client Component placeholder for the filter widget students fill in.
- **`app/actions/`** — empty folder; students will add `tasks.js` here for the Server Action.
- **`BOUNDARY-NOTES.md`** — seed file students append to as they make boundary decisions.

## What's intentionally missing

Lab 5 has students build:

- Three stats cards (open/in-progress/done counts)
- The activity feed Server Component
- The team list Server Component
- The Add-task form (Client Component) + Server Action
- A real implementation of `FilterToggle`
- (Stretch) Suspense boundaries for streaming

Don't fill these in for the student — that's the lab.

## Running it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/dashboard`.

The first time you hit the page you'll see the stub. The placeholder data layer is in-memory only — restart the dev server to reset.

## Conventions

- **React 19 + Next.js 15** (App Router)
- **JavaScript, not TypeScript** — per the course's locked decision
- **The React Compiler is enabled** in `next.config.mjs`. Comment out if your team isn't using it yet
- **`'server-only'`** at the top of `lib/data.js` to prevent transitive client imports
- **Path alias** `@/` resolves to the project root, so `import { foo } from '@/lib/data'` works

## When this starter changes

This scaffold lives in the course materials repo under `instructor/starters/server-components-dashboard/`. The "real" copy belongs in the lab repo (`github.com/chrisminnick/advanced-react`). When you copy from here to there, you can drop the `instructor/starters/` parent path — the project sits at the lab repo root.

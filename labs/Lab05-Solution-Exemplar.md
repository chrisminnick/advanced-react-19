# Lab 5 — Solution Exemplar

This document sketches the reference solutions for `solution/lab-05-dashboard` and `solution/lab-05-streaming`. Use it when checking student submissions or seeding the branches.

---

## Starter (`server-components-dashboard/`)

The starter is a fresh `create-next-app@latest` (App Router, JS, ESLint on) with the following additions:

```
server-components-dashboard/
├── app/
│   ├── layout.jsx
│   ├── page.jsx                 ← stub home page
│   ├── dashboard/
│   │   ├── layout.jsx           ← shared dashboard chrome
│   │   ├── page.jsx             ← stub Server Component
│   │   ├── StubCard.jsx         ← example Server Component card
│   │   └── FilterToggle.jsx     ← empty Client Component placeholder
│   └── actions/                  ← empty; students fill in
├── lib/
│   └── data.js                  ← mock data layer (with sleep delays)
├── BOUNDARY-NOTES.md            ← seed file
└── package.json                 ← Next.js 15, React 19, exact pins
```

### Key file: `lib/data.js`

```js
import 'server-only';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tasks = [
  { id: 1, title: 'Design boundary diagram', status: 'in-progress' },
  { id: 2, title: 'Wire up dashboard route', status: 'open' },
  { id: 3, title: 'Ship monthly report', status: 'done' },
  // … 6 more
];

let activity = [
  { id: 1, actor: 'Marisol', verb: 'commented on', target: 'Boundary diagram', timeAgo: '2m ago' },
  // … 9 more
];

let team = [
  { id: 1, name: 'Marisol Reyes', role: 'PM', avatar: '/avatars/m.png' },
  // … 4 more
];

export async function getTaskCounts() {
  await sleep(150); // fast
  return {
    open: tasks.filter((t) => t.status === 'open').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}

export async function getRecentActivity() {
  await sleep(800); // slow — meaningful for streaming demo
  return activity;
}

export async function getTeamMembers() {
  await sleep(400);
  return team;
}

export async function getTasks() {
  await sleep(150);
  return tasks;
}

export async function createTask({ title, status }) {
  await sleep(200);
  const task = { id: tasks.length + 1, title, status };
  tasks = [task, ...tasks];
  activity = [
    { id: activity.length + 1, actor: 'You', verb: 'created', target: title, timeAgo: 'just now' },
    ...activity,
  ];
  return task;
}
```

The `import 'server-only'` at the top is what makes a transitive import into a Client Component fail with a clean error.

---

## Solution A — `solution/lab-05-dashboard`

### `app/dashboard/page.jsx`

```jsx
import { getTaskCounts } from '@/lib/data';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import TeamList from './TeamList';
import AddTaskForm from './AddTaskForm';
import FilterToggle from './FilterToggle';

export default async function Dashboard() {
  const counts = await getTaskCounts();

  return (
    <main className="container py-4">
      <h1 className="mb-4">Project tracker</h1>

      <section className="row g-3 mb-4">
        <div className="col-md-4"><StatCard label="Open" value={counts.open} accent="blue" /></div>
        <div className="col-md-4"><StatCard label="In progress" value={counts.inProgress} accent="amber" /></div>
        <div className="col-md-4"><StatCard label="Done" value={counts.done} accent="green" /></div>
      </section>

      <div className="row g-3">
        <section className="col-md-7">
          <FilterToggle>
            <ActivityFeed />
          </FilterToggle>
        </section>
        <section className="col-md-5">
          <TeamList />
        </section>
      </div>

      <hr className="my-4" />
      <AddTaskForm />
    </main>
  );
}
```

### `app/dashboard/StatCard.jsx`

```jsx
export default function StatCard({ label, value, accent }) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <h3 className="stat-label">{label}</h3>
      <p className="stat-value">{value}</p>
    </article>
  );
}
```

No `'use client'`. Server Component.

### `app/dashboard/ActivityFeed.jsx`

```jsx
import { getRecentActivity } from '@/lib/data';

export default async function ActivityFeed() {
  const events = await getRecentActivity();
  return (
    <section className="activity-feed">
      <h2>Recent activity</h2>
      <ul className="list-unstyled">
        {events.map((e) => (
          <li key={e.id} className="activity-item">
            <strong>{e.actor}</strong> {e.verb} <em>{e.target}</em>
            <span className="text-muted ms-2">· {e.timeAgo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `app/dashboard/TeamList.jsx`

```jsx
import { getTeamMembers } from '@/lib/data';

export default async function TeamList() {
  const members = await getTeamMembers();
  return (
    <section className="team-list">
      <h2>Team</h2>
      <ul className="list-unstyled">
        {members.map((m) => (
          <li key={m.id} className="team-member">
            <img src={m.avatar} alt="" className="avatar" />
            <span className="name">{m.name}</span>
            <span className="role text-muted">{m.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `app/actions/tasks.js`

```js
'use server';

import { createTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(prevState, formData) {
  const title = formData.get('title')?.toString().trim();
  const status = formData.get('status')?.toString();

  if (!title) {
    return { error: 'Title is required.', title, status, success: false };
  }
  if (title.length > 100) {
    return { error: 'Title must be 100 characters or less.', title, status, success: false };
  }
  if (!['open', 'in-progress', 'done'].includes(status)) {
    return { error: 'Invalid status.', title, status, success: false };
  }

  await createTask({ title, status });
  revalidatePath('/dashboard');
  return { error: null, title: '', status: 'open', success: true };
}
```

### `app/dashboard/AddTaskForm.jsx`

```jsx
'use client';

import { useActionState } from 'react';
import { addTaskAction } from '@/app/actions/tasks';
import SubmitButton from './SubmitButton';

const initialState = { error: null, title: '', status: 'open', success: false };

export default function AddTaskForm() {
  const [state, action] = useActionState(addTaskAction, initialState);

  return (
    <form action={action} className="add-task-form">
      <h3>Add a task</h3>
      <div className="row g-2 align-items-end">
        <div className="col-md-7">
          <input
            name="title"
            defaultValue={state.title}
            className="form-control"
            placeholder="What needs doing?"
            autoFocus
            required
          />
        </div>
        <div className="col-md-3">
          <select name="status" defaultValue={state.status} className="form-select">
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="col-md-2">
          <SubmitButton />
        </div>
      </div>
      {state.error && <p className="text-danger mt-2 mb-0">{state.error}</p>}
      {state.success && <p className="text-success mt-2 mb-0">Task added.</p>}
    </form>
  );
}
```

### `app/dashboard/SubmitButton.jsx`

```jsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-100">
      {pending ? 'Adding…' : 'Add task'}
    </button>
  );
}
```

### `app/dashboard/FilterToggle.jsx`

```jsx
'use client';

import { useState } from 'react';

export default function FilterToggle({ children }) {
  const [completedOnly, setCompletedOnly] = useState(false);

  return (
    <div>
      <label className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={completedOnly}
          onChange={(e) => setCompletedOnly(e.target.checked)}
        />
        <span className="form-check-label">Show completed only</span>
      </label>
      {/* In a fully-wired version, completedOnly would push to URL params */}
      {/* and the Server Component child would read from searchParams. */}
      {children}
    </div>
  );
}
```

### `BOUNDARY-NOTES.md`

```markdown
# Boundary decisions

## AddTaskForm.jsx — `'use client'`

Needed because: uses `useActionState` to wire the form's pending state and the
validation feedback into the rendered DOM. Considered passing the action to a
plain `<form>` and skipping `useActionState`, but I wanted the validation
errors to round-trip from the server back into the form state, which is
exactly what `useActionState` is for.

## SubmitButton.jsx — `'use client'`

Needed because: uses `useFormStatus`, which only works inside a Client
Component descendant of a `<form>`. I extracted it into its own component so
the rest of the form's structure could stay declarative — and so I can
reuse it for the future edit-task form.

## FilterToggle.jsx — `'use client'`

Needed because: uses `useState` for the checkbox's local UI state. The
`children` prop receives a Server Component (`<ActivityFeed />`) — that part
stays server-rendered. The current implementation doesn't actually filter; the
production version would push `completedOnly` to a URL search param so the
Server Component could re-render with the filter applied.

## Components I deliberately did NOT mark `'use client'`

- `StatCard`, `ActivityFeed`, `TeamList`: pure server-rendered. No state,
  no event handlers. They read directly from the data layer.
- The dashboard page itself: awaits server data at the top of the component.
- `addTaskAction`: marked `'use server'`, not `'use client'`. Runs on the
  server when invoked from the client form.
```

---

## Solution B — `solution/lab-05-streaming`

The streaming variant moves the awaits into individual suspending Server Components and wraps each with `<Suspense>`.

### Refactored `app/dashboard/page.jsx`

```jsx
import { Suspense } from 'react';
import StatsRow from './StatsRow';
import StatsRowSkeleton from './StatsRowSkeleton';
import ActivityFeed from './ActivityFeed';
import ActivityFeedSkeleton from './ActivityFeedSkeleton';
import TeamList from './TeamList';
import TeamListSkeleton from './TeamListSkeleton';
import AddTaskForm from './AddTaskForm';
import FilterToggle from './FilterToggle';

export default function Dashboard() {
  return (
    <main className="container py-4">
      <h1 className="mb-4">Project tracker</h1>

      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      <div className="row g-3">
        <section className="col-md-7">
          <FilterToggle>
            <Suspense fallback={<ActivityFeedSkeleton />}>
              <ActivityFeed />
            </Suspense>
          </FilterToggle>
        </section>
        <section className="col-md-5">
          <Suspense fallback={<TeamListSkeleton />}>
            <TeamList />
          </Suspense>
        </section>
      </div>

      <hr className="my-4" />
      <AddTaskForm />
    </main>
  );
}
```

### `app/dashboard/StatsRow.jsx` (new — extracts the await)

```jsx
import { getTaskCounts } from '@/lib/data';
import StatCard from './StatCard';

export default async function StatsRow() {
  const counts = await getTaskCounts();
  return (
    <section className="row g-3 mb-4">
      <div className="col-md-4"><StatCard label="Open" value={counts.open} accent="blue" /></div>
      <div className="col-md-4"><StatCard label="In progress" value={counts.inProgress} accent="amber" /></div>
      <div className="col-md-4"><StatCard label="Done" value={counts.done} accent="green" /></div>
    </section>
  );
}
```

The page itself is now sync — it doesn't `await` anything. Each `<Suspense>` boundary contains a child that suspends.

### `app/dashboard/StatsRowSkeleton.jsx` (new)

```jsx
export default function StatsRowSkeleton() {
  return (
    <section className="row g-3 mb-4 placeholder-glow">
      {[1, 2, 3].map((n) => (
        <div className="col-md-4" key={n}>
          <article className="stat-card">
            <h3 className="placeholder col-6"></h3>
            <p className="stat-value placeholder col-3"></p>
          </article>
        </div>
      ))}
    </section>
  );
}
```

(Same shape pattern for `ActivityFeedSkeleton` and `TeamListSkeleton`.)

### Updated `BOUNDARY-NOTES.md` addendum

```markdown
## Streaming additions

Adding `<Suspense>` boundaries did not require any new `'use client'`
directives. Each suspending child stayed a Server Component; the
boundaries themselves are framework primitives, not Client Components.
The skeletons are also Server Components — they render once on the
server and ship as static HTML.
```

---

## Verification checklist for grading

- [ ] All non-interactive components are Server Components (no `'use client'` unless needed)
- [ ] `AddTaskForm` uses `useActionState` with the right state shape (echoing `title` and `status` for validation rollback)
- [ ] Submit button uses `useFormStatus` and is a separate component
- [ ] Server Action has `'use server'` directive (file-top OR inline — either works)
- [ ] Server Action calls `revalidatePath` so stats card updates after submission
- [ ] `<FilterToggle>` receives `<ActivityFeed />` as children, doesn't import it
- [ ] `BOUNDARY-NOTES.md` cites specific hooks/APIs for each `'use client'`
- [ ] `BOUNDARY-NOTES.md` mentions which components are deliberately server-rendered

If a submission has all eight, that's an exemplar. If 5–6, passing. Fewer than 4 means the student likely escape-hatched their way past the boundary work — encourage them to revisit Module 6's "AI escape-hatch pattern" slide.

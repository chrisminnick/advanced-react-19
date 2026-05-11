# Lab 5 — Server Components Dashboard

**Time:** 75 minutes

**Format:** Hands-on. Work alone.

**Goal:** Build a small project-tracker dashboard using Server Components for data and a Server Action for the create-task form. Document each client/server boundary decision and explain why each `'use client'` was necessary.

---

## What you'll have at the end

1. A dashboard page (`/dashboard`) showing:
   - Three stats cards (open tasks, in-progress tasks, done tasks) — Server Components
   - A recent-activity feed — Server Component
   - A team members list — Server Component
   - An "Add task" form — Server Action with `useActionState` for validation
   - A filter widget that toggles which task statuses appear in the feed — the only Client Component

2. A `BOUNDARY-NOTES.md` at the dashboard project root explaining each `'use client'` you used and why each one was necessary.

3. A branch pushed: `lab05/<your-name>-dashboard`.

Plus, if you have time: streaming with multiple Suspense boundaries so the stats cards appear instantly and the slower components (activity, team) stream in.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup + read the starter | 10 |
| Part A — Add stats cards | 15 |
| Part B — Add activity feed + team list | 15 |
| Part C — Add task with Server Action | 20 |
| Part D — Filter widget (the Client Component) | 10 |
| Part E — Document boundary decisions | 5 |
| Stretch (if time): streaming with Suspense | + |

If you finish early, do the stretch task.

---

## Setup

You're working in `server-components-dashboard/` — a Next.js 15 starter that ships with mock data and a minimal scaffolding. Spend ten minutes reading the starter before writing any code.

```bash
cd server-components-dashboard
npm install
npm run dev
```

Open `http://localhost:3000`. You'll see a placeholder dashboard with one stub card.

### Read these files

- `app/dashboard/page.jsx` — the dashboard page (currently a stub Server Component)
- `app/dashboard/layout.jsx` — shared chrome
- `lib/data.js` — mock data layer with `getTaskCounts()`, `getRecentActivity()`, `getTeamMembers()`, `getTasks()`, `createTask()`. Each function is async and has a deliberate `await sleep(...)` to make the streaming demo meaningful.
- `app/dashboard/StubCard.jsx` — example of a server-side card you can copy from
- `app/dashboard/FilterToggle.jsx` — empty Client Component placeholder

### Branch off

```bash
git checkout -b lab05/<your-name>-dashboard
```

### Boundary diary

Open `BOUNDARY-NOTES.md` at the project root and create it if it doesn't exist:

```markdown
# Boundary decisions

For each `'use client'` I added, this is what made it necessary.
```

You'll be appending to this file as you go.

---

## Part A — Add stats cards (15 min)

Build three Server Components that show task counts: `OpenTasksCard`, `InProgressCard`, `DoneCard`.

### Step 1 — Make a `StatCard` Server Component

In `app/dashboard/StatCard.jsx`:

```jsx
export default function StatCard({ label, value, accent }) {
  return (
    <article className={`stat-card ${accent}`}>
      <h3>{label}</h3>
      <p className="stat-value">{value}</p>
    </article>
  );
}
```

Note: no `'use client'` directive. This is a Server Component.

### Step 2 — Use it in `page.jsx`

```jsx
import { getTaskCounts } from '@/lib/data';
import StatCard from './StatCard';

export default async function Dashboard() {
  const counts = await getTaskCounts();

  return (
    <main>
      <h1>Project tracker</h1>
      <section className="stats-row">
        <StatCard label="Open" value={counts.open} accent="blue" />
        <StatCard label="In progress" value={counts.inProgress} accent="amber" />
        <StatCard label="Done" value={counts.done} accent="green" />
      </section>
    </main>
  );
}
```

### Step 3 — Verify

Run the app. You should see three cards with real numbers. Open DevTools → Network tab → the page request. Look at the response: there's no JS for the card components. The numbers are baked into the HTML.

This is the headline win of Server Components — the cards ship as zero JS.

---

## Part B — Add activity feed and team list (15 min)

### Step 1 — Activity feed

In `app/dashboard/ActivityFeed.jsx`:

```jsx
import { getRecentActivity } from '@/lib/data';

export default async function ActivityFeed() {
  const events = await getRecentActivity();
  return (
    <section className="activity">
      <h2>Recent activity</h2>
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <strong>{e.actor}</strong> {e.verb} <em>{e.target}</em>
            <span className="time"> · {e.timeAgo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Step 2 — Team list

In `app/dashboard/TeamList.jsx`:

```jsx
import { getTeamMembers } from '@/lib/data';

export default async function TeamList() {
  const members = await getTeamMembers();
  return (
    <section className="team">
      <h2>Team</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            <img src={m.avatar} alt="" />
            <span>{m.name}</span>
            <span className="role">{m.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Step 3 — Compose them in `page.jsx`

```jsx
import ActivityFeed from './ActivityFeed';
import TeamList from './TeamList';

export default async function Dashboard() {
  const counts = await getTaskCounts();
  return (
    <main>
      {/* stats row from Part A */}
      <div className="dashboard-grid">
        <ActivityFeed />
        <TeamList />
      </div>
    </main>
  );
}
```

### Step 4 — Verify

The page now waits for the slowest of `getTaskCounts`, `getRecentActivity`, and `getTeamMembers` before rendering anything. You can see the wait in the dev server logs (each function logs its sleep). Don't fix that yet — the streaming stretch is what fixes it.

Commit:

```bash
git add -A
git commit -m "Lab 5 Parts A & B: stats cards, activity feed, team list"
```

---

## Part C — Add task with Server Action (20 min)

This is the heart of the lab. You'll add a form that creates a task via a Server Action, with `useActionState` handling validation and the pending state.

### Step 1 — Create the action

In `app/actions/tasks.js`:

```js
'use server';

import { createTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(prevState, formData) {
  const title = formData.get('title')?.toString().trim();
  const status = formData.get('status')?.toString();

  if (!title) {
    return { error: 'Title is required.', title, status };
  }
  if (title.length > 100) {
    return { error: 'Title must be 100 characters or less.', title, status };
  }
  if (!['open', 'in-progress', 'done'].includes(status)) {
    return { error: 'Invalid status.', title, status };
  }

  await createTask({ title, status });
  revalidatePath('/dashboard');
  return { success: true };
}
```

The `revalidatePath` call invalidates the dashboard's cached data so the new task shows up.

### Step 2 — Build the form (Client Component)

In `app/dashboard/AddTaskForm.jsx`:

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
      <input
        name="title"
        defaultValue={state.title}
        placeholder="What needs doing?"
        autoFocus
        required
      />
      <select name="status" defaultValue={state.status}>
        <option value="open">Open</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Task added.</p>}
      <SubmitButton />
    </form>
  );
}
```

### Step 3 — Build a reusable submit button

In `app/dashboard/SubmitButton.jsx`:

```jsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding…' : 'Add task'}
    </button>
  );
}
```

### Step 4 — Add the form to the dashboard

```jsx
import AddTaskForm from './AddTaskForm';

// inside Dashboard's return…
<AddTaskForm />
```

### Step 5 — Verify

Try the full flow:

1. Submit with no title → error message appears, no task created
2. Submit with a 200-character title → length error
3. Submit valid title → success message, stats card updates after `revalidatePath`

Try without JavaScript: open DevTools → Settings → Disable JavaScript, then submit the form. It should still work because Server Actions support progressive enhancement. Re-enable JS afterward.

Commit:

```bash
git add -A
git commit -m "Lab 5 Part C: add-task Server Action with useActionState"
```

---

## Part D — Filter widget (10 min)

The activity feed could use a "show only completed" toggle. This is the only piece of UI in the dashboard that genuinely needs to be a Client Component — it has interactive client state.

### Step 1 — Build the toggle

In `app/dashboard/FilterToggle.jsx`:

```jsx
'use client';

import { useState } from 'react';

export default function FilterToggle({ children }) {
  const [completedOnly, setCompletedOnly] = useState(false);

  return (
    <div>
      <label className="filter">
        <input
          type="checkbox"
          checked={completedOnly}
          onChange={(e) => setCompletedOnly(e.target.checked)}
        />
        Show completed only
      </label>
      {/* In a real version you'd push completedOnly to the URL or a context.
          For this lab, just render children — the toggle is a UI demo. */}
      {children}
    </div>
  );
}
```

### Step 2 — Use it correctly

The trick: `FilterToggle` is a Client Component, but its `children` can still be the Server Component `<ActivityFeed />`. That's the composition pattern from Module 6's "pass Client Components as children" slide.

```jsx
import FilterToggle from './FilterToggle';
import ActivityFeed from './ActivityFeed';

// inside Dashboard's return…
<FilterToggle>
  <ActivityFeed />
</FilterToggle>
```

(In a real app you'd plumb the filter value down through context or URL params. For this lab, just confirm the toggle's `useState` works and the `ActivityFeed` still server-renders. Filtering by URL params is a stretch.)

### Step 3 — Verify

Click the checkbox. The state should update locally. The activity feed itself remains a Server Component — it doesn't re-fetch on the client.

---

## Part E — Document boundary decisions (5 min)

Open `BOUNDARY-NOTES.md` and write a short paragraph for each component that uses `'use client'`. Cite the exact reason. Examples of what the agent / instructor will be looking for:

```markdown
# Boundary decisions

## AddTaskForm.jsx — `'use client'`

Needed because: uses `useActionState`. Must be a Client Component to wire the form's pending state and the validation feedback to the rendered DOM.

## SubmitButton.jsx — `'use client'`

Needed because: uses `useFormStatus`, which only works inside a Client Component descendant of a `<form>`. Extracted into its own component so the rest of the form's structure could stay declarative.

## FilterToggle.jsx — `'use client'`

Needed because: uses `useState` for the checkbox's local UI state. The children prop receives a Server Component (`<ActivityFeed />`) — that part stays server-rendered.

## Components I deliberately did NOT mark `'use client'`

- `StatCard`, `ActivityFeed`, `TeamList`, the dashboard page itself: pure server-rendered, no state, no event handlers, can read the DB directly.
- The `addTaskAction` itself uses the `'use server'` directive, not `'use client'` — it runs server-side when called from the form.
```

Commit and push:

```bash
git add -A
git commit -m "Lab 5 Parts D & E: filter widget, boundary documentation"
git push origin lab05/<your-name>-dashboard
```

Submit your branch link and `BOUNDARY-NOTES.md` in the shared class doc.

---

## Stretch — streaming with multiple Suspense boundaries

Right now the page waits for ALL data before rendering anything. With multiple Suspense boundaries, the shell ships immediately, and each section streams in independently.

### Step 1 — Wrap each slow section in Suspense

```jsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <main>
      <h1>Project tracker</h1>

      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      <div className="dashboard-grid">
        <Suspense fallback={<ActivityFeedSkeleton />}>
          <FilterToggle>
            <ActivityFeed />
          </FilterToggle>
        </Suspense>

        <Suspense fallback={<TeamListSkeleton />}>
          <TeamList />
        </Suspense>
      </div>

      <AddTaskForm />
    </main>
  );
}
```

### Step 2 — Extract the awaiting work into child Server Components

Now `Dashboard` itself doesn't `await` anything. The `await` lives in `<StatsRow />`, `<ActivityFeed />`, etc. Each one suspends inside its own boundary.

### Step 3 — Build the skeleton components

Three small Server Components that render the same shape as their real counterparts but with placeholder text. Bootstrap's `placeholder` class works.

### Step 4 — Verify

Open the page. You should see:

1. The page shell + skeletons appear instantly
2. The stats row fills in first (fastest query)
3. The activity feed and team list each fill in as their queries resolve

The Network tab shows the response streaming in chunks. If you watch the dev server logs, the three queries fire concurrently rather than serially.

---

## Hints if you get stuck

- **"Cannot use useState in a Server Component" error:** A component you wrote uses `useState` but doesn't have `'use client'` at the top. Add it, or refactor so the state lives in a Client Component child.
- **"Cannot pass a function as a prop from Server to Client" error:** You passed an inline event handler from a Server Component to a Client Component. Either move the handler into the Client Component or convert the function to a Server Action with `'use server'`.
- **Form submits but the dashboard doesn't update:** missing `revalidatePath` (or you're on RR v7, in which case the equivalent is the route's loader rerunning automatically after the action).
- **`useFormStatus` returns `null`:** the component using it is rendered outside a `<form>`. It must be a descendant of a form element, not the form itself.
- **Suspense fallback never disappears:** something in the suspending child is creating a new promise on every render. Move the data fetch into a Server Component that awaits it directly.
- **"Module not found: 'fs'" or 'crypto':** a server-only module was imported into a Client Component. Add a `'server-only'` import to the offending file to get a clearer error.

---

## Solution branch

The reference solution is at `solution/lab-05-dashboard`. The stretch solution with streaming is at `solution/lab-05-streaming`. Don't peek before you've finished your own.

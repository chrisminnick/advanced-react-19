import { getTaskCounts } from '@/lib/data';
import StubCard from './StubCard';

// This is a Server Component. Note the `async` keyword — Server Components can await.
// In Lab 5 you'll extend this page with:
//   - Three real stats cards (Open / In progress / Done)
//   - An activity feed
//   - A team list
//   - An add-task form (Client Component) with a Server Action
//   - A filter widget (Client Component) wrapping the activity feed
//   - (Stretch) Suspense boundaries for streaming
export default async function Dashboard() {
  const counts = await getTaskCounts();

  return (
    <main>
      <h1>Project tracker</h1>

      <section className="stats-row">
        {/* This is the example to copy. The other two stats cards go next to it. */}
        <StubCard label="Open" value={counts.open} accent="blue" />
        {/* TODO: <StatCard label="In progress" value={counts.inProgress} accent="amber" /> */}
        {/* TODO: <StatCard label="Done"        value={counts.done}       accent="green" /> */}
      </section>

      {/* TODO: dashboard-grid with <ActivityFeed /> and <TeamList /> */}
      {/* TODO: <AddTaskForm /> */}
    </main>
  );
}

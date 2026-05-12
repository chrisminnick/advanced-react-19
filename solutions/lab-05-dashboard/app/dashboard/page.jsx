import { getTaskCounts } from '@/lib/data';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import TeamList from './TeamList';
import FilterToggle from './FilterToggle';
import AddTaskForm from './AddTaskForm';

// Server Component (no 'use client'). Awaits the data layer directly.
//
// Note: this version waits for `getTaskCounts()` before rendering ANY part
// of the page. That's intentional for the regular Lab 5 — the streaming
// stretch (solution/lab-05-streaming) splits each section into its own
// Suspense boundary so the shell paints first.
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

      <AddTaskForm />

      <div className="dashboard-grid">
        <FilterToggle>
          <ActivityFeed />
        </FilterToggle>
        <TeamList />
      </div>
    </main>
  );
}

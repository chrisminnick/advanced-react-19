import { getTaskCounts } from '@/lib/data';
import StatCard from './StatCard';

// Pulled out of page.jsx so the await happens inside the Suspense boundary.
// This is the trick that makes streaming work: the slow work has to live
// inside the boundary, not above it.
export default async function StatsRow() {
  const counts = await getTaskCounts();
  return (
    <section className="stats-row">
      <StatCard label="Open" value={counts.open} accent="blue" />
      <StatCard label="In progress" value={counts.inProgress} accent="amber" />
      <StatCard label="Done" value={counts.done} accent="green" />
    </section>
  );
}

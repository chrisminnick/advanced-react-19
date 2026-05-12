import { Suspense } from 'react';
import StatsRow from './StatsRow';
import ActivityFeed from './ActivityFeed';
import TeamList from './TeamList';
import FilterToggle from './FilterToggle';
import AddTaskForm from './AddTaskForm';
import StatsRowSkeleton from './skeletons/StatsRowSkeleton';
import ActivityFeedSkeleton from './skeletons/ActivityFeedSkeleton';
import TeamListSkeleton from './skeletons/TeamListSkeleton';

// NOT async. The page itself does no awaiting now — each slow section
// awaits inside its own Suspense boundary, so the shell paints
// immediately and the sections stream in independently.
export default function Dashboard() {
  return (
    <main>
      <h1>Project tracker</h1>

      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      <AddTaskForm />

      <div className="dashboard-grid">
        <FilterToggle>
          <Suspense fallback={<ActivityFeedSkeleton />}>
            <ActivityFeed />
          </Suspense>
        </FilterToggle>

        <Suspense fallback={<TeamListSkeleton />}>
          <TeamList />
        </Suspense>
      </div>
    </main>
  );
}

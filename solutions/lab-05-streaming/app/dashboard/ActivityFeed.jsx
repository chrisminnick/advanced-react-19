import { getRecentActivity } from '@/lib/data';

// Server Component — `async` + direct data access. The HTML for the activity
// list is produced on the server; no client JS needed for it.
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

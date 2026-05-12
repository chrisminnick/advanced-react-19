export default function ActivityFeedSkeleton() {
  return (
    <section className="activity" aria-busy="true">
      <h2>Recent activity</h2>
      <ul>
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="skeleton-row">
            <span className="skeleton-block skeleton-line" style={{ width: `${50 + (i * 7) % 40}%` }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

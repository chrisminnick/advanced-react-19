export default function TeamListSkeleton() {
  return (
    <section className="team" aria-busy="true">
      <h2>Team</h2>
      <ul>
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="skeleton-row">
            <span className="avatar skeleton-block" aria-hidden="true">&nbsp;</span>
            <span className="member-name skeleton-block skeleton-line" style={{ width: '40%' }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

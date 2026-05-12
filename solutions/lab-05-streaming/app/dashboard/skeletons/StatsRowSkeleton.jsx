// Server Component skeleton — same shape as <StatsRow />, no awaits.
export default function StatsRowSkeleton() {
  return (
    <section className="stats-row" aria-busy="true">
      {['blue', 'amber', 'green'].map((accent) => (
        <article key={accent} className={`stat-card stat-card-skeleton ${accent}`}>
          <h3 className="stat-label skeleton-block skeleton-label">&nbsp;</h3>
          <p className="stat-value skeleton-block skeleton-number">&nbsp;</p>
        </article>
      ))}
    </section>
  );
}

// Server Component. No 'use client'. Ships zero JS to the browser — the
// numbers are baked into the HTML.
export default function StatCard({ label, value, accent }) {
  return (
    <article className={`stat-card ${accent}`}>
      <h3 className="stat-label">{label}</h3>
      <p className="stat-value">{value}</p>
    </article>
  );
}

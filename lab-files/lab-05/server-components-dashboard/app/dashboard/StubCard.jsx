// This is a Server Component — no 'use client' directive.
// Copy this shape for the three real stats cards in Lab 5 Part A.
// Rename it to `StatCard` when you do.
export default function StubCard({ label, value, accent }) {
  return (
    <article className={`stat-card ${accent}`}>
      <h3 className="stat-label">{label}</h3>
      <p className="stat-value">{value}</p>
    </article>
  );
}

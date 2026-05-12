// Sibling of page.js. Next.js shows this instantly while page.js's awaits
// resolve. No Suspense boundary in user code required — the framework
// wraps the page.js render in one automatically.
export default function Loading() {
  return (
    <div className="skeleton" aria-busy="true">
      <div className="skeleton-line skeleton-h1" />
      <div className="skeleton-line" style={{ width: '90%' }} />
      <div className="skeleton-line" style={{ width: '60%' }} />
    </div>
  );
}

'use client';

// error.js must be a Client Component — it owns interactive retry state.
// Wraps every route under app/blog/* and catches anything they throw.
export default function BlogError({ error, reset }) {
  return (
    <div className="error-panel" role="alert">
      <h2>Something went wrong in /blog</h2>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>Try again</button>
    </div>
  );
}

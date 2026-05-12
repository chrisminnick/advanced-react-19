// Fallback rendered by react-error-boundary when the feed query throws.
// `onRetry` is wired to QueryErrorResetBoundary's reset() in the parent —
// clicking the button clears the cached error and re-runs the query.
export default function ErrorPanel({ error, onRetry }) {
  return (
    <div role="alert" className="error-panel">
      <h2>Something went wrong loading the feed</h2>
      <p>{error?.message ?? 'Unknown error'}</p>
      <button type="button" onClick={onRetry}>Try again</button>
    </div>
  );
}

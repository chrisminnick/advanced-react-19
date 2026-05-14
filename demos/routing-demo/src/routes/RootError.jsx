import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

// One error boundary at the root catches everything thrown by any
// loader/action/element below it. v7's `useRouteError()` returns the
// thrown value; `isRouteErrorResponse` lets us distinguish HTTP-shaped
// errors (status + statusText) from arbitrary exceptions.
export default function RootError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="error">
        <h2>{error.status} {error.statusText}</h2>
        <p>{error.data ?? 'The route threw a response.'}</p>
        <p><Link to="/">Back home</Link></p>
      </main>
    );
  }

  // Custom errors with our own .status property
  const status = error?.status;
  const message = error?.message ?? String(error);
  return (
    <main className="error">
      <h2>{status ? `Error ${status}` : 'Something went wrong'}</h2>
      <p>{message}</p>
      <p><Link to="/">Back home</Link></p>
    </main>
  );
}

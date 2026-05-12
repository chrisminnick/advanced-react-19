import Link from 'next/link';

// Rendered when a route under /blog/* calls notFound(). The matching scope
// is "everything under app/blog/" — Next's nearest-not-found resolution
// works just like nearest-error.
export default function BlogNotFound() {
  return (
    <div className="error-panel">
      <h2>404 — post not found</h2>
      <p>That slug doesn't exist (yet).</p>
      <Link href="/blog">Back to the blog index</Link>
    </div>
  );
}

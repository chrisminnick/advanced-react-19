import Link from 'next/link';

// Nested layout. Renders for every route under /blog/*. The root layout
// still wraps this one; Next.js composes them outside-in.
export default function BlogLayout({ children }) {
  return (
    <div className="blog-shell">
      <aside className="blog-sidebar">
        <h3>Posts</h3>
        <ul>
          <li><Link href="/blog">Index</Link></li>
          <li><Link href="/blog/hello-world">Hello world</Link></li>
          <li><Link href="/blog/server-components">Server Components 101</Link></li>
          <li><Link href="/blog/streaming">Streaming demo</Link></li>
        </ul>
        <p className="muted">
          This sidebar is in <code>app/blog/layout.js</code> — it persists
          across every <code>/blog/*</code> navigation.
        </p>
      </aside>
      <section className="blog-content">{children}</section>
    </div>
  );
}

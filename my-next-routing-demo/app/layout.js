import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'my-next-routing-demo',
  description: 'Module 3 demo — App Router routing primitives.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="shell-header">
          <strong>Routing primitives</strong>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/blog">Blog (nested)</Link>
            <Link href="/blog/streaming">Streaming</Link>
            <Link href="/blog/oops">Errors</Link>
          </nav>
        </header>
        <main className="shell-main">{children}</main>
        <footer className="shell-footer">
          <small>Next.js 15 / React 19 — layouts, dynamic segments, loading.js, error.js</small>
        </footer>
      </body>
    </html>
  );
}

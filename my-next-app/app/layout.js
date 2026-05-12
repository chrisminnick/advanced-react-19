import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'my-next-app (Next 15 demo)',
  description: 'Module 3 demo — Next.js 15 App Router basics.',
};

// Root layout. Renders once for the whole app and wraps every page.
// The <nav> here doesn't unmount as you click between routes — Next.js
// keeps the layout mounted and only swaps the matching segment.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="shell-header">
          <strong>my-next-app</strong>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </header>
        <main className="shell-main">{children}</main>
        <footer className="shell-footer">
          <small>Next.js 15 / React 19 — App Router demo</small>
        </footer>
      </body>
    </html>
  );
}

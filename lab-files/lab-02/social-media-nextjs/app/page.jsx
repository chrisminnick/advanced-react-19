import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>social-media-nextjs</h1>
      <p>
        This is the Next.js 15 / App Router parallel client for{' '}
        <strong>Lab 2 of the Advanced React course</strong>. It pairs with{' '}
        <code>social-media-rr-v7</code> — same backend, different framework.
      </p>

      <h2>What you&apos;ll add in Lab 2 (Part B)</h2>
      <ul className="lab-list">
        <li><code>app/(auth)/login/page.jsx</code> — Login form + Server Action</li>
        <li><code>app/(auth)/signup/page.jsx</code> — Signup form + Server Action</li>
        <li><code>app/logout/route.js</code> — POST handler that clears the cookie</li>
        <li><code>app/home/page.jsx</code> — Protected feed (Server Component)</li>
        <li><code>middleware.js</code> at the project root — auth gate for <code>/home</code></li>
      </ul>

      <p>
        Until then, this is the only working route (<Link href="/">/</Link>).
      </p>

      <div className="callout">
        <strong>Backend not running?</strong> Make sure <code>../social-media/server</code>{' '}
        is started — the labs depend on it.
      </div>
    </main>
  );
}

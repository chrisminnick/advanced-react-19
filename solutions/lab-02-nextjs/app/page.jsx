import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>social-media-nextjs (Lab 2 solution)</h1>
      <p>
        This branch is the reference solution for Lab 2 Part B. The four routes
        the lab asks you to implement are now live, plus the auth-guard
        middleware.
      </p>

      <ul className="lab-list">
        <li><Link href="/login">/login</Link></li>
        <li><Link href="/signup">/signup</Link></li>
        <li><Link href="/home">/home</Link> (protected — middleware redirects to /login if signed out)</li>
        <li>POST <code>/logout</code> (route handler — POST it from a form)</li>
      </ul>

      <div className="callout">
        <strong>Backend not running?</strong> Make sure
        <code> social-media/server </code> is started — this client depends on it.
      </div>
    </main>
  );
}

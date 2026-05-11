import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'Advanced React Lab Starter — RR v7 framework mode' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7</h1>
      <p>
        This is the starter project for the React Router v7 client used by Labs 2 through 7
        of the Advanced React course.
      </p>

      <h2>Routes you&apos;ll add</h2>
      <ul className="lab-list">
        <li><strong>Lab 2:</strong> /login, /signup, /logout, /home (protected)</li>
        <li><strong>Lab 3:</strong> refactor state management (no new routes)</li>
        <li><strong>Lab 4:</strong> migrate to TanStack Query (no new routes)</li>
        <li><strong>Lab 6:</strong> profile and optimize (no new routes)</li>
        <li><strong>Lab 7:</strong> add Vitest + RTL + MSW (no new routes)</li>
      </ul>

      <p>
        Until Lab 2 wires them up, the only working route is this one (<Link to="/">/</Link>).
      </p>

      <div className="callout">
        <strong>Backend not running?</strong> Make sure <code>../social-media/server</code>{' '}
        is started — the labs depend on it.
      </div>
    </main>
  );
}

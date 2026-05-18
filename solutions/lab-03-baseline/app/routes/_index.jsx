import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 3 baseline)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 3 baseline)</h1>
      <p>
        Reference snapshot of the Lab 3 starting state &mdash; same content as <code>lab-files/lab-03/</code>. The bloated <code>AppContext</code>, prop drilling, and server-state-in-client-store are all here, ready to be refactored.
      </p>

      <ul className="lab-list">
        <li><Link to="/login">/login</Link></li>
        <li><Link to="/signup">/signup</Link></li>
        <li><Link to="/home">/home</Link> (protected — redirects to /login if signed out)</li>
        <li><Link to="/logout">/logout</Link></li>
      </ul>

      <div className="callout">
        <strong>Backend not running?</strong> Make sure the
        <code> server </code> folder is started — this client depends on it.
      </div>
    </main>
  );
}

import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 3 solution &mdash; Jotai)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 3 solution &mdash; Jotai)</h1>
      <p>
        Reference solution for Lab 3. The bloated AppContext is replaced by a graph of atoms (primitives + derived atoms + write-only action atoms), with <code>atomWithStorage</code> for the theme.
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

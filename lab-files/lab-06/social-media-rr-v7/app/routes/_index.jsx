import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 6 starter)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 6 starter)</h1>
      <p>
        Picks up from the Lab 4 TanStack Query solution and adds the deliberate performance problems you&rsquo;ll diagnose and fix in Lab 6 &mdash; keystroke re-renders, an expensive trending-tag recompute, an eagerly-imported heavy editor.
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

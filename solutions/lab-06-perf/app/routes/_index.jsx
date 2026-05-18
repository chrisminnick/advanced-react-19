import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 6 solution &mdash; Profile and Optimize)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 6 solution &mdash; Profile and Optimize)</h1>
      <p>
        Reference solution for Lab 6. URL-debounced search, memoized trending calc, lazy-loaded composer, React Compiler enabled, plus the virtualization stretch. Profile <Link to="/home">/home</Link> and compare to <code>lab-06-baseline</code>.
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

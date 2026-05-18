import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 8 exemplar &mdash; Reactions feature)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 8 exemplar &mdash; Reactions feature)</h1>
      <p>
        Reference exemplar for Lab 8 (Option B from the backlog). Adds three optimistic-toggle reactions per post (heart, laugh, surprise) plus a small behavior test. Open <Link to="/home">/home</Link> to try them.
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

import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 4 stretch &mdash; infinite scroll)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 4 stretch &mdash; infinite scroll)</h1>
      <p>
        Reference solution for the Lab 4 stretch task. Adds cursor-based pagination on the backend, a <code>useInfiniteQuery</code> hook, and an IntersectionObserver-based &ldquo;load more&rdquo; trigger at the bottom of the feed.
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

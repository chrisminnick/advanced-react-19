import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'social-media-rr-v7 (Lab 3 starter)' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 3 starter)</h1>
      <p>
        Picks up from the Lab 2 solution and adds the deliberate &ldquo;bloated AppContext&rdquo; + prop-drilling mess you&rsquo;ll refactor in Lab 3. Open <Link to="/home">/home</Link> to see it &mdash; every theme toggle or sidebar click re-renders the whole feed.
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

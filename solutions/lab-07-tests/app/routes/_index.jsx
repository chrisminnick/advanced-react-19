import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'social-media-rr-v7' },
    { name: 'description', content: 'Advanced React Lab Solution — RR v7 framework mode' },
  ];
}

export default function Index() {
  return (
    <main>
      <h1>social-media-rr-v7 (Lab 2 solution)</h1>
      <p>
        This branch is the reference solution for Lab 2 Part A. The four routes
        the lab asks you to implement are now live.
      </p>

      <ul className="lab-list">
        <li><Link to="/login">/login</Link></li>
        <li><Link to="/signup">/signup</Link></li>
        <li><Link to="/home">/home</Link> (protected — redirects to /login if signed out)</li>
        <li><Link to="/logout">/logout</Link></li>
      </ul>

      <div className="callout">
        <strong>Backend not running?</strong> Make sure
        <code> social-media/server </code> is started — this client depends on it.
      </div>
    </main>
  );
}

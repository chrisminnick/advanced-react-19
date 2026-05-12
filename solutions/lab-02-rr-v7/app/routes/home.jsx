import { Link, redirect, useLoaderData } from 'react-router';
import * as api from '../lib/api.server.js';

export function meta() {
  return [{ title: 'Home — recent posts' }];
}

export async function loader({ request }) {
  // Auth gate: ask the backend who we are. If it 401s, we're not signed in.
  let me;
  try {
    const { data } = await api.getMe(request);
    me = data;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      const next = encodeURIComponent(new URL(request.url).pathname);
      throw redirect(`/login?next=${next}`);
    }
    throw err;
  }

  // Fetch posts using the same forwarded cookie.
  const { data: posts } = await api.listPosts(request);
  return { me, posts };
}

export default function HomePage() {
  const { me, posts } = useLoaderData();

  return (
    <main className="home-page">
      <header className="home-header">
        <h1>Recent posts</h1>
        <div className="home-user">
          <span>Signed in as <strong>{me.name}</strong></span>
          <Link to="/logout">Sign out</Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <p>No posts yet. Be the first.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.id} className="post">
              <h2>{p.title || '(untitled)'}</h2>
              <p>{p.body}</p>
              <small>
                by {p.author} ·{' '}
                {p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as api from '@/app/lib/api.server';

export const metadata = { title: 'Home — recent posts' };

// Server Component. The middleware ensures we have a session cookie by the
// time this runs, but we still call /api/me so we know who "we" are and
// to handle the edge case of a stale or invalidated cookie.
export default async function HomePage() {
  let me;
  try {
    const { data } = await api.getMe();
    me = data;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      redirect('/login?next=/home');
    }
    throw err;
  }

  const { data: posts } = await api.listPosts();

  return (
    <main className="home-page">
      <header className="home-header">
        <h1>Recent posts</h1>
        <div className="home-user">
          <span>Signed in as <strong>{me.name}</strong></span>
          <form action="/logout" method="post" style={{ display: 'inline' }}>
            <button type="submit" className="link-button">Sign out</button>
          </form>
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

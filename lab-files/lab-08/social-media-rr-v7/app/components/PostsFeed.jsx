import PostActions from './PostActions.jsx';

// Same as the lab-03-zustand version, plus support for the optimistic
// `sending` flag. Posts with sending: true render dimmer + italic until the
// server confirms (the invalidate-on-settled triggers a refetch that
// replaces the stub with the real post).
export default function PostsFeed({ posts }) {
  if (!posts.length) {
    return <p className="empty">No posts yet. Be the first.</p>;
  }
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li
          key={p.id}
          className={`post${p.sending ? ' post-sending' : ''}`}
          aria-busy={p.sending || undefined}
        >
          <h2>{p.title || '(untitled)'}</h2>
          <p>{p.body}</p>
          <small>
            by {p.author} ·{' '}
            {p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}
            {p.sending && ' · sending…'}
          </small>
          {!p.sending && <PostActions post={p} />}
        </li>
      ))}
    </ul>
  );
}

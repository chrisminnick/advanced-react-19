import PostActions from './PostActions.jsx';
import ReactionBar from './ReactionBar.jsx';

// Same shape as solution/lab-04-tanstack-query, plus a <ReactionBar /> on
// each post. ReactionBar reads from post.reactions; the shape is provided
// by the backend per `lab08-spec.md`.
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
          {!p.sending && (
            <>
              <ReactionBar post={p} />
              <PostActions post={p} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

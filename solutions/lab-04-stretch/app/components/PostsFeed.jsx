import PostActions from './PostActions.jsx';

// No more `currentUser` prop drill. PostActions reads what it needs from the
// user store directly.
export default function PostsFeed({ posts }) {
  if (!posts.length) {
    return <p className="empty">No posts yet. Be the first.</p>;
  }
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.id} className="post">
          <h2>{p.title || '(untitled)'}</h2>
          <p>{p.body}</p>
          <small>
            by {p.author} ·{' '}
            {p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}
          </small>
          <PostActions post={p} />
        </li>
      ))}
    </ul>
  );
}

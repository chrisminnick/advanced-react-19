import PostActions from './PostActions.jsx';

// PROP DRILLING.
//
// PostsFeed itself never reads `currentUser`. It just forwards it down to
// PostActions so PostActions can show "Edit" / "Delete" only on posts owned
// by the current user.
//
// Lab 3 fix: PostActions reads currentUser from the store directly. Drop the
// prop here entirely.
export default function PostsFeed({ posts, currentUser }) {
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
          <PostActions post={p} currentUser={currentUser} />
        </li>
      ))}
    </ul>
  );
}

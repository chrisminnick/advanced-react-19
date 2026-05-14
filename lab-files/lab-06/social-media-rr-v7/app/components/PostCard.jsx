import PostActions from './PostActions.jsx';

// Extracted from PostsFeed so the React Profiler shows per-card render
// counts clearly. Receives the post; reads the current user via PostActions.
export default function PostCard({ post }) {
  return (
    <li
      className={`post${post.sending ? ' post-sending' : ''}`}
      aria-busy={post.sending || undefined}
    >
      <h2>{post.title || '(untitled)'}</h2>
      <p>{post.body}</p>
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>
      )}
      <small>
        by {post.author} ·{' '}
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
        {post.sending && ' · sending…'}
      </small>
      {!post.sending && <PostActions post={post} />}
    </li>
  );
}

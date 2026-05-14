import PostCard from './PostCard.jsx';

// Filters posts by the search string the parent passes in. Re-renders
// (and re-runs the filter) on every keystroke, even when the visible
// posts don't change.
//
// Lab 6 Optimization A fixes this by moving search to URL params and
// only invalidating the queryKey when the search actually changes.
export default function PostsFeed({ posts, search = '' }) {
  const q = search.trim().toLowerCase();
  const visible = q
    ? posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.body?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    : posts;

  if (!visible.length) {
    return <p className="empty">No posts match "{search}".</p>;
  }
  return (
    <ul className="post-list">
      {visible.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </ul>
  );
}

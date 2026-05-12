// Recomputes the tag-frequency analysis on EVERY render.
//
// Two reasons the React Compiler can't save you here:
//   1. The expensive function literal is recreated each render (this would
//      be fine — Compiler can pull it out — but…)
//   2. `posts` is a new array reference each parent render even when the
//      contents haven't changed (e.g., a parent re-render driven by an
//      unrelated state change). The Compiler bails out and recomputes.
//
// Lab 6 Optimization B fixes this with a manual useMemo + (where needed)
// stable references upstream.
export default function TrendingSidebar({ posts }) {
  // ⚠ Expensive: O(posts × tags). Repeats on every render.
  const trending = computeTrending(posts);

  return (
    <aside className="trending">
      <h2>Trending tags</h2>
      <ol>
        {trending.map(([tag, count]) => (
          <li key={tag}>
            <span className="tag">#{tag}</span> <span className="count">{count}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function computeTrending(posts) {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
}

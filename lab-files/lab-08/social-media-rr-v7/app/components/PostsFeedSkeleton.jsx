// CSS-only loading skeleton. Three placeholder cards with shimmering blocks
// for title, body, and byline. The .skeleton-block class lives in app.css.
export default function PostsFeedSkeleton() {
  return (
    <ul className="post-list" aria-busy="true" aria-label="Loading posts">
      {[0, 1, 2].map((i) => (
        <li key={i} className="post post-skeleton">
          <div className="skeleton-block skeleton-title" />
          <div className="skeleton-block skeleton-body" />
          <div className="skeleton-block skeleton-meta" />
        </li>
      ))}
    </ul>
  );
}

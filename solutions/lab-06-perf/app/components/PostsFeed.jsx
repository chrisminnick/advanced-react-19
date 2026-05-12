import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import PostCard from './PostCard.jsx';

// Stretch: virtualized post list. Only the visible cards (plus a 5-card
// overscan for smooth scrolling) actually render and live in the DOM.
//
// Two important details:
//   1. The scroll container needs an explicit max-height so it shrinks
//      when there are few posts.
//   2. `measureElement` is the safe path for variable-height cards.
//      Without it, virtual heights drift as users expand/collapse content.
//
// Note: PostCard returns its own <li>; we wrap each one in a positioned
// <li> spacer for the virtualizer (the wrapper sits inside our <ul>).
// Browsers tolerate li>li, but React's lint plugin doesn't love it —
// rendered with role="presentation" so semantics stay clean.
export default function PostsFeed({ posts }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  if (!posts.length) {
    return <p className="empty">No posts to show.</p>;
  }

  return (
    <div
      ref={parentRef}
      className="virtual-feed"
      style={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((vi) => (
          <div
            key={vi.key}
            data-index={vi.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vi.start}px)`,
            }}
          >
            <ul className="post-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              <PostCard post={posts[vi.index]} />
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

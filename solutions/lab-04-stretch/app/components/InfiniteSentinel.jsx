import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

// Renders a small sentinel that triggers `onVisible` when it scrolls into
// view. Place at the bottom of the feed; pair with hasNextPage from
// useInfiniteQuery so we don't keep firing past the end.
export default function InfiniteSentinel({ onVisible, disabled }) {
  const { ref, inView } = useInView({
    rootMargin: '300px 0px',  // pre-fetch a little early
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && !disabled) onVisible();
  }, [inView, disabled, onVisible]);

  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />;
}

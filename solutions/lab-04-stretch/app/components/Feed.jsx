import { useCallback } from 'react';
import PostsFeed from './PostsFeed.jsx';
import PostsFeedSkeleton from './PostsFeedSkeleton.jsx';
import InfiniteSentinel from './InfiniteSentinel.jsx';
import { usePostsInfinite } from '../hooks/usePostsInfinite.js';

export default function Feed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfinite();

  const posts = data.pages.flatMap((p) => p.items);
  const onVisible = useCallback(() => {
    if (!isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage]);

  return (
    <>
      <PostsFeed posts={posts} />
      {hasNextPage && (
        <>
          <InfiniteSentinel onVisible={onVisible} disabled={isFetchingNextPage} />
          {isFetchingNextPage && <PostsFeedSkeleton />}
        </>
      )}
      {!hasNextPage && posts.length > 0 && (
        <p className="end-of-feed">You're all caught up.</p>
      )}
    </>
  );
}

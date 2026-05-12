import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

const PAGE_SIZE = 10;

// useSuspenseInfiniteQuery (added in TanStack Query v5) suspends on the
// initial fetch the same way useSuspenseQuery does. Subsequent
// fetchNextPage() calls are NOT suspending — the parent shows
// `isFetchingNextPage` UI instead.
export function usePostsInfinite() {
  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.posts.list({ infinite: true }),
    queryFn: ({ pageParam }) =>
      api.listPosts({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export const POSTS_INFINITE_KEY = queryKeys.posts.list({ infinite: true });

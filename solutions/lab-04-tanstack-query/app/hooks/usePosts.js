import { useSuspenseQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

// useSuspenseQuery: the home page is meaningless without posts. Suspending
// is more honest than rendering a loading state — and it composes with the
// Suspense boundary in <Feed /> so we get one consistent skeleton.
export function usePosts() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.posts.list(),
    queryFn: () => api.listPosts(),
  });

  return data;
}

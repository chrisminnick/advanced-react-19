import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

// Search-aware posts query. The queryKey includes the search string, so
// changing the search produces a new cache entry — old results stay
// available if the user clears the search and re-types it.
//
// In a real app this would hit a /api/posts?q= endpoint. Here we still
// fetch the full list and filter client-side, but we control the
// filtering ourselves so the parent doesn't re-render the feed on every
// keystroke (the keystroke updates the URL, not parent state).
export function usePostsSearch(search) {
  const q = (search ?? '').trim().toLowerCase();
  return useQuery({
    queryKey: queryKeys.posts.list({ q }),
    queryFn: async () => {
      const all = await api.listPosts();
      if (!q) return all;
      return all.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.body?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    },
    // 30s match the global default — keep it explicit so future readers
    // see what we're relying on.
    staleTime: 30 * 1000,
  });
}

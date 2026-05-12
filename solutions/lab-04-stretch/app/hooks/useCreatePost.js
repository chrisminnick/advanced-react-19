import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';
import { POSTS_INFINITE_KEY } from './usePostsInfinite.js';

// Create-post mutation, cache shape: { pages: [{ items, nextCursor }, ...] }
// The optimistic insert goes at the front of pages[0].items so the new post
// appears at the top of the feed.
export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (newPost) => api.createPost(newPost),

    onMutate: async (newPost) => {
      const key = POSTS_INFINITE_KEY;
      await qc.cancelQueries({ queryKey: key });
      const snapshot = qc.getQueryData(key);

      qc.setQueryData(key, (old) => {
        if (!old) return old;
        const optimistic = {
          id: `optimistic-${Date.now()}`,
          ...newPost,
          author: '(you)',
          createdAt: new Date().toISOString(),
          sending: true,
        };
        const [first, ...rest] = old.pages;
        const newFirst = first
          ? { ...first, items: [optimistic, ...first.items] }
          : { items: [optimistic], nextCursor: null };
        return { ...old, pages: [newFirst, ...rest] };
      });

      return { snapshot, key };
    },

    onError: (err, newPost, ctx) => {
      if (ctx?.snapshot !== undefined) {
        qc.setQueryData(ctx.key, ctx.snapshot);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: POSTS_INFINITE_KEY });
    },
  });
}

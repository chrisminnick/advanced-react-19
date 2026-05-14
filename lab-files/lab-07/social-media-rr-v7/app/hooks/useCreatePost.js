import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

// Create-post mutation with optimistic update.
//
// The four hooks of an optimistic mutation:
//   onMutate    — cancel in-flight reads, snapshot, write the optimistic value
//   onError     — roll back to the snapshot
//   onSettled   — invalidate so the server's truth replaces our guess
//   (no onSuccess — onSettled covers both branches here)
export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (newPost) => api.createPost(newPost),

    onMutate: async (newPost) => {
      const key = queryKeys.posts.list();

      // Cancel any in-flight refetch so it doesn't overwrite our optimistic
      // value when it lands.
      await qc.cancelQueries({ queryKey: key });

      // Snapshot for rollback.
      const snapshot = qc.getQueryData(key);

      // Optimistic insert at the top of the list.
      qc.setQueryData(key, (old = []) => [
        {
          id: `optimistic-${Date.now()}`,
          ...newPost,
          author: '(you)',
          createdAt: new Date().toISOString(),
          sending: true,
        },
        ...old,
      ]);

      return { snapshot, key };
    },

    onError: (err, newPost, ctx) => {
      if (ctx?.snapshot !== undefined) {
        qc.setQueryData(ctx.key, ctx.snapshot);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.list() });
    },
  });
}

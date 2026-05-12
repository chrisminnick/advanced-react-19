import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

// Toggle a single reaction (add or remove based on `desired`).
//
// Optimistic update writes to the posts list cache directly. We use
// `queryClient.setQueriesData` (note plural) with a partial filter so
// the same post in different cached lists (e.g., the search-filtered
// list and the unfiltered list) all reflect the toggle. This was the
// first-pass AI bug — see lab08-self-review.md issue #2.
export function useToggleReaction(postId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ type, desired }) =>
      desired ? api.addReaction(postId, type) : api.removeReaction(postId, type),

    onMutate: async ({ type, desired }) => {
      // Cancel in-flight reads on any list.
      await qc.cancelQueries({ queryKey: queryKeys.posts.all });

      const filter = { queryKey: queryKeys.posts.all };
      const snapshot = qc.getQueriesData(filter);

      qc.setQueriesData(filter, (old) => {
        if (!old) return old;
        // Lists are arrays of posts.
        if (Array.isArray(old)) {
          return old.map((p) => (p.id === postId ? withToggle(p, type, desired) : p));
        }
        // Detail entries are single posts.
        if (old.id === postId) return withToggle(old, type, desired);
        return old;
      });

      return { snapshot, filter };
    },

    onError: (err, vars, ctx) => {
      if (!ctx) return;
      for (const [key, value] of ctx.snapshot) {
        qc.setQueryData(key, value);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

function withToggle(post, type, desired) {
  const slot = post.reactions?.[type] ?? { count: 0, mine: false };
  if (slot.mine === desired) return post;  // no-op
  return {
    ...post,
    reactions: {
      ...post.reactions,
      [type]: {
        count: slot.count + (desired ? 1 : -1),
        mine: desired,
      },
    },
  };
}

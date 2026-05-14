// Single source of truth for query keys. Centralizing them prevents the
// "you invalidated 'posts' but the query was registered as ['posts','list']"
// bug class. Always invalidate via the factory.
export const queryKeys = {
  posts: {
    all: ['posts'],
    list: (filters = {}) => ['posts', 'list', filters],
    detail: (id) => ['posts', 'detail', id],
  },
  user: {
    me: ['user', 'me'],
  },
};

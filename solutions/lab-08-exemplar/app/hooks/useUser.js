import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';
import { queryKeys } from '../lib/queryKeys.js';

// Plain useQuery (not useSuspenseQuery) because the header is allowed to
// briefly say "guest" while we hydrate. The home loader has already done
// the auth gate, so a 401 here is exceptional (cookie just expired).
//
// 5-minute staleTime — the user's display name doesn't change minute to
// minute, and revalidating on focus is wasteful here.
export function useUser() {
  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.user.me,
    queryFn: () => api.getMe(),
    staleTime: 5 * 60 * 1000,
  });

  return { user: data ?? null, isPending, error };
}

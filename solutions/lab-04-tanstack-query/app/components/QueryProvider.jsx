import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '../lib/queryClient.js';

// Wraps a route subtree with TanStack Query's provider + DevTools.
// In dev, hit the floating React Query badge in the bottom-right corner to
// inspect cache, query status, and mutation history.
//
// getQueryClient() returns a fresh client on the server (one per request)
// and the stable browser singleton on the client — see queryClient.js.
export default function QueryProvider({ children }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

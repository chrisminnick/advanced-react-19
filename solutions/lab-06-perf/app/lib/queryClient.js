import { QueryClient } from '@tanstack/react-query';

// One QueryClient per browser session. Defaults tuned for the social-media
// app's traffic shape:
//   - 30s staleTime so back/forward navigation hits cache
//   - 2 retries on read errors (network blip recovery)
//   - refetchOnWindowFocus catches "what did I miss?" after tab-switching
//   - mutations don't auto-retry — most write errors are user errors
//     (validation, conflict) and silent retry would mask them.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});

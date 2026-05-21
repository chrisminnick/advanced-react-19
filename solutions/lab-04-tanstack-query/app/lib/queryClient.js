import { QueryClient, isServer } from '@tanstack/react-query';

// QueryClient factory. Defaults tuned for the social-media app's traffic shape:
//   - 30s staleTime so back/forward navigation hits cache (and so the client
//     doesn't immediately refetch data it just hydrated from the server)
//   - 2 retries on read errors (network blip recovery)
//   - refetchOnWindowFocus catches "what did I miss?" after tab-switching
//   - mutations don't auto-retry — most write errors are user errors
//     (validation, conflict) and silent retry would mask them.
export function makeQueryClient() {
  return new QueryClient({
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
}

// A module-level singleton is wrong for SSR: on the server one client would
// be shared across every concurrent request, leaking one user's cache (and
// session-scoped data) into another user's render.
//
// So: a fresh client per request on the server, and a stable singleton in
// the browser (one per tab, created lazily).
let browserQueryClient;

export function getQueryClient() {
  if (isServer) return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

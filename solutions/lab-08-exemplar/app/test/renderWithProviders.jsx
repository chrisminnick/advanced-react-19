import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

// Test render helper. Each call gets a fresh QueryClient so cache state
// from one test can't leak into the next. retry: false because we don't
// want auto-retries to swallow our 401s and 500s in tests; gcTime: 0 so
// the cache cleans up immediately when no observer references it.
//
// Pass `route` to start the MemoryRouter at a specific URL.
// Pass `withRouter: false` for pure-presentation components that render
// no <Link>s.
export function renderWithProviders(
  ui,
  { route = '/', withRouter = true, queryClient } = {}
) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

  function Wrapper({ children }) {
    const inner = (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    return withRouter ? (
      <MemoryRouter initialEntries={[route]}>{inner}</MemoryRouter>
    ) : (
      inner
    );
  }

  return { ...render(ui, { wrapper: Wrapper }), queryClient: client };
}

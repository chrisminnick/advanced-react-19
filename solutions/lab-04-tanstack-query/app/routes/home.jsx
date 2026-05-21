import { Suspense } from 'react';
import { redirect, useLoaderData } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import {
  dehydrate,
  HydrationBoundary,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import * as api from '../lib/api.server.js';
import { makeQueryClient } from '../lib/queryClient.js';
import { queryKeys } from '../lib/queryKeys.js';
import QueryProvider from '../components/QueryProvider.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import NewPostForm from '../components/NewPostForm.jsx';
import PostComposer from '../components/PostComposer.jsx';
import Feed from '../components/Feed.jsx';
import PostsFeedSkeleton from '../components/PostsFeedSkeleton.jsx';
import ErrorPanel from '../components/ErrorPanel.jsx';

export function meta() {
  return [{ title: 'Home — recent posts' }];
}

// The loader does two things, both on the server:
//
//   1. Auth gate — getMe tells us whether the user may be here at all.
//   2. Prefetch the posts list into a throwaway QueryClient and dehydrate
//      it. The dehydrated cache rides down with the loader data and is
//      replayed into the browser's QueryClient by <HydrationBoundary>.
//
// Why prefetch instead of letting the client fetch? <Feed /> uses
// useSuspenseQuery. Without server data it suspends the SSR stream; the
// browser-only api.js fetch can't satisfy it, so the render hangs until
// React Router aborts the stream ("the render was aborted by the server").
// Prefetching means useSuspenseQuery finds the data already in cache during
// SSR — it resolves synchronously, the posts render server-side, and the
// client hydrates without an extra round-trip.
export async function loader({ request }) {
  try {
    await api.getMe(request);
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      const next = encodeURIComponent(new URL(request.url).pathname);
      throw redirect(`/login?next=${next}`);
    }
    throw err;
  }

  // Throwaway client: its only job is to collect the prefetched data so we
  // can dehydrate() it. The component subtree gets its own client.
  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    // Must be byte-for-byte the key usePosts() uses, or the client won't
    // find the hydrated entry and will refetch.
    queryKey: queryKeys.posts.list(),
    // api.server.js forwards the request's Cookie header and returns
    // { data, response } — usePosts expects the bare posts array.
    queryFn: async () => {
      const { data } = await api.listPosts(request);
      return data;
    },
  });

  return { dehydratedState: dehydrate(queryClient) };
}

export default function HomePage() {
  const { dehydratedState } = useLoaderData();
  return (
    <QueryProvider>
      {/* Replays the server-prefetched cache into the browser QueryClient.
          Must sit inside QueryProvider (it needs the client from context)
          and above any component that reads the hydrated queries. */}
      <HydrationBoundary state={dehydratedState}>
        <div className="home-shell">
          <Header />
          <Sidebar />
          <main className="home-page">
            <NewPostForm />
            <PostComposer />
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <ErrorPanel error={error} onRetry={resetErrorBoundary} />
                  )}
                >
                  <Suspense fallback={<PostsFeedSkeleton />}>
                    <Feed />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </main>
        </div>
      </HydrationBoundary>
    </QueryProvider>
  );
}

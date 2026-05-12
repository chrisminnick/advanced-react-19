import { Suspense, useState } from 'react';
import { redirect, useSearchParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import * as api from '../lib/api.server.js';
import QueryProvider from '../components/QueryProvider.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import LazyComposer from '../components/LazyComposer.jsx';
import SearchInput from '../components/SearchInput.jsx';
import PostsFeed from '../components/PostsFeed.jsx';
import TrendingSidebar from '../components/TrendingSidebar.jsx';
import PostsFeedSkeleton from '../components/PostsFeedSkeleton.jsx';
import ErrorPanel from '../components/ErrorPanel.jsx';
import { usePostsSearch } from '../hooks/usePostsSearch.js';

export function meta() {
  return [{ title: 'Home — recent posts' }];
}

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
  return null;
}

export default function HomePage() {
  return (
    <QueryProvider>
      <HomeBody />
    </QueryProvider>
  );
}

function HomeBody() {
  // Search lives in the URL — read by usePostsSearch and SearchInput,
  // written (debounced) by SearchInput. HomeBody no longer holds search
  // state, so typing doesn't trigger a re-render here.
  const [params] = useSearchParams();
  const search = params.get('q') ?? '';
  const { data: posts = [] } = usePostsSearch(search);

  // Composer state stays local — it's pure UI, no benefit to URL-syncing.
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="home-shell">
      <Header />
      <Sidebar />
      <main className="home-page">
        <SearchInput />
        <button
          type="button"
          className="open-composer"
          onClick={() => setShowComposer(true)}
        >
          New post
        </button>
        <LazyComposer open={showComposer} onClose={() => setShowComposer(false)} />
        <div className="home-grid">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <ErrorPanel error={error} onRetry={resetErrorBoundary} />
                )}
              >
                <Suspense fallback={<PostsFeedSkeleton />}>
                  <PostsFeed posts={posts} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
          <TrendingSidebar posts={posts} />
        </div>
      </main>
    </div>
  );
}

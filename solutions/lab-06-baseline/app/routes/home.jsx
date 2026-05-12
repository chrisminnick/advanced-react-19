import { Suspense, useState } from 'react';
import { redirect } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';
import * as api from '../lib/api.server.js';
import QueryProvider from '../components/QueryProvider.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Composer from '../components/Composer.jsx';
import SearchInput from '../components/SearchInput.jsx';
import PostsFeed from '../components/PostsFeed.jsx';
import TrendingSidebar from '../components/TrendingSidebar.jsx';
import PostsFeedSkeleton from '../components/PostsFeedSkeleton.jsx';
import ErrorPanel from '../components/ErrorPanel.jsx';
import { queryKeys } from '../lib/queryKeys.js';
import api2 from '../lib/api.js';

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

// Search state lives in the parent, so EVERY keystroke re-renders the
// whole subtree, including PostsFeed and TrendingSidebar. That's the
// performance smell Lab 6 Opt A targets.
function HomeBody() {
  const [search, setSearch] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: queryKeys.posts.list(),
    queryFn: () => api2.listPosts(),
  });

  return (
    <div className="home-shell">
      <Header />
      <Sidebar />
      <main className="home-page">
        <SearchInput value={search} onChange={setSearch} />
        <button
          type="button"
          className="open-composer"
          onClick={() => setShowComposer(true)}
        >
          New post
        </button>
        {showComposer && (
          <Composer onClose={() => setShowComposer(false)} />
        )}
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
                  <PostsFeed posts={posts} search={search} />
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

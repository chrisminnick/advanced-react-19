import { Suspense } from 'react';
import { redirect } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import * as api from '../lib/api.server.js';
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

// Auth gate only. Posts moved to TanStack Query on the client. The loader
// no longer needs to fetch the posts list — getMe is enough to know whether
// the user can be here. (We could even drop the `me` field from the loader
// return now, but keeping it gives the client one less round-trip on first
// paint.)
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
    </QueryProvider>
  );
}

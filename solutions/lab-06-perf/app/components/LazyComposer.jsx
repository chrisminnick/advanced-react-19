import { lazy, Suspense } from 'react';

// Optimization C: lazy-load the composer + its heavy dictionary import.
// Bundled as a separate chunk; only fetched when the user opens the
// composer. Cuts ~80KB off the home page's initial bundle.
const Composer = lazy(() => import('./Composer.jsx'));

export default function LazyComposer({ open, onClose }) {
  if (!open) return null;
  return (
    <Suspense fallback={<ComposerSkeleton />}>
      <Composer onClose={onClose} />
    </Suspense>
  );
}

function ComposerSkeleton() {
  return (
    <section className="composer composer-modal" aria-busy="true">
      <header><h2>Compose</h2></header>
      <div className="composer-skeleton">
        <div className="skeleton-block skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton-block skeleton-line" style={{ width: '100%', height: '6rem' }} />
        <div className="skeleton-block skeleton-line" style={{ width: '20%' }} />
      </div>
    </section>
  );
}

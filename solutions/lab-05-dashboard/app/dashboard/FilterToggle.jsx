'use client';

import { useState } from 'react';

// Client Component because it owns local UI state (the checkbox value).
//
// Important: even though THIS file is a Client Component, the `children`
// prop it receives can be (and in this lab IS) a Server Component
// (<ActivityFeed />). The Client/Server boundary lives at the import
// boundary — anything imported into a Client Component must be a Client
// Component (or a serializable value), but `children` is passed in by the
// SERVER renderer, so it can be anything.
//
// In a real app you'd push `completedOnly` to the URL with
// useSearchParams + a router push, then the parent page (a Server
// Component) would re-render its children based on the new search param.
// That keeps the source of truth on the server. For this lab, we just
// show the toggle works locally.
export default function FilterToggle({ children }) {
  const [completedOnly, setCompletedOnly] = useState(false);

  return (
    <div className="filter-toggle">
      <label className="filter">
        <input
          type="checkbox"
          checked={completedOnly}
          onChange={(e) => setCompletedOnly(e.target.checked)}
        />
        Show completed only
        {completedOnly && <span className="hint"> (UI demo only — see comment)</span>}
      </label>
      {children}
    </div>
  );
}

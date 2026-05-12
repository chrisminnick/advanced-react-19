'use client';

import { useState } from 'react';

// 'use client' marks this file as a Client Component. Only files that
// reach for browser-only APIs (useState, event handlers, refs to DOM,
// localStorage, etc.) need this directive — everything else stays a
// Server Component by default.
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

// Owns local typed-text state so each keystroke updates THIS component
// only — no parent re-render. Debounces a URL write 300ms after the user
// stops typing; the URL change is what notifies anyone subscribing via
// useSearchParams.
//
// Net effect: typing 6 letters fires 0 PostsFeed re-renders during typing
// and 1 re-render 300ms after the user stops.
export default function SearchInput() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [value, setValue] = useState(initial);

  // Debounced URL sync. The cleanup cancels in-flight writes when the user
  // keeps typing — that's the debounce.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (value) next.set('q', value);
      else next.delete('q');
      // Only write if it would actually change.
      if (next.toString() !== params.toString()) {
        setParams(next, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
    // We deliberately don't depend on `params` — `setParams` is stable, and
    // depending on `params` would re-fire on every URL change, including
    // ones we just made.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="search-input">
      <label>
        Search posts:{' '}
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Try: react, suspense, ai…"
        />
      </label>
    </div>
  );
}

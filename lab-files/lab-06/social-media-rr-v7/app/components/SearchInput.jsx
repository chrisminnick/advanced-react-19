// Receives value+onChange from the parent. Every keystroke updates the
// parent's state, which re-renders ALL of the parent's children — even
// the unrelated PostsFeed.
//
// Lab 6 Optimization A fixes this by moving search to URL params + a
// local state with debounced URL writes.
export default function SearchInput({ value, onChange }) {
  return (
    <div className="search-input">
      <label>
        Search posts:{' '}
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Try: react, suspense, ai…"
        />
      </label>
    </div>
  );
}

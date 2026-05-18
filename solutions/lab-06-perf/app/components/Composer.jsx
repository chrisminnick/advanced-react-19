import { useState } from 'react';
import { useCreatePost } from '../hooks/useCreatePost.js';
// Eagerly imports a "heavy" module — ships with the home-page bundle.
// Lab 6 Optimization C lazy-loads this via React.lazy + Suspense.
import { SUGGESTED_TAGS, pickSuggestion } from '../lib/heavyDictionary.js';

export default function Composer({ onClose }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { mutate, isPending, error, isError } = useCreatePost();
  const suggestion = pickSuggestion(body || ' ');

  function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    mutate(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
          onClose?.();
        },
      }
    );
  }

  return (
    <section className="composer composer-modal">
      <header>
        <h2>Compose</h2>
        {onClose && (
          <button type="button" onClick={onClose}>Close</button>
        )}
      </header>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
        <textarea
          placeholder="What's on your mind?"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
          required
        />
        <p className="hint">
          Try tagging it: <code>#{suggestion.tag}</code> ({suggestion.category})
        </p>
        <button type="submit" disabled={isPending || !body.trim()}>
          {isPending ? 'Posting…' : 'Post'}
        </button>
        {isError && (
          <p role="alert" className="error">Couldn't post: {error.message}</p>
        )}
      </form>
      <footer className="composer-footer">
        <small>{SUGGESTED_TAGS.length} tag suggestions loaded.</small>
      </footer>
    </section>
  );
}

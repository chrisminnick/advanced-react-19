import { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';

// Reads `drafts`, `addDraft`, `removeDraft` from the bloated context. Re-renders
// when ANY context value changes, which means typing in the title field
// re-renders this component every time `notifications` or `posts` updates
// elsewhere. (Open the Profiler — it shows.)
export default function PostComposer() {
  const { drafts, addDraft, removeDraft } = useAppContext();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function save(e) {
    e.preventDefault();
    if (!title && !body) return;
    addDraft({ id: crypto.randomUUID(), title, body, savedAt: Date.now() });
    setTitle('');
    setBody('');
  }

  return (
    <section className="composer">
      <h2>New post (draft)</h2>
      <form onSubmit={save}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit">Save draft</button>
      </form>
      <h3>Drafts ({drafts.length})</h3>
      <ul>
        {drafts.map((d) => (
          <li key={d.id}>
            <strong>{d.title || '(untitled)'}</strong>{' '}
            <button type="button" onClick={() => removeDraft(d.id)}>
              Discard
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

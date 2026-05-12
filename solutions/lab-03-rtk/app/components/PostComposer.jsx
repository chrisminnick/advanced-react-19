import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDraft, removeDraft } from '../store/draftsSlice.js';

export default function PostComposer() {
  const drafts = useSelector((s) => s.drafts.items);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function save(e) {
    e.preventDefault();
    if (!title && !body) return;
    dispatch(addDraft({ id: crypto.randomUUID(), title, body, savedAt: Date.now() }));
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
            <button type="button" onClick={() => dispatch(removeDraft(d.id))}>
              Discard
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

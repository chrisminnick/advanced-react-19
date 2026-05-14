import { useState } from 'react';
import { useCreatePost } from '../hooks/useCreatePost.js';

// Replaces the "save draft" composer for Lab 4. Drafts as a Zustand feature
// could still live alongside this — kept the file separate so we don't
// disrupt PostComposer.jsx for students who want to reuse the drafts pattern.
export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { mutate, isPending, error, isError } = useCreatePost();

  function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    mutate(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
        },
      }
    );
  }

  return (
    <section className="composer">
      <h2>Create a post</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
        <textarea
          placeholder="What's on your mind?"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
          required
        />
        <button type="submit" disabled={isPending || !body.trim()}>
          {isPending ? 'Posting…' : 'Post'}
        </button>
        {isError && (
          <p role="alert" className="error">
            Couldn't post: {error.message}
          </p>
        )}
      </form>
    </section>
  );
}

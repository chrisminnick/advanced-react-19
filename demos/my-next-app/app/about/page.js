import Counter from './Counter';

// Server Component that imports a Client Component as a child. The Counter
// renders interactively in the browser; the rest of this page ships as
// HTML only.
export default function About() {
  return (
    <article>
      <h1>About</h1>
      <p>
        Most of this page is a Server Component. The counter below is a
        Client Component (it uses <code>useState</code>); Next.js streams
        only the bytes needed for that one piece of interactivity.
      </p>

      <Counter />

      <p className="muted">
        Open "View page source" — the static text is in the HTML, but the
        counter's logic isn't. That's the boundary at work.
      </p>
    </article>
  );
}

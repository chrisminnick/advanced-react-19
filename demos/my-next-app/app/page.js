import Link from 'next/link';

// Server Component (default in the App Router). Renders on the server,
// ships zero JavaScript for itself.
export default function Home() {
  return (
    <article>
      <h1>Hello from a Server Component</h1>
      <p>
        This page is rendered on the server and sent to the browser as
        plain HTML. Open DevTools → Network and look at the response —
        there's no client JS for this page itself, only for the global
        chrome and the routes that need interactivity.
      </p>

      <h2>Tour</h2>
      <ul>
        <li><Link href="/about">/about</Link> — composes a Server Component with a Client Component (the counter)</li>
        <li><Link href="/contact-us">/contact-us</Link> — Server Action form with `useActionState` validation</li>
      </ul>
    </article>
  );
}

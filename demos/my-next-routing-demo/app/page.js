import Link from 'next/link';

export default function Home() {
  return (
    <article>
      <h1>App Router routing primitives</h1>
      <p>
        Companion demo to <code>routing-demo/</code> (React Router v7).
        Same routing ideas, different framework — useful to see them
        side by side during Module 3.
      </p>

      <h2>What to look at</h2>
      <ul>
        <li>
          <Link href="/blog">/blog</Link> — nested layout (a sub-nav lives
          in <code>app/blog/layout.js</code> and persists across all blog
          routes)
        </li>
        <li>
          <Link href="/blog/hello-world">/blog/hello-world</Link> — dynamic
          segment (<code>app/blog/[slug]/page.js</code>) reads <code>params.slug</code>
        </li>
        <li>
          <Link href="/blog/streaming">/blog/streaming</Link> — slow
          server-side fetch wrapped in <code>{'<Suspense>'}</code> +{' '}
          <code>loading.js</code> for streaming
        </li>
        <li>
          <Link href="/blog/oops">/blog/oops</Link> — page throws; the
          nearest <code>error.js</code> catches it
        </li>
      </ul>
    </article>
  );
}

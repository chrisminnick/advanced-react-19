import { listPosts } from './data';
import Link from 'next/link';

// Server Component. Awaits data directly — no useEffect, no useQuery.
export default async function BlogIndex() {
  const posts = await listPosts();
  return (
    <article>
      <h1>Blog</h1>
      <p>
        Pick a post. <code>/blog/[slug]</code> is a dynamic segment —
        <code>params.slug</code> in <code>page.js</code> receives the URL part.
      </p>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

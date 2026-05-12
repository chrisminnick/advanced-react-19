import { getPost } from '../data';
import { notFound } from 'next/navigation';

// Dynamic segment: app/blog/[slug]/page.js receives `params.slug`.
// In Next.js 15, `params` is asynchronous — await it before using.
export default async function BlogPost({ params }) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return (
      <article>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
        <p className="muted">
          This page is in <code>app/blog/[slug]/page.js</code>. The slug
          you see in the URL is the value passed to <code>params.slug</code>.
        </p>
      </article>
    );
  } catch (err) {
    if (err.status === 404) notFound();
    // Anything else escalates to error.js
    throw err;
  }
}

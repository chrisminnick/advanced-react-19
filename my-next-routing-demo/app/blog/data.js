import 'server-only';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const POSTS = [
  {
    slug: 'hello-world',
    title: 'Hello world',
    body: 'Welcome to the routing demo. This page is rendered from a dynamic segment — see app/blog/[slug]/page.js.',
  },
  {
    slug: 'server-components',
    title: 'Server Components 101',
    body: 'Server Components are async functions that render on the server, awaiting data directly. No useEffect required.',
  },
  {
    slug: 'streaming',
    title: 'Streaming demo',
    body: 'This one is deliberately slow — see how loading.js + Suspense let the page shell paint immediately.',
  },
];

export async function listPosts() {
  await sleep(150);
  return POSTS.map(({ slug, title }) => ({ slug, title }));
}

export async function getPost(slug) {
  // The streaming demo is slow on purpose.
  await sleep(slug === 'streaming' ? 1500 : 200);
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    const err = new Error(`No post named "${slug}"`);
    err.status = 404;
    throw err;
  }
  return post;
}

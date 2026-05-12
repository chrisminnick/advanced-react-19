import { redirect, useLoaderData } from 'react-router';
import * as api from '../lib/api.server.js';
import { AppProvider, useAppContext } from '../context/AppContext.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import PostsFeed from '../components/PostsFeed.jsx';
import PostComposer from '../components/PostComposer.jsx';

export function meta() {
  return [{ title: 'Home — recent posts' }];
}

export async function loader({ request }) {
  let me;
  try {
    const { data } = await api.getMe(request);
    me = data;
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      const next = encodeURIComponent(new URL(request.url).pathname);
      throw redirect(`/login?next=${next}`);
    }
    throw err;
  }
  const { data: posts } = await api.listPosts(request);
  return { me, posts };
}

export default function HomePage() {
  const { me, posts } = useLoaderData();
  return (
    <AppProvider initialUser={me} initialPosts={posts}>
      <HomeBody />
    </AppProvider>
  );
}

// HomeBody has to be inside the provider to read context.
function HomeBody() {
  const { user, posts } = useAppContext();
  return (
    <div className="home-shell">
      <Header />
      <Sidebar user={user} />
      <main className="home-page">
        <PostComposer />
        {/* Prop-drilling on display: PostsFeed gets `currentUser` only to
            forward it to PostActions. */}
        <PostsFeed posts={posts} currentUser={user} />
      </main>
    </div>
  );
}

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { redirect, useLoaderData } from 'react-router';
import * as api from '../lib/api.server.js';
import { userAtom } from '../atoms/user.js';
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
  const setUser = useSetAtom(userAtom);

  useEffect(() => { setUser(me); }, [me, setUser]);

  return (
    <div className="home-shell">
      <Header />
      <Sidebar />
      <main className="home-page">
        <PostComposer />
        <PostsFeed posts={posts} />
      </main>
    </div>
  );
}

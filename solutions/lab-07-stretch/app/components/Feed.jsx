import PostsFeed from './PostsFeed.jsx';
import { usePosts } from '../hooks/usePosts.js';

// Suspense boundary lives one level up (in routes/home.jsx). When this
// component mounts and usePosts() suspends, the parent renders the
// skeleton; when usePosts resolves, this renders.
export default function Feed() {
  const posts = usePosts();
  return <PostsFeed posts={posts} />;
}

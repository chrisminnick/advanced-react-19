import { useUser } from '../hooks/useUser.js';

export default function PostActions({ post }) {
  const { user } = useUser();
  if (!user || post.author !== user.email) return null;
  return (
    <div className="post-actions">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}

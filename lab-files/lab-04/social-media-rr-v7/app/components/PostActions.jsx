import { useUserStore } from '../stores/user.js';

// Reads `currentUser` from the store. No prop, no drill.
export default function PostActions({ post }) {
  const isMine = useUserStore((s) => s.user?.email === post.author);
  if (!isMine) return null;
  return (
    <div className="post-actions">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}

import { useAtomValue } from 'jotai';
import { userEmailAtom } from '../atoms/user.js';

export default function PostActions({ post }) {
  const myEmail = useAtomValue(userEmailAtom);
  if (!myEmail || post.author !== myEmail) return null;
  return (
    <div className="post-actions">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}

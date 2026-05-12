import { useSelector } from 'react-redux';
import { selectUserEmail } from '../store/userSlice.js';

export default function PostActions({ post }) {
  const myEmail = useSelector(selectUserEmail);
  if (!myEmail || post.author !== myEmail) return null;
  return (
    <div className="post-actions">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}

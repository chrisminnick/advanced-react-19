// Receives `currentUser` after a two-level prop drill from <home> -> <PostsFeed> -> here.
// Shows Edit/Delete only if the post belongs to the signed-in user.
export default function PostActions({ post, currentUser }) {
  const mine = currentUser && post.author === currentUser.email;
  if (!mine) return null;
  return (
    <div className="post-actions">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
}

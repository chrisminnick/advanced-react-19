import mongoose from 'mongoose';

// Post schema.
//
// Shape kept backward-compatible with the original course (`text` is preserved
// as an alias of `body` via the routes layer) but the new clients use
// `title`/`body`/`author`/`createdAt`.
const postSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    body: { type: String, required: true },
    author: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);

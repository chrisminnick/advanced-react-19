import mongoose from 'mongoose';

// Post schema with reactions.
//
// `reactions` is shaped like { heart: { count, userIds }, laugh: ..., ... }.
// Storing per-type buckets makes the toggle endpoint a single $set on a
// known sub-path; no $push gymnastics on the array. Storing userIds (not
// just count) lets us tell the current user "you already reacted" and
// reject double-adds at the backend.
const REACTION_DEFAULT = () => ({ count: 0, userIds: [] });

const postSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    body: { type: String, required: true },
    author: { type: String, default: 'unknown' },
    reactions: {
      heart:    { type: { count: Number, userIds: [String] }, default: REACTION_DEFAULT },
      laugh:    { type: { count: Number, userIds: [String] }, default: REACTION_DEFAULT },
      surprise: { type: { count: Number, userIds: [String] }, default: REACTION_DEFAULT },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);

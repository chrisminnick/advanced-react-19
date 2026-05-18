import mongoose from 'mongoose';

// User schema.
//
// `displayName` is what the new social-media-rr-v7 / Next.js clients show on
// posts and in the auth header. It's optional at the API layer (login/signup
// fall back to the local-part of the email), but storing it explicitly lets
// users change it without changing their email.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    displayName: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

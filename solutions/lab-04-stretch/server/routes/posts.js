import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/post.js';

const router = express.Router();

const SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'dev-only-not-for-production';

function validateToken(req, res, next) {
  const cookieToken = req.cookies?.session;
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const token = cookieToken ?? bearer;

  if (!token) {
    return res.status(401).json({ message: 'Token not present' });
  }
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: 'Token invalid or expired' });
  }
}

// Create a new post
router.post('/', validateToken, async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      body: req.body.body ?? req.body.text,
      author: req.user?.email ?? 'unknown',
    });
    const created = await post.save();
    res.status(201).json({
      id: String(created._id),
      title: created.title,
      body: created.body,
      author: created.author,
      createdAt: created.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to create post: ${err.message}` });
  }
});

// Update a post
router.put('/:id', validateToken, async (req, res) => {
  try {
    const result = await Post.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        body: req.body.body ?? req.body.text,
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    res.status(500).json({ message: `Failed to update post: ${err.message}` });
  }
});

// List posts. Two response shapes:
//   - With `?cursor=` or `?limit=` query params: paginated
//       { items: [...], nextCursor: '<id>' | null }
//   - Without: legacy flat array (kept for back-compat with Lab 2/3 clients).
//
// Cursor is a Mongo ObjectId. Posts are sorted by _id desc (newest first),
// and the next page's cursor is the _id of the last item in this page.
router.get('/', validateToken, async (req, res) => {
  try {
    const wantsPagination = 'cursor' in req.query || 'limit' in req.query;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const filter = {};
    if (req.query.cursor) {
      filter._id = { $lt: req.query.cursor };
    }

    const docs = await Post.find(filter).sort({ _id: -1 }).limit(limit).lean();

    const items = docs.map((p) => ({
      id: String(p._id),
      title: p.title,
      body: p.body,
      author: p.author,
      createdAt: p.createdAt,
    }));

    if (!wantsPagination) {
      return res.status(200).json(items);
    }

    const nextCursor = items.length === limit ? String(docs.at(-1)._id) : null;
    res.status(200).json({ items, nextCursor });
  } catch (err) {
    res.status(500).json({ message: `Failed to list posts: ${err.message}` });
  }
});

// Get a single post
router.get('/:id', validateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({
      id: String(post._id),
      title: post.title,
      body: post.body,
      author: post.author,
      createdAt: post.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch post: ${err.message}` });
  }
});

// Delete a post
router.delete('/:id', validateToken, async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: `Failed to delete post: ${err.message}` });
  }
});

export default router;

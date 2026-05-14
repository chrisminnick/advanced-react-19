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
  if (!token) return res.status(401).json({ message: 'Token not present' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Token invalid or expired' });
  }
}

// Mock tag list. Each post gets 1-3 randomly-picked tags so the Lab 6
// TrendingSidebar component has something to compute over. Deterministic
// seed from the post _id so tags don't change between requests.
const TAG_POOL = [
  'react', 'compiler', 'rsc', 'suspense', 'forms', 'auth',
  'cookies', 'tanstack', 'zustand', 'jotai', 'rtk', 'next',
  'router', 'vite', 'testing', 'ai', 'agents', 'hooks',
];

function tagsFor(id) {
  // Hash-ish derivation off the ObjectId hex so tags are stable per post.
  const hex = String(id);
  const sum = hex.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const n = (sum % 3) + 1;
  return Array.from({ length: n }, (_, i) => TAG_POOL[(sum + i * 7) % TAG_POOL.length]);
}

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
      tags: tagsFor(created._id),
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to create post: ${err.message}` });
  }
});

router.put('/:id', validateToken, async (req, res) => {
  try {
    const result = await Post.updateOne(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body ?? req.body.text }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    res.status(500).json({ message: `Failed to update post: ${err.message}` });
  }
});

router.get('/', validateToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(
      posts.map((p) => ({
        id: String(p._id),
        title: p.title,
        body: p.body,
        author: p.author,
        createdAt: p.createdAt,
        tags: tagsFor(p._id),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: `Failed to list posts: ${err.message}` });
  }
});

router.get('/:id', validateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({
      id: String(post._id),
      title: post.title,
      body: post.body,
      author: post.author,
      createdAt: post.createdAt,
      tags: tagsFor(post._id),
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch post: ${err.message}` });
  }
});

router.delete('/:id', validateToken, async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: `Failed to delete post: ${err.message}` });
  }
});

export default router;

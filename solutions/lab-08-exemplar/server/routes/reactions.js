import express from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/post.js';

const router = express.Router({ mergeParams: true });

const SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'dev-only-not-for-production';
const VALID_TYPES = ['heart', 'laugh', 'surprise'];

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

function userKey(req) {
  return req.user?.email ?? req.user?.sub ?? 'anonymous';
}

// Add the current user's reaction. Idempotent: a second call from the
// same user is a no-op (no duplicates in the userIds array).
router.post('/:type', validateToken, async (req, res) => {
  const { id, type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `Unknown reaction type: ${type}` });
  }
  try {
    const me = userKey(req);
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    ensureReactions(post);
    const slot = post.reactions[type];
    if (!slot.userIds.includes(me)) {
      slot.userIds.push(me);
      slot.count = slot.userIds.length;
      post.markModified(`reactions.${type}`);
      await post.save();
    }
    res.status(200).json(reactionsResponse(post, me));
  } catch (err) {
    res.status(500).json({ message: `Failed to add reaction: ${err.message}` });
  }
});

router.delete('/:type', validateToken, async (req, res) => {
  const { id, type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `Unknown reaction type: ${type}` });
  }
  try {
    const me = userKey(req);
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    ensureReactions(post);
    const slot = post.reactions[type];
    const before = slot.userIds.length;
    slot.userIds = slot.userIds.filter((u) => u !== me);
    slot.count = slot.userIds.length;
    if (slot.userIds.length !== before) {
      post.markModified(`reactions.${type}`);
      await post.save();
    }
    res.status(200).json(reactionsResponse(post, me));
  } catch (err) {
    res.status(500).json({ message: `Failed to remove reaction: ${err.message}` });
  }
});

// Backfill missing reaction buckets on posts created before the schema
// gained reactions. Mutates the doc in place.
function ensureReactions(post) {
  if (!post.reactions) post.reactions = {};
  for (const t of VALID_TYPES) {
    if (!post.reactions[t]) {
      post.reactions[t] = { count: 0, userIds: [] };
      post.markModified(`reactions.${t}`);
    }
  }
}

function reactionsResponse(post, me) {
  const out = {};
  for (const t of VALID_TYPES) {
    const slot = post.reactions[t] ?? { count: 0, userIds: [] };
    out[t] = { count: slot.count ?? 0, mine: slot.userIds?.includes(me) ?? false };
  }
  return out;
}

export default router;

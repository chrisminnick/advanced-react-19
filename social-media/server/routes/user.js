import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const router = express.Router();

const SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'dev-only-not-for-production';
const TOKEN_TTL = '24h';

function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_TTL });
}

// Mongoose 7+ removed query callback APIs. All DB calls below are
// async/await — the v6 callback style this used previously is broken.

router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists!' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName: displayName ?? name ?? email.split('@')[0],
    });
    await newUser.save();
    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Login failed!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const accessToken = generateAccessToken({ sub: String(user._id), email });

    // For new social-media-rr-v7 / Next.js clients: also set HttpOnly cookie
    // so they can use the cookies-only auth pattern Module 10 recommends.
    res.cookie('session', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Body shape kept compatible with the legacy real-time-chat client
    // (which reads accessToken, userId, displayName from the response body).
    res.status(200).json({
      accessToken,
      userId: user._id,
      displayName: user.displayName ?? email.split('@')[0],
      // Modern shape for new clients:
      token: accessToken,
      user: {
        id: String(user._id),
        email,
        name: user.displayName ?? email.split('@')[0],
      },
    });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session', { path: '/' });
  res.status(200).json({ message: 'User logged out' });
});

// /api/me — returns the current user from the session cookie. Used by the
// new social-media-rr-v7 / Next.js clients.
router.get('/me', async (req, res) => {
  const token = req.cookies?.session ?? extractBearer(req);
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    res.json({
      id: String(user._id),
      email: user.email,
      name: user.displayName ?? user.email.split('@')[0],
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

function extractBearer(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export default router;

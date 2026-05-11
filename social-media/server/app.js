import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import postsRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

const app = express();

// Allowed dev origins:
//   - http://localhost:5173  Vite default (social-media-rr-v7, modernized chat)
//   - http://localhost:3000  Next.js + CRA default (social-media-nextjs, legacy chat)
//   - http://localhost:5174  Vite fallback when 5173 is taken
//   - http://localhost:3001  CRA fallback
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .concat([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
  ]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin and CLI tools (no Origin header)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB. Modern mongoose drops useNewUrlParser etc.
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/social-network';
mongoose
  .connect(MONGO_URL)
  .then(() => console.log(`Connected to ${MONGO_URL}`))
  .catch((err) => console.error('Mongo connection failed:', err.message));

// Setup-check endpoint — students hit this from the pre-Day-1 setup-check script
// to confirm the backend is running and reachable.
app.get('/api/setup-check', (req, res) => {
  res.json({
    ok: true,
    message: 'social-media backend ready',
    version: '2.0.0',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes.
//
// /api/user/* — legacy paths used by the real-time-chat client (Lab 1 starter)
// /api/* (login, signup, logout, me) — the convention the new social-media
//   clients (RR v7, Next.js) use. Implemented as aliases on the same router.
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.use('/api', userRoutes); // alias so /api/login, /api/signup, /api/logout, /api/me also work

export default app;

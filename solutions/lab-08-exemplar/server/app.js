import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import postsRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import reactionsRoutes from './routes/reactions.js';

const app = express();

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

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/social-network';
mongoose
  .connect(MONGO_URL)
  .then(() => console.log(`Connected to ${MONGO_URL}`))
  .catch((err) => console.error('Mongo connection failed:', err.message));

app.get('/api/setup-check', (req, res) => {
  res.json({
    ok: true,
    message: 'social-media backend ready',
    version: '2.1.0',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/posts', postsRoutes);
// Reactions are nested under a post: /api/posts/:id/reactions/:type
app.use('/api/posts/:id/reactions', reactionsRoutes);
app.use('/api/user', userRoutes);
app.use('/api', userRoutes);

export default app;

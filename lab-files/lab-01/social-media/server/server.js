import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

// Default to port 5000 — matches the new social-media-rr-v7 / social-media-nextjs
// starters, which proxy /api/* to localhost:5000.
//
// Override with PORT or SERVER_PORT in your .env if 5000 is taken.
const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;

app.listen(port, () => {
  console.log(`social-media server listening on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/setup-check`);
});

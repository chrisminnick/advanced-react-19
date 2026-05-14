import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    port: 5173,
    proxy: {
      // The backend at localhost:4000 is the shared social-media/server.
      // Proxying keeps fetches same-origin during dev so no CORS dance.
      '/api': 'http://localhost:4000',
    },
  },
});

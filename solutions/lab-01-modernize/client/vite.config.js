import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Two backends:
//   - Auth + posts API on http://localhost:4000  (the consolidated social-media/server)
//   - Socket.io chat on  http://localhost:8081   (real-time-chat/server, just sockets)
//
// We proxy them so the client can use same-origin URLs (`/api/...` and `/socket.io`)
// and avoid CORS preflight in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/socket.io': { target: 'http://localhost:8081', ws: true },
    },
  },
});

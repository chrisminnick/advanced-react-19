import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Separate from vite.config.js so we don't pull in the RR v7 starter's
// reactRouter() plugin (which would try to boot the router during test
// runs and complain that there's no server).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.js'],
    globals: true,
    css: false,
    // Lab 8 will introduce coverage thresholds — left off here so first-
    // time runs aren't immediately scary.
  },
});

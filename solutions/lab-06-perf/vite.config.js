import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

// Optimization D: enable the React Compiler.
//
// The Compiler runs as a Babel plugin during Vite's React transform. The
// `target: '19'` tells it the React version we're shipping against, so it
// only emits the new memoization primitives that React 19 understands.
//
// The eslint plugin (eslint-plugin-react-compiler) flags components the
// Compiler couldn't memoize. Those bail-outs are usually the result of
// in-render mutation or a captured-but-unmemoized closure. Each one is
// fixable; run eslint to see the list.
const reactCompilerOptions = { target: '19' };

export default defineConfig({
  plugins: [
    reactRouter({
      future: {},
      // Note: in some RR v7 versions this is configured via vite-plugin-react
      // directly. If your version of @react-router/dev doesn't accept babel
      // options, replace this block with the @vitejs/plugin-react variant
      // below.
      babel: {
        plugins: [['babel-plugin-react-compiler', reactCompilerOptions]],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000' },
  },
});

// Alternative if reactRouter doesn't accept babel options in your version:
//
// import react from '@vitejs/plugin-react';
// export default defineConfig({
//   plugins: [
//     react({
//       babel: { plugins: [['babel-plugin-react-compiler', { target: '19' }]] },
//     }),
//     reactRouter(),
//   ],
//   server: { port: 5173, proxy: { '/api': 'http://localhost:4000' } },
// });

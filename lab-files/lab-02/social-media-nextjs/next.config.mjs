/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* to the social-media backend so the client and Server Components
  // can both call /api/... without hardcoding the backend URL. Mirror of the
  // Vite proxy in the RR v7 client.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },

  // The React Compiler is enabled per Module 7 / Lab 6 conventions.
  // Comment out if your team isn't using it yet.
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;

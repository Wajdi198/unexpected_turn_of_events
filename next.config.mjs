/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail the production build because of lint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail the production build because of TypeScript warnings
    // (we still get TS errors during dev)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  compress: true,
  // All pages are dynamic (auth-gated), skip static prerendering entirely
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static page generation — all pages require auth/client-side rendering
  generateBuildId: async () => 'build',
};

module.exports = nextConfig;

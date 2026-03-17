/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  transpilePackages: ['@luxfi/logo', '@luxbank/brand', '@luxbank/ui'],
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Continue build even if some pages fail to prerender
    workerThreads: false,
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

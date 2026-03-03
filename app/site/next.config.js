/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@luxfi/logo', '@luxbank/brand', 'geist'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.ghost.org",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
      },
      {
        protocol: "https",
        hostname: "news.dev.lux.financial",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.dev.lux.financial",
        port: "",
      },
    ],
  },
  // Use 'export' for static deployment (Cloudflare Pages, GitHub Pages)
  // Set to 'standalone' for Node.js server deployment
  output: process.env.STATIC_EXPORT ? "export" : "standalone",
  // basePath removed - site deploys to root of custom domain (lux.financial)
  compress: true,
};

module.exports = nextConfig;

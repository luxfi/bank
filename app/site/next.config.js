/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@luxfi/logo', '@luxbank/brand'],
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
  // Use 'export' for GitHub Pages static deployment
  // Set to 'standalone' for Node.js server deployment
  output: process.env.GITHUB_PAGES ? "export" : "standalone",
  basePath: process.env.GITHUB_PAGES ? "/bank" : "",
  compress: true,
};

module.exports = nextConfig;

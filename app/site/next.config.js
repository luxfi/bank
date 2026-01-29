/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
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
        hostname: "news.dev.lux.finance",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.dev.lux.finance",
        port: "",
      },
    ],
  },
  output: "standalone",
  compress: true,
};

module.exports = nextConfig;

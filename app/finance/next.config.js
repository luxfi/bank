const withMDX = require('@next/mdx')()
const svgrWebpackConfig = require('./svgr.next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
      {
        protocol: "http",
        hostname: "localhost",
      }
    ],    
 },
    // https://stackoverflow.com/questions/72621835/how-to-fix-you-may-need-an-appropriate-loader-to-handle-this-file-type-current
  transpilePackages: [
    '@hanzo/ui', 
    '@hanzo/auth', 
    '@hanzo/commerce', 
    '@luxfi/ui',
    '@luxfi/data'
  ],
  productionBrowserSourceMaps: true,
  webpack: svgrWebpackConfig // if we need others, set up a chain of calls. 
}

module.exports = withMDX(nextConfig)

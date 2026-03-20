/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  transpilePackages: [
    '@luxfi/logo', '@luxbank/brand', '@luxbank/ui', '@luxfi/ui',
    'tamagui', '@tamagui/core', '@tamagui/animations-css',
    '@tamagui/sheet', '@tamagui/select', '@tamagui/toast',
    'react-native-web',
  ],
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    esmExternals: 'loose',
    workerThreads: false,
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
  poweredByHeader: false,
};

module.exports = nextConfig;

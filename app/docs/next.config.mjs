import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  output: process.env.STATIC_EXPORT ? 'export' : 'standalone',
  basePath: process.env.GITHUB_PAGES ? '/bank/docs' : '',
  images: {
    unoptimized: true,
  },
})

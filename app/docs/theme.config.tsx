import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: '1.5rem' }}>
      Lux Financial
    </span>
  ),
  project: {
    link: 'https://github.com/luxfi/bank',
  },
  docsRepositoryBase: 'https://github.com/luxfi/bank/tree/main/app/docs',
  footer: {
    content: (
      <span>
        {new Date().getFullYear()} © Lux Financial. All rights reserved.
      </span>
    ),
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Lux Financial - Bank Infrastructure Documentation" />
      <meta name="og:title" content="Lux Financial Documentation" />
    </>
  ),
  banner: {
    key: 'beta-docs',
    content: (
      <a href="https://lux.financial" target="_blank" rel="noreferrer">
        Lux Financial Platform is now live. Learn more →
      </a>
    ),
  },
}

export default config

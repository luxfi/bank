import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
import { resolve } from 'path'

// The library build. The grid compiler runs HERE, once, so a host consuming
// these screens needs no build plugin of its own — it gets compiled CSS and
// JavaScript. React and the router stay external so the host's copies are the
// only ones on the page; two Reacts is an invalid-hook-call, and two routers
// would each think they owned the URL.
export default defineConfig({
  plugins: [
    react(),
    hanzoguiPlugin({ components: ['@hanzo/gui'], config: './hanzogui.config.ts', optimize: true }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src'), 'react-native': 'react-native-web' },
    dedupe: ['react', 'react-dom'],
  },
  // The runtime reads process.env directly — thirty bare reads of GUI_*, none
  // of them guarded by a typeof check. The app survives because the build
  // plugin defines them; a host importing only the compiled artifact hits the
  // first read and white-screens. Defining the whole object leaves no read
  // undefined, which is the only way to be sure while they stay unguarded.
  define: {
    'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
    'process.env': '{}',
    'process.platform': JSON.stringify('browser'),
  },
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    // Fonts ship as files. Inlined as base64 they were 205 of the stylesheet's
    // 219 kB, and a host that imports the nav gets the whole sheet on its
    // marketing page.
    assetsInlineLimit: 0,
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router', '@hanzo/iam', '@hanzo/iam/react', '@hanzo/iam/browser'],
    },
  },
})

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
  define: { 'process.env.TAMAGUI_TARGET': JSON.stringify('web') },
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router', '@hanzo/iam', '@hanzo/iam/react', '@hanzo/iam/browser'],
    },
  },
})

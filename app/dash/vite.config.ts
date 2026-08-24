import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    // The @hanzo/gui grid runtime: compiles styled components to grid-css and
    // wires the design config. optimize:false keeps the dev loop fast.
    hanzoguiPlugin({ components: ['@hanzo/gui'], config: './hanzogui.config.ts', optimize: false }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Web target: react-native's primitives resolve to react-native-web.
      'react-native': 'react-native-web',
    },
    // @hanzo/iam ships its own React; dedupe so hooks share one instance
    // (otherwise: "Invalid hook call — more than one copy of React").
    dedupe: ['react', 'react-dom'],
  },
  define: { 'process.env.TAMAGUI_TARGET': JSON.stringify('web') },
  optimizeDeps: {
    include: ['@hanzo/iam/browser', '@hanzo/iam/react'],
  },
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: process.env.VITE_BANK_API_URL || 'http://localhost:8070',
        changeOrigin: true,
      },
    },
  },
})

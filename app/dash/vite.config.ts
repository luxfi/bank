import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
    // @hanzo/iam ships its own React; dedupe so hooks share one instance
    // (otherwise: "Invalid hook call — more than one copy of React").
    dedupe: ['react', 'react-dom'],
  },
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

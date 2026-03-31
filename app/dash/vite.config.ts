import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_BANK_API_URL || 'http://localhost:8070',
        changeOrigin: true,
      },
      '/v1': {
        target: process.env.VITE_BANK_API_URL || 'http://localhost:8070',
        changeOrigin: true,
      },
    },
  },
})

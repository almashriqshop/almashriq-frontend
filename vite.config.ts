import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  // In production, API calls go directly to the backend URL
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:5000/api'
    ),
  },
})

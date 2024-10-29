import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_CONTENTFUL_SPACE_ID': JSON.stringify(process.env.VITE_CONTENTFUL_SPACE_ID),
    'import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN': JSON.stringify(process.env.VITE_CONTENTFUL_ACCESS_TOKEN),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['@tanstack/react-query']
        }
      }
    }
  }
})



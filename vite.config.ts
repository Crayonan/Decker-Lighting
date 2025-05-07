import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Try specifying the path to .env explicitly for dotenv
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath, debug: true }); // Enable debug mode for dotenv

if (result.error) {
  console.error('[Vite Config] dotenv Error:', result.error);
} else {
  console.log('[Vite Config] dotenv Parsed:', result.parsed);
}

console.log('[Vite Config] VITE_TEST_VAR from process.env:', process.env.VITE_TEST_VAR);
console.log('[Vite Config] VITE_PAYLOAD_API_URL from process.env:', process.env.VITE_PAYLOAD_API_URL);


export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_PAYLOAD_PUBLIC_URL': JSON.stringify(process.env.VITE_PAYLOAD_PUBLIC_URL),
    'import.meta.env.VITE_PAYLOAD_API_URL': JSON.stringify(process.env.VITE_PAYLOAD_API_URL),
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
          vendor: ["react", "react-dom"],
          utils: ["@tanstack/react-query"],
        },
      },
    },
  },
});

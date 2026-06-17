import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api requests to the backend (4000).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});

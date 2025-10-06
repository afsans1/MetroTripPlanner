import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stations': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
    },
  },
});


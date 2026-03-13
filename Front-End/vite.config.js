import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  return {
    base: isBuild ? '/app/' : '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': backendTarget,
        '/storage': backendTarget,
      },
    },
    build: {
      outDir: '../Back-End/public/app',
      emptyOutDir: true,
    },
  };
});

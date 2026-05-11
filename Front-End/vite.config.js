import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const buildToBackend = process.env.BUILD_TO_BACKEND === 'true';
  const outDir = buildToBackend ? '../Back-End/public/build' : 'dist';

  return {
    // Default: build stays inside Front-End (dist/) for easy upload (e.g., cPanel).
    // Optional single-server: set BUILD_TO_BACKEND=true to output into Back-End/public/build.
    // In that mode, assets are served from /build/assets/* and manifest.json is generated.
    base: isBuild ? (buildToBackend ? '/build/' : './') : '/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': backendTarget,
        '/storage': backendTarget,
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
      manifest: buildToBackend ? 'manifest.json' : false,
    },
  };
});

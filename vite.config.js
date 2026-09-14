import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    host: true,
  },

  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Increase warning threshold
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Vite 8 uses oxc (Rust-based) by default — faster than esbuild
    minify: true,
    rollupOptions: {
      output: {
        // Granular manual chunk splitting — keeps vendor code separate from app code
        manualChunks(id) {
          // React core — loaded first, cached longest
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          // Framer Motion — large, separate chunk
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'framer-motion';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // Firebase — only loaded when needed
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
          // All other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
  },
});

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 7860,
      proxy: {
        '/api': {
          target: 'http://localhost:7860',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // ✅ This ensures CSS is extracted to a separate file
      cssCodeSplit: false,
      // ✅ Generate a manifest file to help with asset loading
      manifest: true,
      rollupOptions: {
        output: {
          // ✅ Ensure CSS is always generated
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
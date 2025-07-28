import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for security and size
    minify: 'terser', // Better minification
    target: 'es2020', // Modern browsers only for smaller bundles
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunk
          'react-vendor': ['react', 'react-dom'],

          // Router chunk (lazy loaded)
          'router': ['react-router-dom'],

          // UI/Icons chunk
          'ui-components': ['lucide-react'],

          // API/Network chunk
          'api-vendor': ['axios'],

          // Crypto/Blockchain chunk (largest, separate loading)
          'crypto-vendor': ['@thirdweb-dev/sdk', '@thirdweb-dev/react'],

          // Charts chunk (conditional loading)
          'charts': ['recharts']
        },
        chunkFileNames: (chunkInfo) => {
          // Optimize chunk naming for caching
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // Optimize asset naming for caching
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },
  define: {
    // Define environment variables for production
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      'lucide-react'
    ],
    // Exclude heavy dependencies from pre-bundling for better lazy loading
    exclude: [
      '@thirdweb-dev/sdk',
      '@thirdweb-dev/react',
      'recharts'
    ]
  }
})

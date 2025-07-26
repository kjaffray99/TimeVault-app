import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['axios'],
                    icons: ['lucide-react']
                }
            }
        }
    },
    define: {
        // Define environment variables for production
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'axios', 'lucide-react']
    }
})

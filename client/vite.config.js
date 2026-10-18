import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        /* Vite 8 uses rolldown, which requires manualChunks to be a FUNCTION.
           The old object form silently failed the build
           ("manualChunks is not a function"). */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/.test(id)) return 'gsap'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
        },
      },
    },
  },
})

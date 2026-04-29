import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || ''
          const pathname = url.split('?')[0]
          const isAsset = pathname.startsWith('/@') ||
            pathname.startsWith('/node_modules') ||
            pathname.startsWith('/assets') ||
            /\.(js|jsx|ts|tsx|mjs|cjs|css|png|svg|ico|json|woff2?)$/.test(pathname)
          if (!isAsset) req.url = '/index.html'
          next()
        })
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8000', rewrite: (p) => p.replace(/^\/api/, '') }
    }
  }
})

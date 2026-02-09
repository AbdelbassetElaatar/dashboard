import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: false, // prevent source maps from being generated in production
  },
  server: {
    port: 3001,
    proxy: {
      '/wp-json': {
        target: 'https://lightslategray-grouse-831517.hostingersite.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wp-json/, '/wp-json'),
      },
    },
    fs: {
      strict: false, // optional: allows access to files outside root
    }
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Op GitHub Pages staat de site onder /<repo>/, dus bij een build krijgt alles
// dat pad als basis. Lokaal (dev) blijft de basis gewoon "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Ai-Fraud-Detection/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
}))

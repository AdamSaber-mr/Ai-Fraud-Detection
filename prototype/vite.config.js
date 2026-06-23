import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Eigen poort (5174) zodat het naast de bestaande frontend (5173) kan draaien.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5174 },
})

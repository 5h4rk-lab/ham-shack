import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site reads question pools and study guides straight from the repo root
// (../data and ../study-guides), so there is one source of truth.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { fs: { allow: ['..'] } },
  build: { chunkSizeWarningLimit: 900 },
})

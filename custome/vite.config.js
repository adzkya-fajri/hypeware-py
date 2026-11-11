import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Gunakan relative path untuk assets
  server: {
    port: 5173, // Port untuk development
    open: false, // Jangan auto-open browser
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
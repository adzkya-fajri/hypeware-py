import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  
  // Multi-page app configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        studio: resolve(__dirname, 'studio.html'),
        colection_pria: resolve(__dirname, 'colection_pria.html'),
        colection_wanita: resolve(__dirname, 'colection_wanita.html'),
        colection_anak: resolve(__dirname, 'colection_anak.html'),
        colection_bayi: resolve(__dirname, 'colection_bayi.html'),
        desc_item: resolve(__dirname, 'desc.item.html'),
        keranjang: resolve(__dirname, 'keranjang.html'),
        customer_profile: resolve(__dirname, 'customer profile.html'),
        search: resolve(__dirname, 'search fitur.html'),
      },
    },
    outDir: 'dist',
  },
  
  server: {
    port: 3000,
    open: true, // Auto-open browser saat dev
  },
  
  // Resolve aliases untuk import yang lebih mudah
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@custome': resolve(__dirname, './custome/src'),
      '@assets': resolve(__dirname, './asset'),
      '@data': resolve(__dirname, './colectiondata'),
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '0.0.0.0',   // cho phép truy cập từ LAN
    proxy: {
      '/api': {
        target: 'http://192.168.0.197:5050',  // IP LAN của máy bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

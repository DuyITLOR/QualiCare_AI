import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // FE gọi /api/... -> proxy sang http://localhost:5050
      // BE của bạn mount /chat ở app.use('/chat', ...) nên
      // /api/chat/... sẽ thành http://localhost:5050/chat/...
      '/api': {
        target: process.env.VITE_DEV_API || 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

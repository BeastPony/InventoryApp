import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                 // слушать все сетевые интерфейсы
    port: 5173,                 // можно оставить по умолчанию
    proxy: {
      '/api': {
        target: 'http://localhost:3001', 
        changeOrigin: true,
      }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local development: /api wali requests backend (port 5002) par jayen
    proxy: {
      "/api": "http://localhost:5002",
    },
  },
})
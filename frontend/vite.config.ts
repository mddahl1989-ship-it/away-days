import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Diesen Port hat die API in ihrer CORS-Regel freigegeben.
    port: 5173,
    strictPort: true,
  },
})

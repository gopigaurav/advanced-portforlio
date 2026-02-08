import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Use this package instead

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
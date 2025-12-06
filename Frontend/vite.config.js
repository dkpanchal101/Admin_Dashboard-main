// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // For Vercel: use '/' (default)
  // For GitHub Pages: use '/Admin_Dashboard/'
  base: import.meta.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
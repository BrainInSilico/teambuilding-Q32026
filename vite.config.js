import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => chemins relatifs, indispensable pour hébergement statique OVH
export default defineConfig({
  base: './',
  plugins: [react()],
})

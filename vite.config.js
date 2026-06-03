import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => chemins relatifs, indispensable pour hébergement statique OVH
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/ui/test-setup.js',
  },
})

/// <reference types="vitest/config" />
import { defineConfig } from 'vite' // <-- Importar desde 'vite', no de 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
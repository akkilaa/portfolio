import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@api': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
  },
})

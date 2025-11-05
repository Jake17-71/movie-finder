import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/movie-finder/',
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
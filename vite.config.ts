import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
// GitHub Pages project site: set VITE_BASE_URL=/仓库名/ in CI (see .github/workflows/deploy.yml)
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? '/',
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
})

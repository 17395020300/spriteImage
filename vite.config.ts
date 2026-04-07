import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
// 线上：https://rupiong.github.io/nanaSprite/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/nanaSprite/',
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
}))

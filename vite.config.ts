import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { name: string }

function productionBase(): string {
  // Netlify 环境变量自动注入
  if (process.env.NETLIFY) return '/'
  const fromEnv = process.env.VITE_BASE_PATH?.trim()
  if (fromEnv) return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) return `/${repo}/`
  return `/${pkg.name}/`
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : productionBase(),
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

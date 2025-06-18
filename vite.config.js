import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    // 新增 server 配置项
    allowedHosts: [
      // 新增 allowedHosts 数组
      '33c5-111-176-65-71.ngrok-free.app', // 将 ngrok 生成的域名添加进来
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

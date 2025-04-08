// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  compatibilityDate: '2025-04-08',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://localhost:5000/',
    }
  },
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    server: {
      hmr: {
        protocol: 'wss',
      },
      https: {},
      watch: {
        usePolling: true
      }
    },
    build: {
      target: 'esnext',
      assetsInlineLimit: 4096, // 4KB
      chunkSizeWarningLimit: 1000, // 1MB
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', '@vueuse/core'],
          }
        }
      }
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '视频上传系统',
      meta: [
        { name: 'description', content: '视频和图片上传系统' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
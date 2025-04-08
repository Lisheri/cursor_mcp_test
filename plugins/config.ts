import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // 获取环境变量
  const runtimeConfig = useRuntimeConfig()
  
  // 设置全局配置
  const appConfig = {
    apiBase: runtimeConfig.public.apiBase,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    maxUploadSize: 500 * 1024 * 1024, // 500MB 最大上传大小
    supportedVideoFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'],
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  }
  
  // 提供全局方法给Vue组件使用
  return {
    provide: {
      appConfig
    }
  }
}) 
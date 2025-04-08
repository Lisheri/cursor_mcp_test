<template>
  <!-- 网格布局 -->
  <div v-if="layout === 'grid'" class="upload-card p-3 bg-white rounded-lg border border-gray-200">
    <div class="relative mb-2">
      <!-- 缩略图/预览区域 -->
      <div class="rounded-lg overflow-hidden h-36 bg-gray-100 flex items-center justify-center border border-gray-100">
        <!-- 图片预览 -->
        <img
          v-if="item.previewUrl && !item.isVideo"
          :src="item.previewUrl"
          class="w-full h-full object-contain"
          alt=""
        />
        
        <!-- 视频缩略图 -->
        <img
          v-if="item.thumbnailUrl && item.isVideo"
          :src="item.thumbnailUrl" 
          class="w-full h-full object-cover"
          alt=""
        />
        
        <!-- 视频播放按钮 -->
        <div
          v-if="item.status === 'success' && item.isVideo"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <button class="bg-white rounded-full p-2 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- 上传中状态 -->
        <div
          v-if="item.status === 'uploading'"
          class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
        >
          <div class="text-center">
            <div class="relative w-16 h-16 mx-auto">
              <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  class="text-gray-300"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  class="text-blue-500"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  :stroke-dasharray="2 * Math.PI * 45"
                  :stroke-dashoffset="2 * Math.PI * 45 * (1 - item.progress / 100)"
                />
              </svg>
              <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                {{ item.progress }}%
              </div>
            </div>
            <div class="text-white text-xs mt-2">上传中...</div>
          </div>
        </div>
        
        <!-- 错误状态 -->
        <div
          v-if="item.status === 'error'"
          class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
        >
          <div class="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件信息 -->
    <div class="text-sm font-medium text-gray-900 truncate mb-1">
      {{ item.name }}
    </div>
    <div class="text-xs text-gray-400 mb-2">
      {{ item.formattedSize || (item.size !== undefined ? formatFileSize(item.size) : '') }}
    </div>

    <!-- 状态区域 -->
    <div>
      <!-- 上传进度 -->
      <div
        v-if="item.status === 'uploading'"
        class="w-full"
      >
        <div class="bg-gray-100 rounded-full h-1.5 mb-1">
          <div
            class="bg-blue-600 h-1.5 rounded-full"
            :style="{ width: `${item.progress}%` }"
          ></div>
        </div>
        <div class="text-xs text-gray-400">
          正在上传 {{ item.progress }}%
        </div>
      </div>

      <!-- 失败状态 -->
      <div 
        v-if="item.status === 'error'" 
        class="flex items-center justify-between text-xs"
      >
        <div class="text-red-500 flex items-center">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
          上传失败
        </div>
        <button
          class="text-blue-600 hover:underline font-medium"
          @click="onRetry"
        >
          重新上传
        </button>
      </div>
    </div>

    <!-- 删除按钮，固定在右上角 -->
    <button
      class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
      @click="onRemove"
      title="删除"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!-- 列表布局 -->
  <div v-else class="upload-item relative border border-gray-100 rounded p-4 flex items-center">
    <!-- 预览图 -->
    <div class="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
      <img
        v-if="item.thumbnailUrl || item.previewUrl"
        :src="item.thumbnailUrl || item.previewUrl"
        class="w-full h-full object-cover"
        alt="Preview"
      />
      <div v-else class="flex items-center justify-center h-full w-full bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- 视频播放按钮 -->
      <div
        v-if="item.status === 'success' && item.isVideo"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
      
      <!-- 上传中状态覆盖 -->
      <div
        v-if="item.status === 'uploading'"
        class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white text-xs"
      >
        上传中...
      </div>
    </div>

    <!-- 文件信息和进度 -->
    <div class="ml-4 flex-grow overflow-hidden">
      <div class="font-medium text-gray-900 truncate text-sm">{{ item.name }}</div>
      
      <!-- 文件大小 -->
      <div class="text-gray-400 text-xs">{{ item.formattedSize || (item.size !== undefined ? formatFileSize(item.size) : '') }}</div>
      
      <!-- 状态区域 -->
      <div class="mt-2">
        <!-- 上传进度 -->
        <div v-if="item.status === 'uploading'" class="w-full">
          <div class="w-full bg-gray-100 rounded-full h-1.5">
            <div
              class="bg-blue-600 h-1.5 rounded-full"
              :style="{ width: `${item.progress}%` }"
            ></div>
          </div>
          <div class="text-xs text-gray-400 mt-1">
            正在上传 {{ item.progress }}%
          </div>
        </div>
        
        <!-- 失败状态 -->
        <div v-if="item.status === 'error'" class="flex items-center">
          <div class="text-red-500 font-medium text-xs flex items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
            上传失败
          </div>
          <button
            @click="onRetry"
            class="text-blue-600 text-xs font-medium ml-2 hover:underline"
          >
            重新上传
          </button>
        </div>
      </div>
    </div>

    <!-- 删除按钮 -->
    <button
      @click="onRemove"
      class="ml-3 text-gray-300 hover:text-gray-400 transition-colors flex-shrink-0"
      title="删除"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9ZM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { UploadItem as BaseUploadItem } from '~/utils/uploadService'

// 使用更通用的类型，让组件能处理任何种类的上传项
type UploadItem = Partial<BaseUploadItem> & {
  id: string
  name: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  formattedSize?: string
  size?: number
  previewUrl?: string
  thumbnailUrl?: string
  isVideo?: boolean
}

const props = defineProps<{
  item: UploadItem
  layout: 'grid' | 'list'
}>()

const emit = defineEmits<{
  remove: [id: string]
  retry: [id: string]
}>()

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 删除处理
const onRemove = () => {
  emit('remove', props.item.id)
}

// 重试处理
const onRetry = () => {
  emit('retry', props.item.id)
}
</script>

<style scoped>
.upload-item {
  transition: all 0.3s;
}
</style> 
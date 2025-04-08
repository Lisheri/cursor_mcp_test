<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- 主内容区 -->
    <div class="flex-1 flex">
      <div class="w-full h-full bg-white">
        <div class="h-full flex flex-col">
          <!-- Tab切换 -->
          <div class="flex border-b border-gray-100">
            <button 
              class="py-3 px-6 font-medium focus:outline-none relative"
              :class="[activeTab === 'video' ? 'text-blue-600' : 'text-gray-400']"
              @click="activeTab = 'video'"
            >
              上传视频
              <div v-if="activeTab === 'video'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            </button>
            <button 
              class="py-3 px-6 font-medium focus:outline-none relative"
              :class="[activeTab === 'image' ? 'text-blue-600' : 'text-gray-400']"
              @click="activeTab = 'image'"
            >
              上传图片
              <div v-if="activeTab === 'image'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            </button>
          </div>
          
          <!-- 内容区域 -->
          <div class="flex-1 overflow-auto">
            <VideoUploader v-if="activeTab === 'video'" />
            <ImageUploader v-if="activeTab === 'image'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VideoUploader from '~/components/VideoUploader.vue'
import ImageUploader from '~/components/ImageUploader.vue'

const activeTab = ref('video')
</script>

<style scoped>
@media (min-width: 640px) {
  .max-w-xl {
    max-width: 36rem;
  }
}
</style> 
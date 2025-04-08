<template>
  <div class="video-uploader flex flex-col h-full">
    <!-- Tab切换 -->
    <div class="flex border-b border-gray-100">
      <button 
        class="py-3 px-6 text-blue-600 font-medium focus:outline-none relative" 
        @click="activeTab = 'video'"
      >
        上传视频
        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
      </button>
      <button 
        class="py-3 px-6 text-gray-400 font-medium focus:outline-none relative opacity-50" 
        @click="activeTab = 'image'"
      >
        上传图片
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-5 overflow-auto">
      <div class="flex justify-start mb-5">
        <div>
          <input
            ref="fileInput"
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo"
            class="hidden"
            @change="handleFileSelected"
          />
          <button
            @click="triggerFileInput"
            class="px-5 py-2 text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          >
            上传视频
          </button>
        </div>
      </div>

      <!-- 使用UploadList组件展示视频上传列表 -->
      <UploadList 
        :items="uploadList" 
        layout="list" 
        emptyText="暂无上传视频"
        @remove="removeUpload"
        @retry="retryUpload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'
import UploadList from '~/components/UploadList.vue'
import type { UploadItem } from '~/utils/uploadService'
import { uploadFile, createUploadItem, createVideoStaticItems } from '~/utils/uploadService'

const appConfig = useRuntimeConfig().public.appConfig
const activeTab = ref('video')
const fileInput = ref<HTMLInputElement | null>(null)
const uploadList = ref<UploadItem[]>([])

onMounted(() => {
  // 初始化静态数据
  uploadList.value = createVideoStaticItems()
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    // 清除静态数据，添加实际上传
    uploadList.value = []
    
    Array.from(input.files).forEach(async (file) => {
      const item = await createUploadItem(file, true)
      uploadList.value.push(item)
      handleUpload(item)
    })
    
    // 重置input，允许再次选择相同文件
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const handleUpload = async (item: UploadItem) => {
  try {
    await uploadFile(item, appConfig.apiBaseUrl)
  } catch (error) {
    console.error('上传失败:', error)
    // 错误已在uploadFile中设置到item上
  }
}

const retryUpload = (id: string) => {
  const item = uploadList.value.find(i => i.id === id)
  if (item && item.status === 'error') {
    item.status = 'uploading'
    item.progress = 0
    handleUpload(item)
  }
}

const removeUpload = (id: string) => {
  const index = uploadList.value.findIndex(i => i.id === id)
  if (index !== -1) {
    uploadList.value.splice(index, 1)
  }
  
  // 如果没有上传项了，重新显示静态数据
  if (uploadList.value.length === 0) {
    uploadList.value = createVideoStaticItems()
  }
}
</script>

<style scoped>
.upload-item {
  transition: all 0.3s;
}
</style> 
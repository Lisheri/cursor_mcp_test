<template>
  <div class="image-uploader">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">上传图片</h2>
      <div>
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif"
          class="hidden"
          @change="handleFileSelected"
        />
        <button
          @click="triggerFileInput"
          class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          上传图片
        </button>
      </div>
    </div>

    <!-- 使用UploadList组件展示图片上传列表 -->
    <UploadList 
      :items="uploadList" 
      layout="grid" 
      emptyText="暂无上传图片"
      @remove="removeUpload"
      @retry="retryUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'
import UploadList from '~/components/UploadList.vue'
import type { UploadItem } from '~/utils/uploadService'
import { uploadFile, createUploadItem, createStaticImageItems } from '~/utils/uploadService'

const appConfig = useRuntimeConfig().public.appConfig

const fileInput = ref<HTMLInputElement | null>(null)
const uploadList = ref<UploadItem[]>([])

onMounted(() => {
  // 初始化静态数据
  uploadList.value = createStaticImageItems()
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
      const item = await createUploadItem(file, false)
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
    uploadList.value = createStaticImageItems()
  }
}
</script>

<style scoped>
.upload-item {
  transition: all 0.3s;
}
</style> 
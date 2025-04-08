<template>
  <div>
    <!-- 上传列表 -->
    <div :class="['upload-list', layout]">
      <template v-if="items.length > 0">
        <UploadCard 
          v-for="item in items" 
          :key="item.id" 
          :item="item"
          :layout="layout"
          @remove="$emit('remove', $event)"
          @retry="$emit('retry', $event)"
        />
      </template>
      
      <!-- 空状态 -->
      <div v-else class="empty-state text-center py-8">
        <p class="text-gray-400">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadCard from '~/components/UploadCard.vue'
import type { UploadItem as OriginalUploadItem } from '~/utils/uploadService'

// 使用更通用的类型
export type UploadItem = Partial<OriginalUploadItem> & {
  id: string
  name: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  formattedSize?: string
  size?: number
  isStatic?: boolean // 标记是否是静态数据，方便处理
}

const props = defineProps<{
  items: UploadItem[]
  layout: 'list' | 'grid'
  emptyText: string
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
</script>

<style scoped>
.upload-list {
  display: flex;
  flex-direction: column;
}

/* 网格布局 */
.upload-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 列表布局不使用网格，保持垂直方向堆叠 */
.upload-list.list .upload-item {
  background-color: white;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
}

.upload-list.list .upload-item:last-child {
  margin-bottom: 0;
}

.empty-state {
  border: 1px dashed #e1e6fa;
  border-radius: 0.5rem;
  padding: 2rem;
  color: #b1b7cc;
}
</style> 
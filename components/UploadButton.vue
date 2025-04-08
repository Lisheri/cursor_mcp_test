<template>
  <div class="upload-button-container mb-6 flex justify-end">
    <label
      :for="inputId"
      class="flex items-center justify-center h-9 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition border border-transparent"
    >
      <span>{{ buttonText }}</span>
    </label>
    <input
      :id="inputId"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  buttonText: string
  accept: string
  inputId: string
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
}>()

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file) return

  // 发送文件到父组件
  emit('fileSelected', file)

  // 重置文件选择器
  if (input) {
    input.value = ''
  }
}
</script> 
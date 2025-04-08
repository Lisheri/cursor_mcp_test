<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- 主内容区 -->
    <div class="flex-1 flex">
      <div class="w-full h-full bg-white">
        <div class="h-full flex flex-col">
          <VideoUploader />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoUploader from '~/components/VideoUploader.vue'
</script>

<style scoped>
@media (min-width: 640px) {
  .max-w-xl {
    max-width: 36rem;
  }
}
</style> 
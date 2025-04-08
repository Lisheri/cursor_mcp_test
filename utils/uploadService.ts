import { v4 as uuidv4 } from 'uuid'
import { uploadVideo, deleteVideo, uploadImage, deleteImage } from './api'

export interface UploadItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  previewUrl?: string
  thumbnailUrl?: string
  isVideo?: boolean
  resourceId?: string
  formattedSize?: string
  isStatic?: boolean  // 标记是否为静态数据
  uploadController?: {
    abort: () => void
  }
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
}

// 简化的静态数据类型，不需要File对象
export type StaticUploadItem = Omit<UploadItem, 'file' | 'uploadController' | 'type'> & {
  isStatic: true
}

// 创建静态视频数据项
export const createVideoStaticItems = (): StaticUploadItem[] => {
  return [
    {
      id: 'static-video-1',
      name: '2347821A07.mp4',
      formattedSize: '872k',
      size: 872 * 1024,
      status: 'success' as const,
      thumbnailUrl: '/images/video-thumbnail-2.png',
      isVideo: true,
      progress: 100,
      isStatic: true
    },
    {
      id: 'static-video-2',
      name: '405EEBD-7DC821-4524...',
      formattedSize: '34k',
      size: 34 * 1024,
      status: 'success' as const,
      thumbnailUrl: '/images/video-thumbnail-1.png',
      isVideo: true,
      progress: 100,
      isStatic: true
    },
    {
      id: 'static-video-3',
      name: 'H738J-BGH89.mp4',
      formattedSize: '128k',
      size: 128 * 1024,
      status: 'uploading' as const,
      thumbnailUrl: '/images/video-thumbnail-3.png',
      isVideo: true,
      progress: 46,
      isStatic: true
    },
    {
      id: 'static-video-4',
      name: 'H738J-BGH89.mp4',
      formattedSize: '128k',
      size: 128 * 1024,
      status: 'error' as const,
      isVideo: true,
      progress: 0,
      isStatic: true
    }
  ]
}

// 创建静态图片数据项
export const createStaticImageItems = (): StaticUploadItem[] => {
  return [
    {
      id: 'static-image-1',
      name: 'sample-image.jpg',
      formattedSize: '128KB',
      size: 128 * 1024,
      status: 'success' as const,
      previewUrl: '/images/video-thumbnail-1.png',
      isVideo: false,
      progress: 100,
      isStatic: true
    },
    {
      id: 'static-image-2',
      name: 'uploading-image.png',
      formattedSize: '86KB',
      size: 86 * 1024,
      status: 'uploading' as const,
      previewUrl: '/images/video-thumbnail-3.png',
      isVideo: false,
      progress: 35,
      isStatic: true
    },
    {
      id: 'static-image-3',
      name: 'failed-image.jpg',
      formattedSize: '256KB',
      size: 256 * 1024,
      status: 'error' as const,
      isVideo: false,
      progress: 0,
      isStatic: true
    }
  ]
}

// 生成视频缩略图
export const generateThumbnail = async (file: File, isVideo: boolean): Promise<string> => {
  return new Promise((resolve) => {
    if (isVideo) {
      // 模拟视频缩略图，实际项目中应该生成视频缩略图
      const thumbnails = [
        '/images/video-thumbnail-1.png',
        '/images/video-thumbnail-2.png',
        '/images/video-thumbnail-3.png'
      ]
      resolve(thumbnails[Math.floor(Math.random() * thumbnails.length)])
    } else {
      // 生成图片预览
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  })
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 创建上传项
export const createUploadItem = async (file: File, isVideo: boolean): Promise<UploadItem> => {
  return {
    id: uuidv4(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: 'uploading',
    isVideo,
    isStatic: false,
    formattedSize: formatFileSize(file.size),
    previewUrl: isVideo ? undefined : await generateThumbnail(file, false),
    thumbnailUrl: isVideo ? await generateThumbnail(file, true) : undefined
  }
}

// 开始上传
export const startUpload = async (item: UploadItem): Promise<void> => {
  // 静态数据不需要实际上传
  if (item.isStatic) {
    return simulateUpload(item)
  }

  try {
    const uploadFn = item.isVideo ? uploadVideo : uploadImage
    const controller = await uploadFn({
      file: item.file,
      onProgress: (progress: number) => {
        item.progress = progress
      },
      onSuccess: (response: any) => {
        item.status = 'success'
        item.resourceId = response.id
        console.log('上传成功:', response)
      },
      onError: (error: any) => {
        item.status = 'error'
        console.error('上传出错:', error)
      }
    })

    // 保存上传控制器
    item.uploadController = controller
  } catch (error) {
    item.status = 'error'
    console.error('启动上传失败:', error)
  }
}

// 上传文件函数 (用于组件调用)
export const uploadFile = async (item: UploadItem, apiBaseUrl: string): Promise<void> => {
  if (item.isStatic) {
    return simulateUpload(item)
  }
  
  return startUpload(item)
}

// 模拟上传进度（用于静态数据）
export const simulateUpload = (item: UploadItem): void => {
  if (item.status !== 'uploading') return

  let progress = item.progress || 0
  const interval = setInterval(() => {
    progress += 5
    item.progress = progress
    
    if (progress >= 100) {
      clearInterval(interval)
      item.status = 'success'
      item.progress = 100
    }
  }, 200)
}

// 删除资源
export const deleteResource = async (item: UploadItem): Promise<void> => {
  // 静态数据不需要实际删除
  if (item.isStatic) return Promise.resolve()
  
  if (item.status === 'success' && item.resourceId) {
    const deleteFn = item.isVideo ? deleteVideo : deleteImage
    try {
      await deleteFn(item.resourceId)
    } catch (error) {
      console.error('删除失败:', error)
      throw error
    }
  }
} 
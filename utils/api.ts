import { useRuntimeConfig } from 'nuxt/app'

interface UploadProgressCallback {
  (progress: number): void
}

interface UploadOptions {
  file: File
  onProgress?: UploadProgressCallback
  onError?: (error: any) => void
  onSuccess?: (response: any) => void
}

// 创建上传视频的函数
export const uploadVideo = async ({ file, onProgress, onError, onSuccess }: UploadOptions) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  const formData = new FormData()
  formData.append('file', file)

  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${apiBase}upload/video`, true)
    
    // 处理上传进度
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    }
    
    // 处理完成事件
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          onSuccess && onSuccess(response)
        } catch (error) {
          onError && onError(new Error('解析响应失败'))
        }
      } else {
        onError && onError(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
      }
    }
    
    // 处理错误
    xhr.onerror = () => {
      onError && onError(new Error('网络错误'))
    }
    
    // 处理超时
    xhr.ontimeout = () => {
      onError && onError(new Error('上传超时'))
    }
    
    // 发送请求
    xhr.send(formData)
    
    // 返回终止上传的方法
    return {
      abort: () => xhr.abort()
    }
  } catch (error) {
    onError && onError(error)
    return { abort: () => {} }
  }
}

// 删除视频的函数
export const deleteVideo = async (videoId: string) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  try {
    const response = await fetch(`${apiBase}upload/video/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('删除视频出错:', error)
    throw error
  }
}

// 上传图片的函数
export const uploadImage = async ({ file, onProgress, onError, onSuccess }: UploadOptions) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  const formData = new FormData()
  formData.append('file', file)

  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${apiBase}upload/image`, true)
    
    // 处理上传进度
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    }
    
    // 处理完成事件
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          onSuccess && onSuccess(response)
        } catch (error) {
          onError && onError(new Error('解析响应失败'))
        }
      } else {
        onError && onError(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
      }
    }
    
    // 处理错误
    xhr.onerror = () => {
      onError && onError(new Error('网络错误'))
    }
    
    // 处理超时
    xhr.ontimeout = () => {
      onError && onError(new Error('上传超时'))
    }
    
    // 发送请求
    xhr.send(formData)
    
    // 返回终止上传的方法
    return {
      abort: () => xhr.abort()
    }
  } catch (error) {
    onError && onError(error)
    return { abort: () => {} }
  }
}

// 删除图片的函数
export const deleteImage = async (imageId: string) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  try {
    const response = await fetch(`${apiBase}upload/image/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('删除图片出错:', error)
    throw error
  }
} 
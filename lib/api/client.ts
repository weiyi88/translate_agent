import { API_CONFIG, ApiResponse, TaskResult, UsageStats } from "./types"

/**
 * API 客户端类
 */
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.baseUrl + endpoint
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        return { error: error.error || error.detail || "HTTP " + response.status }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Network error" }
    }
  }

  /**
   * 上传文件并创建翻译任务
   */
  async uploadAndTranslate(
    file: File,
    targetLanguage: string,
    model: string = "gpt-4"
  ): Promise<ApiResponse<{ task_id: string; status: string; message: string }>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("target_language", targetLanguage)
    formData.append("model", model)

    try {
      const response = await fetch(this.baseUrl + API_CONFIG.ENDPOINTS.TRANSLATE_UPLOAD, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        return { error: error.detail || error.error || "Upload failed: " + response.statusText }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Upload failed" }
    }
  }

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<ApiResponse<TaskResult>> {
    return this.request<TaskResult>(API_CONFIG.ENDPOINTS.TRANSLATE_STATUS + "/" + taskId)
  }

  /**
   * 下载翻译结果
   */
  getDownloadUrl(taskId: string): string {
    return this.baseUrl + API_CONFIG.ENDPOINTS.TRANSLATE_DOWNLOAD + "/" + taskId
  }

  /**
   * 查询历史记录
   */
  async getHistory(params?: {
    page?: number
    page_size?: number
    status?: string
    file_type?: string
  }): Promise<ApiResponse<{
    total: number
    page: number
    page_size: number
    items: TaskResult[]
  }>> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", params.page.toString())
    if (params?.page_size) query.append("page_size", params.page_size.toString())
    if (params?.status) query.append("status", params.status)
    if (params?.file_type) query.append("file_type", params.file_type)

    const queryStr = query.toString()
    const queryString = queryStr ? "?" + queryStr : ""
    return this.request(API_CONFIG.ENDPOINTS.HISTORY + queryString)
  }

  /**
   * 查询历史记录详情
   */
  async getHistoryDetail(taskId: string): Promise<ApiResponse<TaskResult>> {
    return this.request<TaskResult>(API_CONFIG.ENDPOINTS.HISTORY + "/" + taskId)
  }

  /**
   * 查询本月用量统计
   */
  async getUsage(): Promise<ApiResponse<UsageStats>> {
    try {
      const response = await fetch('/api/usage')
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        return { error: error.error || 'HTTP ' + response.status }
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' }
    }
  }

  /**
   * 删除历史记录
   */
  async deleteHistory(taskId: string, deleteFiles: boolean = true): Promise<ApiResponse<{
    success: boolean
    message: string
    deleted_files?: string[]
  }>> {
    const query = deleteFiles ? "?delete_files=true" : ""
    return this.request(API_CONFIG.ENDPOINTS.HISTORY + "/" + taskId + query, {
      method: "DELETE",
    })
  }

  /**
   * 轮询任务状态（直到完成或失败）
   */
  async pollTaskStatus(
    taskId: string,
    onProgress?: (result: TaskResult) => void,
    interval = 2000,
    maxAttempts = 300
  ): Promise<ApiResponse<TaskResult>> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.getTaskStatus(taskId)

      if (response.error) {
        return response
      }

      if (response.data) {
        onProgress?.(response.data)

        if (response.data.status === "completed" || response.data.status === "failed") {
          return response
        }
      }

      await new Promise(resolve => setTimeout(resolve, interval))
    }

    return { error: "Polling timeout" }
  }
}

// 导出单例实例
export const apiClient = new ApiClient()

// 导出类型
export type { ApiResponse, TaskResult }

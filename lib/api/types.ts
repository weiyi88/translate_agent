/**
 * API 配置
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ENDPOINTS: {
    TRANSLATE_UPLOAD: "/api/translate/upload",
    TRANSLATE_STATUS: "/api/translate/status",
    TRANSLATE_DOWNLOAD: "/api/translate/download",
    HISTORY: "/api/translate/history",
  },
}

/**
 * API 响应类型
 */
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

/**
 * 任务状态类型
 */
export type TaskStatus = "pending" | "queued" | "processing" | "completed" | "failed"

/**
 * 翻译任务
 */
export interface TranslationTask {
  task_id: string
  status: TaskStatus
  file_path: string
  file_type: string
  target_language: string
  model: string
  priority: number
  created_at: string
  started_at?: string
  completed_at?: string
  error?: string
  depends_on?: string[]
}

/**
 * 任务结果
 */
export interface TaskResult extends TranslationTask {
  output_path?: string
  progress: number
}

/**
 * 用量统计
 */
export interface UsageStats {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'TRIAL'
  translations_used: number
  translations_limit: number | null  // null = unlimited
  characters_used: number
  characters_limit: number | null    // null = unlimited
  period_start: string
  period_end: string
}

/**
 * 创建任务请求
 */
export interface TaskCreateRequest {
  file_path: string
  file_type: "pptx" | "docx" | "xlsx" | "pdf"
  target_language: string
  model: string
  priority?: number
  depends_on?: string[]
}

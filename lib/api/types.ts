// API Types

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  ENDPOINTS: {
    TRANSLATE_UPLOAD: '/api/translate',
    TRANSLATE_STATUS: '/api/translate',
    TRANSLATE_DOWNLOAD: '/api/translate',
    HISTORY: '/api/history',
    USAGE: '/api/usage',
    GLOSSARY: '/api/glossary',
  },
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export type TaskStatus = 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELED'

export interface TaskResult {
  id: string
  task_id?: string
  fileName?: string
  file_name?: string
  fileType?: string
  file_type?: string
  sourceLanguage?: string | null
  targetLanguage?: string
  model?: string
  status: string
  progress: number
  outputPath?: string | null
  errorMessage?: string | null
  error_message?: string | null
  createdAt?: string
  created_at?: string
  startedAt?: string | null
  completedAt?: string | null
}

export interface TranslationTask extends TaskResult {}

export interface TaskCreateRequest {
  file: File
  targetLanguage: string
  model?: string
  glossaryId?: string
}

export interface UsageStats {
  currentPeriodPages?: number
  pagesLimit?: number | null
  currentPeriodTokens?: number
  plan?: string
  translations_used?: number
  translations_limit?: number | null
  characters_used?: number
  characters_limit?: number | null
}

export interface GlossaryItem {
  id: string
  name: string
  description?: string | null
  targetLanguage: string
  termCount: number
  isShared: boolean
  createdAt: string
  updatedAt: string
}

export interface TermItem {
  id: string
  glossaryId: string
  source: string
  target: string
  context?: string | null
  category?: string | null
  createdAt: string
  updatedAt: string
}

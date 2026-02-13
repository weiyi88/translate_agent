/**
 * LLM 翻译服务类型定义
 */

/**
 * 翻译选项
 */
export interface TranslateOptions {
  sourceLanguage?: string | null
  targetLanguage: string
  model: string
  glossaryTerms?: Array<{ source: string; target: string }>
  context?: string // 上下文（前一段内容）
}

/**
 * 翻译结果
 */
export interface TranslateResult {
  translatedText: string
  model: string
  tokensUsed?: number
}

/**
 * 批量翻译选项
 */
export interface BatchTranslateOptions extends TranslateOptions {
  texts: string[]
  maxConcurrent?: number // 最大并发数
  retryAttempts?: number // 重试次数
}

/**
 * 批量翻译结果
 */
export interface BatchTranslateResult {
  translations: string[]
  totalTokensUsed: number
  failedIndexes: number[]
}

/**
 * LLM 提供商类型
 */
export type LLMProvider = 'openai' | 'claude' | 'moonshot' | 'siliconflow'

/**
 * LLM 翻译服务接口
 */
export interface LLMTranslateService {
  provider: LLMProvider

  /**
   * 翻译单个文本
   */
  translate(text: string, options: TranslateOptions): Promise<TranslateResult>

  /**
   * 批量翻译（带并发控制）
   */
  translateBatch(options: BatchTranslateOptions): Promise<BatchTranslateResult>
}

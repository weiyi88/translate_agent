/**
 * Claude (Anthropic) 翻译服务
 */

import Anthropic from '@anthropic-ai/sdk'
import pLimit from 'p-limit'
import pRetry from 'p-retry'
import {
  LLMTranslateService,
  TranslateOptions,
  TranslateResult,
  BatchTranslateOptions,
  BatchTranslateResult,
} from './types'

export class ClaudeTranslateService implements LLMTranslateService {
  public provider = 'claude' as const
  private client: Anthropic

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    })
  }

  /**
   * 构建翻译 System Prompt
   */
  private buildSystemPrompt(options: TranslateOptions): string {
    let prompt = `你是专业翻译助手。请将以下内容翻译为${options.targetLanguage}。\n\n`

    prompt += `## 要求\n`
    prompt += `1. 保持原文语气和风格\n`
    prompt += `2. 专业术语使用术语表中的译法（如有）\n`
    prompt += `3. 保留所有标点符号的相对位置\n`
    prompt += `4. 不要添加或删除内容\n`
    prompt += `5. 如遇到无法翻译的内容（如代码、URL），保持原样\n`
    prompt += `6. 直接输出翻译结果，不要添加任何解释\n\n`

    // 添加术语表
    if (options.glossaryTerms && options.glossaryTerms.length > 0) {
      prompt += `## 术语表\n`
      for (const term of options.glossaryTerms) {
        prompt += `- ${term.source} → ${term.target}\n`
      }
      prompt += `\n`
    }

    // 添加上下文
    if (options.context) {
      prompt += `## 上下文（前一段内容）\n`
      prompt += `${options.context}\n\n`
    }

    return prompt
  }

  /**
   * 翻译单个文本
   */
  async translate(text: string, options: TranslateOptions): Promise<TranslateResult> {
    const systemPrompt = this.buildSystemPrompt(options)

    const response = await this.client.messages.create({
      model: options.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    })

    const translatedText =
      response.content[0]?.type === 'text' ? response.content[0].text : ''

    return {
      translatedText: translatedText.trim(),
      model: response.model,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    }
  }

  /**
   * 批量翻译（带并发控制和重试）
   */
  async translateBatch(options: BatchTranslateOptions): Promise<BatchTranslateResult> {
    const { texts, maxConcurrent = 3, retryAttempts = 3 } = options

    const limit = pLimit(maxConcurrent)
    const translations: string[] = []
    const failedIndexes: number[] = []
    let totalTokensUsed = 0

    // 创建翻译任务
    const tasks = texts.map((text, index) =>
      limit(async () => {
        try {
          // 使用 p-retry 进行重试
          const result = await pRetry(
            async () => {
              return this.translate(text, {
                ...options,
                // 可选：传递前一段作为上下文
                context: index > 0 ? texts[index - 1].substring(0, 200) : undefined,
              })
            },
            {
              retries: retryAttempts,
              onFailedAttempt: (error) => {
                console.log(
                  `[Claude] Translation attempt ${error.attemptNumber} failed for segment ${index}. ${error.retriesLeft} retries left.`
                )
              },
            }
          )

          translations[index] = result.translatedText
          totalTokensUsed += result.tokensUsed || 0
        } catch (error) {
          console.error(`[Claude] Failed to translate segment ${index}:`, error)
          translations[index] = text // 失败时保留原文
          failedIndexes.push(index)
        }
      })
    )

    // 等待所有翻译完成
    await Promise.all(tasks)

    return {
      translations,
      totalTokensUsed,
      failedIndexes,
    }
  }

  /**
   * 优化版批量翻译：合并短文本为一批
   */
  async translateBatchMerged(
    options: BatchTranslateOptions,
    mergeSize: number = 8
  ): Promise<BatchTranslateResult> {
    const { texts } = options
    const translations: string[] = []
    const failedIndexes: number[] = []
    let totalTokensUsed = 0

    // 将文本分组
    const batches: string[][] = []
    for (let i = 0; i < texts.length; i += mergeSize) {
      batches.push(texts.slice(i, i + mergeSize))
    }

    // 翻译每一批
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      const startIndex = batchIndex * mergeSize

      try {
        // 合并文本，用特殊分隔符
        const mergedText = batch.join('\n---SEP---\n')

        const result = await this.translate(mergedText, {
          ...options,
          context: undefined,
        })

        // 拆分翻译结果
        const translatedBatch = result.translatedText.split(/\n?---SEP---\n?/)

        // 填充结果
        for (let i = 0; i < batch.length; i++) {
          translations[startIndex + i] = translatedBatch[i] || batch[i]
        }

        totalTokensUsed += result.tokensUsed || 0
      } catch (error) {
        console.error(`[Claude] Failed to translate batch ${batchIndex}:`, error)

        // 失败时保留原文
        for (let i = 0; i < batch.length; i++) {
          const index = startIndex + i
          translations[index] = batch[i]
          failedIndexes.push(index)
        }
      }
    }

    return {
      translations,
      totalTokensUsed,
      failedIndexes,
    }
  }
}

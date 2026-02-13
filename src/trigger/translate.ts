import { task } from '@trigger.dev/sdk/v3'
import { prisma } from '@/lib/prisma'
import { join } from 'path'
import { parseDocx, getTranslatableSegments, generateTranslatedDocx } from '@/lib/services/docx'
import { parsePPTX, generateTranslatedPPTX } from '@/lib/services/pptx'
import { createServiceFromModel } from '@/lib/services/llm'

/**
 * Trigger.dev 翻译任务
 *
 * 这个任务会：
 * 1. 更新任务状态为 PROCESSING
 * 2. 解析文件内容（DOCX 解析器）
 * 3. 调用 LLM 翻译（批量并发）
 * 4. 保存翻译结果（生成新 DOCX）
 * 5. 更新任务状态为 COMPLETED
 */

export interface TranslateTaskPayload {
  taskId: string
  userId: string
}

export const translateTask = task({
  id: 'translate-document',
  // 最长运行 30 分钟
  maxDuration: 1800,
  run: async (payload: TranslateTaskPayload) => {
    const { taskId, userId } = payload

    console.log(`[Trigger.dev] Starting translation task ${taskId} for user ${userId}`)

    try {
      // 1. 获取任务信息
      const task = await prisma.translationTask.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        throw new Error(`Task ${taskId} not found`)
      }

      if (task.userId !== userId) {
        throw new Error(`Task ${taskId} does not belong to user ${userId}`)
      }

      // 2. 更新状态为 PROCESSING
      await prisma.translationTask.update({
        where: { id: taskId },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
          progress: 0,
        },
      })

      // 3. 根据文件类型处理
      let outputPath: string

      if (task.fileType === 'DOCX') {
        outputPath = await translateDocxFile(task, taskId, userId)
      } else if (task.fileType === 'PPTX') {
        outputPath = await translatePPTXFile(task, taskId, userId)
      } else {
        // TODO: 实现其他文件类型 (XLSX, PDF)
        throw new Error(`File type ${task.fileType} not implemented yet`)
      }

      await prisma.translationTask.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
          outputPath,
        },
      })

      console.log(`[Trigger.dev] Task ${taskId} completed successfully`)

      return {
        success: true,
        taskId,
        outputPath,
      }
    } catch (error) {
      console.error(`[Trigger.dev] Task ${taskId} failed:`, error)

      // 更新任务状态为 FAILED
      await prisma.translationTask.update({
        where: { id: taskId },
        data: {
          status: 'FAILED',
          errorType: 'SYSTEM_ERROR',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      })

      throw error
    }
  },
})

/**
 * 翻译 DOCX 文件
 */
async function translateDocxFile(
  task: {
    id: string
    filePath: string
    targetLanguage: string
    sourceLanguage: string | null
    model: string
    glossaryId: string | null
  },
  taskId: string,
  userId: string
): Promise<string> {
  const { filePath, targetLanguage, sourceLanguage, model, glossaryId } = task

  // 1. 解析 DOCX 文件 (进度 0-10%)
  console.log(`[DOCX] Parsing file: ${filePath}`)
  await updateProgress(taskId, 5, '解析文档中...')

  const absolutePath = join(process.cwd(), filePath)
  const parsedDocx = await parseDocx(absolutePath)

  console.log(
    `[DOCX] Parsed: ${parsedDocx.metadata.totalParagraphs} paragraphs, ${parsedDocx.metadata.totalTables} tables, ${parsedDocx.metadata.totalChars} chars`
  )

  await updateProgress(taskId, 10, '文档解析完成')

  // 2. 提取需要翻译的文本 (进度 10-15%)
  const segments = getTranslatableSegments(parsedDocx)

  console.log(`[DOCX] Found ${segments.length} segments to translate`)
  await updateProgress(taskId, 15, `准备翻译 ${segments.length} 个段落`)

  if (segments.length === 0) {
    console.log(`[DOCX] No text to translate, copying original file`)

    // 没有文本需要翻译，直接复制原文件
    const outputPath = `output/${taskId}-translated.docx`
    const fs = require('fs/promises')
    await fs.copyFile(absolutePath, join(process.cwd(), outputPath))

    await updateProgress(taskId, 100, '完成（无需翻译）')

    return outputPath
  }

  // 3. 加载术语表 (如果有)
  let glossaryTerms: Array<{ source: string; target: string }> = []

  if (glossaryId) {
    const terms = await prisma.term.findMany({
      where: { glossaryId },
    })
    glossaryTerms = terms.map((t) => ({ source: t.source, target: t.target }))
    console.log(`[DOCX] Loaded ${glossaryTerms.length} glossary terms`)
  }

  // 4. 创建 LLM 服务
  const llmService = createServiceFromModel(model)

  console.log(`[DOCX] Using LLM provider: ${llmService.provider}, model: ${model}`)

  // 5. 批量翻译文本 (进度 15-85%)
  await updateProgress(taskId, 15, '开始翻译...')

  const texts = segments.map((s) => s.text)

  const batchResult = await llmService.translateBatch({
    texts,
    targetLanguage,
    sourceLanguage,
    model,
    glossaryTerms,
    maxConcurrent: 3, // 并发数
    retryAttempts: 3, // 重试次数
  })

  console.log(
    `[DOCX] Translation completed: ${batchResult.translations.length} segments, ${batchResult.totalTokensUsed} tokens used`
  )

  if (batchResult.failedIndexes.length > 0) {
    console.warn(`[DOCX] ${batchResult.failedIndexes.length} segments failed to translate`)
  }

  await updateProgress(taskId, 85, '翻译完成，生成文档中...')

  // 6. 记录 token 使用量
  await prisma.translationTask.update({
    where: { id: taskId },
    data: {
      tokensUsed: batchResult.totalTokensUsed,
    },
  })

  // 7. 构建翻译映射 (segment index -> translated text)
  const translationMap = new Map<number, string>()

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const translatedText = batchResult.translations[i]

    // 使用 segment.index 作为 key
    translationMap.set(segment.index, translatedText)
  }

  // 8. 生成翻译后的 DOCX 文件 (进度 85-95%)
  const outputPath = `output/${taskId}-translated.docx`
  const absoluteOutputPath = join(process.cwd(), outputPath)

  console.log(`[DOCX] Generating translated document: ${outputPath}`)

  await generateTranslatedDocx(parsedDocx, translationMap, absoluteOutputPath)

  await updateProgress(taskId, 95, '文档生成完成')

  console.log(`[DOCX] Translation complete: ${outputPath}`)

  // 9. 保存使用日志
  await prisma.usageLog.create({
    data: {
      userId: userId,
      taskId: taskId,
      provider: llmService.provider.toUpperCase(),
      model: model,
      inputTokens: Math.floor(batchResult.totalTokensUsed * 0.6), // 估算
      outputTokens: Math.floor(batchResult.totalTokensUsed * 0.4), // 估算
      totalCost: 0, // TODO: 根据模型计算成本
    },
  })

  return outputPath
}

/**
 * 更新任务进度
 */
async function updateProgress(taskId: string, progress: number, statusText?: string): Promise<void> {
  await prisma.translationTask.update({
    where: { id: taskId },
    data: {
      progress,
      statusText: statusText || null,
    },
  })

  console.log(`[Progress] Task ${taskId}: ${progress}% - ${statusText || ''}`)
}

/**
 * 翻译 PPTX 文件
 */
async function translatePPTXFile(
  task: {
    id: string
    filePath: string
    targetLanguage: string
    sourceLanguage: string | null
    model: string
    glossaryId: string | null
  },
  taskId: string,
  userId: string
): Promise<string> {
  const { filePath, targetLanguage, sourceLanguage, model, glossaryId } = task

  // 1. 解析 PPTX 文件 (进度 0-10%)
  console.log(`[PPTX] Parsing file: ${filePath}`)
  await updateProgress(taskId, 5, '解析演示文稿中...')

  const absolutePath = join(process.cwd(), filePath)
  const parsedPPTX = await parsePPTX(absolutePath)

  console.log(
    `[PPTX] Parsed: ${parsedPPTX.metadata.totalSlides} slides, ${parsedPPTX.metadata.totalElements} elements, ${parsedPPTX.metadata.totalChars} chars`
  )

  await updateProgress(taskId, 10, '演示文稿解析完成')

  // 2. 统计需要翻译的文本 (进度 10-15%)
  const allElements = parsedPPTX.slides.flatMap((slide) => slide.elements)
  const translatableElements = allElements.filter(
    (element) => !require('@/lib/services/pptx').shouldSkipTranslation(element.text)
  )

  console.log(
    `[PPTX] Found ${translatableElements.length} elements to translate (out of ${allElements.length} total)`
  )
  await updateProgress(taskId, 15, `准备翻译 ${translatableElements.length} 个文本元素`)

  if (translatableElements.length === 0) {
    console.log(`[PPTX] No text to translate, copying original file`)

    // 没有文本需要翻译，直接复制原文件
    const outputPath = `output/${taskId}-translated.pptx`
    const fs = require('fs/promises')
    await fs.copyFile(absolutePath, join(process.cwd(), outputPath))

    await updateProgress(taskId, 100, '完成（无需翻译）')

    return outputPath
  }

  // 3. 加载术语表 (如果有)
  let glossaryTerms: Array<{ source: string; target: string }> = []

  if (glossaryId) {
    const terms = await prisma.term.findMany({
      where: { glossaryId },
    })
    glossaryTerms = terms.map((t) => ({ source: t.source, target: t.target }))
    console.log(`[PPTX] Loaded ${glossaryTerms.length} glossary terms`)
  }

  // 4. 创建 LLM 服务
  const llmService = createServiceFromModel(model)

  console.log(`[PPTX] Using LLM provider: ${llmService.provider}, model: ${model}`)

  // 5. 逐页翻译 (进度 15-85%)
  const totalSlides = parsedPPTX.slides.length
  const progressPerSlide = 70 / totalSlides // 15% -> 85% 共 70%

  const translatedSlides: Array<{
    slideNumber: number
    elements: Array<{
      translatedText: string
      position: any
      metadata: any
    }>
  }> = []

  let totalTokensUsed = 0

  for (let i = 0; i < parsedPPTX.slides.length; i++) {
    const slide = parsedPPTX.slides[i]
    const slideNum = i + 1

    console.log(`[PPTX] Translating slide ${slideNum}/${totalSlides}`)
    await updateProgress(
      taskId,
      Math.floor(15 + i * progressPerSlide),
      `正在翻译第 ${slideNum}/${totalSlides} 页...`
    )

    // 提取当前页的文本
    const slideTexts = slide.elements
      .filter((element) => !require('@/lib/services/pptx').shouldSkipTranslation(element.text))
      .map((element) => element.text)

    if (slideTexts.length === 0) {
      // 该页无需翻译
      translatedSlides.push({
        slideNumber: slide.slideNumber,
        elements: slide.elements.map((element) => ({
          translatedText: element.text,
          position: element.position,
          metadata: element.metadata,
        })),
      })
      continue
    }

    // 翻译当前页
    const batchResult = await llmService.translateBatch({
      texts: slideTexts,
      targetLanguage,
      sourceLanguage,
      model,
      glossaryTerms,
      maxConcurrent: 3,
      retryAttempts: 3,
    })

    totalTokensUsed += batchResult.totalTokensUsed

    // 构建翻译后的元素
    let translationIndex = 0
    const translatedElements = slide.elements.map((element) => {
      const shouldTranslate = !require('@/lib/services/pptx').shouldSkipTranslation(element.text)

      if (shouldTranslate) {
        const translatedText = batchResult.translations[translationIndex]
        translationIndex++

        return {
          translatedText,
          position: element.position,
          metadata: element.metadata,
        }
      } else {
        // 不翻译，保留原文
        return {
          translatedText: element.text,
          position: element.position,
          metadata: element.metadata,
        }
      }
    })

    translatedSlides.push({
      slideNumber: slide.slideNumber,
      elements: translatedElements,
    })

    console.log(
      `[PPTX] Slide ${slideNum} translated: ${slideTexts.length} elements, ${batchResult.totalTokensUsed} tokens`
    )
  }

  console.log(`[PPTX] All slides translated, total tokens used: ${totalTokensUsed}`)

  await updateProgress(taskId, 85, '翻译完成，生成演示文稿中...')

  // 6. 记录 token 使用量
  await prisma.translationTask.update({
    where: { id: taskId },
    data: {
      tokensUsed: totalTokensUsed,
    },
  })

  // 7. 生成翻译后的 PPTX 文件 (进度 85-95%)
  const outputPath = `output/${taskId}-translated.pptx`
  const absoluteOutputPath = join(process.cwd(), outputPath)

  console.log(`[PPTX] Generating translated presentation: ${outputPath}`)

  const translatedPPTX = {
    slides: translatedSlides,
    metadata: {
      totalTranslated: translatableElements.length,
      totalSkipped: allElements.length - translatableElements.length,
    },
  }

  await generateTranslatedPPTX(absolutePath, translatedPPTX, absoluteOutputPath)

  await updateProgress(taskId, 95, '演示文稿生成完成')

  console.log(`[PPTX] Translation complete: ${outputPath}`)

  // 8. 保存使用日志
  await prisma.usageLog.create({
    data: {
      userId: userId,
      taskId: taskId,
      provider: llmService.provider.toUpperCase(),
      model: model,
      inputTokens: Math.floor(totalTokensUsed * 0.6), // 估算
      outputTokens: Math.floor(totalTokensUsed * 0.4), // 估算
      totalCost: 0, // TODO: 根据模型计算成本
    },
  })

  return outputPath
}


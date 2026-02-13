import { task } from '@trigger.dev/sdk/v3'
import { prisma } from '@/lib/prisma'
import { join } from 'path'

/**
 * Trigger.dev 翻译任务
 *
 * 这个任务会：
 * 1. 更新任务状态为 PROCESSING
 * 2. 解析文件内容（TODO: Task #8）
 * 3. 调用 LLM 翻译（TODO: Task #9）
 * 4. 保存翻译结果（TODO: Task #10）
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

      // 3. 模拟翻译过程（TODO: 后续实现真实翻译逻辑）
      // 这里先用简单的进度更新来演示 trigger.dev 工作流
      const steps = 10
      for (let i = 1; i <= steps; i++) {
        // 等待一段时间模拟处理
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // 更新进度
        const progress = (i / steps) * 100
        await prisma.translationTask.update({
          where: { id: taskId },
          data: { progress },
        })

        console.log(`[Trigger.dev] Task ${taskId} progress: ${progress}%`)
      }

      // 4. 标记为完成
      const outputPath = `output/${taskId}-translated.${task.fileType.toLowerCase()}`

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

/**
 * 简单的内存任务队列
 * 用于处理翻译任务
 *
 * TODO: 生产环境应该使用 Redis + Bull/BullMQ 或 trigger.dev
 */

import { prisma } from './prisma'

interface TranslationJob {
  taskId: string
  userId: string
}

class TranslationQueue {
  private queue: TranslationJob[] = []
  private processing = false

  async add(job: TranslationJob) {
    this.queue.push(job)
    console.log(`[Queue] Added job for task ${job.taskId}`)

    // 开始处理队列（如果还没有在处理）
    if (!this.processing) {
      this.processQueue()
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false
      return
    }

    this.processing = true
    const job = this.queue.shift()

    if (!job) {
      this.processing = false
      return
    }

    try {
      console.log(`[Queue] Processing task ${job.taskId}`)

      // 更新任务状态为 PROCESSING
      await prisma.translationTask.update({
        where: { id: job.taskId },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
        },
      })

      // TODO: 调用翻译服务
      // 这里先模拟处理
      await this.simulateTranslation(job.taskId)

      console.log(`[Queue] Completed task ${job.taskId}`)
    } catch (error) {
      console.error(`[Queue] Error processing task ${job.taskId}:`, error)

      // 更新任务状态为 FAILED
      await prisma.translationTask.update({
        where: { id: job.taskId },
        data: {
          status: 'FAILED',
          errorType: 'SYSTEM_ERROR',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }

    // 继续处理下一个任务
    setTimeout(() => this.processQueue(), 100)
  }

  private async simulateTranslation(taskId: string) {
    // 模拟翻译过程
    const steps = 10
    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await prisma.translationTask.update({
        where: { id: taskId },
        data: {
          progress: (i / steps) * 100,
        },
      })
    }

    // 标记为完成
    await prisma.translationTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        outputPath: `output/${taskId}-translated.docx`, // 临时路径
      },
    })
  }

  getQueueLength() {
    return this.queue.length
  }

  isProcessing() {
    return this.processing
  }
}

// 单例实例
export const translationQueue = new TranslationQueue()

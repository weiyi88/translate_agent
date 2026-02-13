import { tasks } from '@trigger.dev/sdk/v3'

/**
 * Trigger.dev 客户端配置
 *
 * 用于在 API 路由中触发后台任务
 */

// 导出触发任务的函数
export async function triggerTranslation(taskId: string, userId: string) {
  // 动态导入任务以避免循环依赖
  const { translateTask } = await import('@/src/trigger/translate')

  const handle = await tasks.trigger<typeof translateTask>(
    'translate-document',
    {
      taskId,
      userId,
    }
  )

  console.log(`[Trigger] Triggered translation task ${taskId} with handle ${handle.id}`)

  return handle
}

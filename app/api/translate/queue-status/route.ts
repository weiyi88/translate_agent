import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { translationQueue } from '@/lib/translation-queue'

/**
 * GET /api/translate/queue-status
 * 查询翻译队列状态
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录（可选，管理员功能）
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      queueLength: translationQueue.getQueueLength(),
      isProcessing: translationQueue.isProcessing(),
    })
  } catch (error) {
    console.error('Queue status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

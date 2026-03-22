import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/usage
 * 获取当前用户本月用量统计
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 查询订阅信息
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        plan: true,
        status: true,
        translationPagesLimit: true,
        characterLimit: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
      },
    })

    // 确定统计周期起始时间（有订阅周期用订阅周期，否则用本月第一天）
    const now = new Date()
    const periodStart = subscription?.currentPeriodStart ?? new Date(now.getFullYear(), now.getMonth(), 1)
    const periodEnd = subscription?.currentPeriodEnd ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // 聚合本周期内翻译用量
    const usageAgg = await prisma.usageLog.aggregate({
      where: {
        userId,
        action: 'TRANSLATION',
        createdAt: { gte: periodStart },
      },
      _sum: {
        pagesCount: true,
        tokensUsed: true,
      },
    })

    return NextResponse.json({
      plan: subscription?.plan ?? 'FREE',
      status: subscription?.status ?? 'ACTIVE',
      translations_used: usageAgg._sum.pagesCount ?? 0,
      translations_limit: subscription?.translationPagesLimit ?? null,
      characters_used: usageAgg._sum.tokensUsed ?? 0,
      characters_limit: subscription?.characterLimit ?? null,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    })
  } catch (error) {
    console.error('Usage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

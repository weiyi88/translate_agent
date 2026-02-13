import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/history
 * 获取翻译历史记录
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100)
    const status = searchParams.get('status') as 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | null

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await prisma.translationTask.count({ where })

    // 查询任务列表
    const tasks = await prisma.translationTask.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        sourceLanguage: true,
        targetLanguage: true,
        model: true,
        status: true,
        progress: true,
        errorType: true,
        errorMessage: true,
        pagesCount: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
      },
    })

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

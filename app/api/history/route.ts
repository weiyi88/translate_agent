import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/history
 * 获取翻译历史记录
 *
 * TODO: 实现功能
 * 1. 分页查询历史记录
 * 2. 支持筛选和排序
 *
 * 参考 Python 实现：source_back/app/api/routes/history.py
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const status = searchParams.get('status') // pending | processing | completed | failed

    // TODO: 从数据库查询历史记录

    return NextResponse.json({
      success: false,
      message: 'History API not implemented yet',
      data: {
        tasks: [],
        total: 0,
        page,
        pageSize,
        status,
      }
    }, { status: 501 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

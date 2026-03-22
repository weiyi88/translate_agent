import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * 校验词库属于当前用户，返回 glossaryId 或错误响应
 */
async function resolveGlossary(id: string, userId: string) {
  const glossary = await prisma.glossary.findUnique({
    where: { id },
    select: { id: true, userId: true },
  })
  if (!glossary) return { error: 'Not found', status: 404 } as const
  if (glossary.userId !== userId) return { error: 'Forbidden', status: 403 } as const
  return { glossaryId: glossary.id } as const
}

/**
 * GET /api/glossary/[id]/terms
 * 获取词库术语列表，支持 search 关键词过滤
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await resolveGlossary(id, session.user.id)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const search = request.nextUrl.searchParams.get('search')?.trim()

    const terms = await prisma.term.findMany({
      where: {
        glossaryId: result.glossaryId,
        ...(search
          ? {
              OR: [
                { source: { contains: search, mode: 'insensitive' } },
                { target: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        source: true,
        target: true,
        context: true,
        category: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ terms })
  } catch (error) {
    console.error('Terms list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/glossary/[id]/terms
 * 添加术语
 * Body: { source, target, context?, category? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await resolveGlossary(id, session.user.id)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const body = await request.json()
    const { source, target, context, category } = body

    if (!source?.trim() || !target?.trim()) {
      return NextResponse.json({ error: 'source and target are required' }, { status: 400 })
    }

    // 创建术语 + 更新 termCount（事务）
    const [term] = await prisma.$transaction([
      prisma.term.create({
        data: {
          glossaryId: result.glossaryId,
          source: source.trim(),
          target: target.trim(),
          context: context?.trim() ?? null,
          category: category?.trim() ?? null,
        },
        select: {
          id: true,
          source: true,
          target: true,
          context: true,
          category: true,
          createdAt: true,
        },
      }),
      prisma.glossary.update({
        where: { id: result.glossaryId },
        data: { termCount: { increment: 1 } },
      }),
    ])

    return NextResponse.json({ term }, { status: 201 })
  } catch (error) {
    console.error('Term create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

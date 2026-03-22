import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * DELETE /api/glossary/[id]/terms/[termId]
 * 删除指定术语
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; termId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, termId } = await params

    // 校验词库属于当前用户
    const glossary = await prisma.glossary.findUnique({
      where: { id },
      select: { userId: true },
    })
    if (!glossary) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (glossary.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 校验术语属于该词库
    const term = await prisma.term.findUnique({
      where: { id: termId },
      select: { glossaryId: true },
    })
    if (!term || term.glossaryId !== id) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 })
    }

    // 删除术语 + 更新 termCount（事务）
    await prisma.$transaction([
      prisma.term.delete({ where: { id: termId } }),
      prisma.glossary.update({
        where: { id },
        data: { termCount: { decrement: 1 } },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Term delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * DELETE /api/glossary/[id]
 * 删除词库（级联删除所有术语）
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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

    await prisma.glossary.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Glossary delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

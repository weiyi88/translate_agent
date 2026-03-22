import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/glossary
 * 获取当前用户的词库列表
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const glossaries = await prisma.glossary.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        targetLanguage: true,
        termCount: true,
        isShared: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ glossaries })
  } catch (error) {
    console.error('Glossary list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/glossary
 * 创建新词库
 * Body: { name, description?, targetLanguage }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, targetLanguage } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!targetLanguage?.trim()) {
      return NextResponse.json({ error: 'Target language is required' }, { status: 400 })
    }

    const glossary = await prisma.glossary.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim() ?? null,
        targetLanguage: targetLanguage.trim(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        targetLanguage: true,
        termCount: true,
        isShared: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ glossary }, { status: 201 })
  } catch (error) {
    console.error('Glossary create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

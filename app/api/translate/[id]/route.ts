import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/translate/[id]
 * 查询指定翻译任务的状态
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证用户登录
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: taskId } = await params

    // 查询任务
    const task = await prisma.translationTask.findUnique({
      where: { id: taskId },
      include: {
        glossary: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // 验证任务所有权
    if (task.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      task: {
        id: task.id,
        fileName: task.fileName,
        fileType: task.fileType,
        sourceLanguage: task.sourceLanguage,
        targetLanguage: task.targetLanguage,
        model: task.model,
        glossary: task.glossary,
        status: task.status,
        progress: task.progress,
        outputPath: task.outputPath,
        errorType: task.errorType,
        errorMessage: task.errorMessage,
        pagesCount: task.pagesCount,
        estimatedTokens: task.estimatedTokens,
        actualTokens: task.actualTokens,
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
      },
    })
  } catch (error) {
    console.error('Get task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/translate/[id]
 * 删除指定翻译任务
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证用户登录
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: taskId } = await params

    // 查询任务
    const task = await prisma.translationTask.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // 验证任务所有权
    if (task.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 删除文件
    try {
      if (task.filePath) {
        await unlink(join(process.cwd(), task.filePath))
      }
      if (task.outputPath) {
        await unlink(join(process.cwd(), task.outputPath))
      }
    } catch (fileError) {
      console.warn('File deletion warning:', fileError)
      // 文件可能已被删除，继续删除数据库记录
    }

    // 删除数据库记录
    await prisma.translationTask.delete({
      where: { id: taskId },
    })

    return NextResponse.json({
      message: 'Task deleted successfully',
      id: taskId,
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

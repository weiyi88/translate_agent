import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/translate/[id]/download
 * 下载翻译后的文件
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户登录
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const taskId = params.id

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

    // 检查任务状态
    if (task.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Task is not completed yet', status: task.status },
        { status: 400 }
      )
    }

    if (!task.outputPath) {
      return NextResponse.json({ error: 'Output file not found' }, { status: 404 })
    }

    // 读取文件
    const filePath = join(process.cwd(), task.outputPath)
    const fileBuffer = await readFile(filePath)

    // 设置响应头
    const headers = new Headers()
    headers.set('Content-Type', getContentType(task.fileType))
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(getTranslatedFileName(task.fileName, task.targetLanguage))}"`)
    headers.set('Content-Length', fileBuffer.length.toString())

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getContentType(fileType: string): string {
  const contentTypes: Record<string, string> = {
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PDF: 'application/pdf',
  }
  return contentTypes[fileType] || 'application/octet-stream'
}

function getTranslatedFileName(originalName: string, targetLanguage: string): string {
  const parts = originalName.split('.')
  const extension = parts.pop()
  const baseName = parts.join('.')
  return `${baseName}_${targetLanguage}.${extension}`
}

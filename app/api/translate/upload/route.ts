import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { triggerTranslation } from '@/lib/trigger'

// 允许的文件类型
const ALLOWED_TYPES = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/pdf'] // PDF

const FILE_TYPE_MAP: Record<string, 'DOCX' | 'PPTX' | 'XLSX' | 'PDF'> = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/pdf': 'PDF',
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetLanguage = formData.get('targetLanguage') as string
    const sourceLanguage = (formData.get('sourceLanguage') as string) || null
    const model = (formData.get('model') as string) || 'gpt-4o-mini'
    const glossaryId = (formData.get('glossaryId') as string) || null

    // 验证文件
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only DOCX, PPTX, XLSX, and PDF are supported.' },
        { status: 400 }
      )
    }

    if (!targetLanguage) {
      return NextResponse.json({ error: 'Target language is required' }, { status: 400 })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop()
    const fileName = `${timestamp}-${originalName}`
    const filePath = join(process.cwd(), 'uploads', fileName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 创建翻译任务记录
    const task = await prisma.translationTask.create({
      data: {
        userId: session.user.id,
        fileName: originalName,
        fileType: FILE_TYPE_MAP[file.type],
        filePath: `uploads/${fileName}`,
        sourceLanguage,
        targetLanguage,
        model,
        glossaryId,
        status: 'QUEUED',
        priority: 5,
        progress: 0,
      },
    })

    // 触发 Trigger.dev 翻译任务
    const handle = await triggerTranslation(task.id, session.user.id)

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        task: {
          id: task.id,
          fileName: task.fileName,
          fileType: task.fileType,
          status: task.status,
          createdAt: task.createdAt,
        },
        triggerHandle: handle.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

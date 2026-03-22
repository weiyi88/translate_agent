import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 })
    }

    // 生成 6 位数字验证码
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const identifier = `register:${email}`
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 分钟

    // 删除旧验证码，写入新的
    await prisma.verificationToken.deleteMany({ where: { identifier } })
    await prisma.verificationToken.create({ data: { identifier, token: code, expires } })

    await sendVerificationEmail(email, code)

    return NextResponse.json({ message: '验证码已发送' })
  } catch (error) {
    console.error('send-code error:', error)
    return NextResponse.json({ error: '发送失败，请稍后重试' }, { status: 500 })
  }
}

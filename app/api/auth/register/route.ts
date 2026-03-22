import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, code } = await request.json()

    if (!email || !password || !code) {
      return NextResponse.json({ error: '邮箱、密码和验证码均为必填项' }, { status: 400 })
    }

    // 校验验证码
    const identifier = `register:${email}`
    const record = await prisma.verificationToken.findFirst({
      where: { identifier, token: code },
    })

    if (!record) {
      return NextResponse.json({ error: '验证码错误' }, { status: 400 })
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier } })
      return NextResponse.json({ error: '验证码已过期，请重新获取' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        isActive: true,
        isVerified: true,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    await prisma.subscription.create({
      data: { userId: user.id, plan: 'FREE', status: 'ACTIVE' },
    })

    // 验证码用完即删
    await prisma.verificationToken.deleteMany({ where: { identifier } })

    return NextResponse.json({ message: '注册成功', user }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

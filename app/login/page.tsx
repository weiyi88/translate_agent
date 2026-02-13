import type { Metadata } from 'next'
import { LoginLeftPanel } from '@/components/login-left-panel'
import { LoginRightPanel } from '@/components/login-right-panel'

export const metadata: Metadata = {
  title: '登录 - TranslateAI',
  description: '登录您的 TranslateAI 账号，开始使用智能翻译服务',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background">
      <LoginLeftPanel />
      <LoginRightPanel />
    </main>
  )
}

import { Metadata } from 'next'
import { LoginLeftPanel } from '@/components/login-left-panel'
import { SignupForm } from '@/components/signup-form'

export const metadata: Metadata = {
  title: '注册 - TranslateAI',
  description: '创建 TranslateAI 账户，开始使用专业 AI 翻译服务',
}

export default function SignupPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <LoginLeftPanel />
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

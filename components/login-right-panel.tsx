import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { SocialLoginButtons } from '@/components/social-login-buttons'
import { LoginDivider } from '@/components/login-divider'
import { LoginForm } from '@/components/login-form'

export function LoginRightPanel() {
  return (
    <div className="flex w-full lg:w-1/2 flex-col items-center justify-center min-h-screen bg-background px-4 py-8 md:px-8">
      {/* Mobile Logo (hidden on desktop) */}
      <Link href="/" className="mb-8 lg:hidden inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
          <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight">
          TranslateAI
        </span>
      </Link>

      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            欢迎回来
          </h1>
          <p className="text-muted-foreground">
            登录您的账号以继续使用
          </p>
        </div>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Divider */}
        <LoginDivider />

        {/* Email Login Form */}
        <LoginForm />

        {/* Bottom Brand Info (mobile) */}
        <div className="border-t pt-6 text-center lg:hidden">
          <p className="text-xs text-muted-foreground mb-3">
            下一代 AI 翻译平台
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>Build with care by</span>
            <span className="font-semibold text-foreground">TranslateAI Team</span>
          </div>
        </div>
      </div>
    </div>
  )
}

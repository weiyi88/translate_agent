'use client'

import { Button } from '@/components/ui/button'
import { Chrome, Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

interface SocialLoginButtonsProps {
  isLoading?: boolean
}

export function SocialLoginButtons({ isLoading = false }: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleGithub = async () => {
    setLoadingProvider('github')
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="lg"
        disabled={isLoading || !!loadingProvider}
        onClick={handleGithub}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11"
      >
        <Github className="h-5 w-5" aria-hidden="true" />
        <span>{loadingProvider === 'github' ? '跳转中...' : '使用 GitHub 登录'}</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        disabled={isLoading || !!loadingProvider}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11 opacity-50 cursor-not-allowed"
      >
        <Chrome className="h-5 w-5" aria-hidden="true" />
        <span>使用 Google 登录（即将上线）</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        disabled={isLoading || !!loadingProvider}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11 opacity-50 cursor-not-allowed"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.69 6.61c-1.844 0-3.35 1.506-3.35 3.35 0 1.844 1.506 3.35 3.35 3.35 1.844 0 3.35-1.506 3.35-3.35 0-1.844-1.506-3.35-3.35-3.35m0 5.6c-.627 0-1.137-.51-1.137-1.137 0-.627.51-1.137 1.137-1.137.627 0 1.137.51 1.137 1.137 0 .627-.51 1.137-1.137 1.137m6.62-5.6c-1.844 0-3.35 1.506-3.35 3.35 0 1.844 1.506 3.35 3.35 3.35 1.844 0 3.35-1.506 3.35-3.35 0-1.844-1.506-3.35-3.35-3.35m0 5.6c-.627 0-1.137-.51-1.137-1.137 0-.627.51-1.137 1.137-1.137.627 0 1.137.51 1.137 1.137 0 .627-.51 1.137-1.137 1.137" />
        </svg>
        <span>使用微信登录（即将上线）</span>
      </Button>
    </div>
  )
}

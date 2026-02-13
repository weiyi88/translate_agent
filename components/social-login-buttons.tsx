'use client'

import { Button } from '@/components/ui/button'
import { Chrome, Github } from 'lucide-react'
import React from 'react'

interface SocialLoginButtonsProps {
  isLoading?: boolean
  onGoogleClick?: () => void
  onGithubClick?: () => void
  onWechatClick?: () => void
}

export function SocialLoginButtons({
  isLoading = false,
  onGoogleClick,
  onGithubClick,
  onWechatClick,
}: SocialLoginButtonsProps) {
  const isDisabled = isLoading

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="lg"
        disabled={isDisabled}
        onClick={onGoogleClick}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11"
      >
        <Chrome className="h-5 w-5" aria-hidden="true" />
        <span>使用 Google 登录</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        disabled={isDisabled}
        onClick={onGithubClick}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11"
      >
        <Github className="h-5 w-5" aria-hidden="true" />
        <span>使用 GitHub 登录</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        disabled={isDisabled}
        onClick={onWechatClick}
        className="w-full gap-2 bg-background hover:bg-muted/50 transition-colors duration-200 border-2 h-11"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.69 6.61c-1.844 0-3.35 1.506-3.35 3.35 0 1.844 1.506 3.35 3.35 3.35 1.844 0 3.35-1.506 3.35-3.35 0-1.844-1.506-3.35-3.35-3.35m0 5.6c-.627 0-1.137-.51-1.137-1.137 0-.627.51-1.137 1.137-1.137.627 0 1.137.51 1.137 1.137 0 .627-.51 1.137-1.137 1.137m6.62-5.6c-1.844 0-3.35 1.506-3.35 3.35 0 1.844 1.506 3.35 3.35 3.35 1.844 0 3.35-1.506 3.35-3.35 0-1.844-1.506-3.35-3.35-3.35m0 5.6c-.627 0-1.137-.51-1.137-1.137 0-.627.51-1.137 1.137-1.137.627 0 1.137.51 1.137 1.137 0 .627-.51 1.137-1.137 1.137m6.62-10.95C20.59 1.5 15.95 0 11 0 4.927 0 0 4.927 0 11s4.927 11 11 11c1.11 0 2.19-.167 3.227-.488.49.357 1.155.893 2.048 1.493 1.39.912 2.5 1.627 3.327 2.148.42.263.782.467 1.08.611.298.144.576.206.834.206.278 0 .48-.086.605-.259.125-.173.188-.433.188-.78V20.18c.918-1.39 1.628-2.994 2.057-4.754C23.25 13.476 24 12.288 24 11c0-2.844-1.1-5.518-3.1-7.535" />
        </svg>
        <span>使用微信登录</span>
      </Button>
    </div>
  )
}

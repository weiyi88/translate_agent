'use client'

import { useEffect, useState } from 'react'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!password) {
      setScore(0)
      setStrength('weak')
      return
    }

    let calculatedScore = 0

    // 长度检查
    if (password.length >= 8) calculatedScore += 1
    if (password.length >= 12) calculatedScore += 1

    // 包含小写字母
    if (/[a-z]/.test(password)) calculatedScore += 1

    // 包含大写字母
    if (/[A-Z]/.test(password)) calculatedScore += 1

    // 包含数字
    if (/\d/.test(password)) calculatedScore += 1

    // 包含特殊字符
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) calculatedScore += 1

    setScore(calculatedScore)

    if (calculatedScore <= 2) {
      setStrength('weak')
    } else if (calculatedScore <= 4) {
      setStrength('medium')
    } else {
      setStrength('strong')
    }
  }, [password])

  const getStrengthLabel = () => {
    switch (strength) {
      case 'weak':
        return '弱'
      case 'medium':
        return '中等'
      case 'strong':
        return '强'
    }
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
    }
  }

  const getTextColor = () => {
    switch (strength) {
      case 'weak':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'strong':
        return 'text-green-600'
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">密码强度:</span>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index < score ? getStrengthColor() : 'bg-muted'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

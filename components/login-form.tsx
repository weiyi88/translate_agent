'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
  emailTouched: boolean
  passwordTouched: boolean
  emailValid: boolean
  passwordValid: boolean
  showPassword: boolean
  isLoading: boolean
  error: string | null
  showError: boolean
}

export function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
    emailTouched: false,
    passwordTouched: false,
    emailValid: false,
    passwordValid: false,
    showPassword: false,
    isLoading: false,
    error: null,
    showError: false,
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setState((prev) => ({
      ...prev,
      email,
      emailValid: validateEmail(email),
      emailTouched: true,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setState((prev) => ({
      ...prev,
      password,
      passwordValid: validatePassword(password),
      passwordTouched: true,
    }))
  }

  const handleEmailBlur = () => {
    setState((prev) => ({
      ...prev,
      emailTouched: true,
    }))
  }

  const handlePasswordBlur = () => {
    setState((prev) => ({
      ...prev,
      passwordTouched: true,
    }))
  }

  const togglePasswordVisibility = () => {
    setState((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }))
  }

  const handleRememberMeChange = (checked: boolean) => {
    setState((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!state.emailValid) {
      setState((prev) => ({
        ...prev,
        emailTouched: true,
        error: '请输入有效的邮箱地址',
        showError: true,
      }))
      return
    }

    if (!state.passwordValid) {
      setState((prev) => ({
        ...prev,
        passwordTouched: true,
        error: '密码至少需要 6 个字符',
        showError: true,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      showError: false,
    }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo: always succeed and redirect to dashboard
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
      router.push('/dashboard')
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: '登录失败，请重试',
        showError: true,
      }))
    }
  }

  const isFormValid = state.emailValid && state.passwordValid

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.showError && (
        <Alert variant="destructive" className="border-2 border-destructive/50">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
          <AlertDescription className="text-sm font-medium">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-foreground">
          邮箱地址
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="enter@email.com"
            value={state.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            disabled={state.isLoading}
            className={`h-11 pr-10 transition-all duration-200 ${
              state.emailTouched
                ? state.emailValid
                  ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : state.email
                    ? 'border-2 border-destructive focus:ring-2 focus:ring-destructive/20'
                    : 'border-2 border-border'
                : 'border-2 border-border'
            }`}
            aria-invalid={state.emailTouched && !state.emailValid}
          />
          {state.emailTouched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {state.emailValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
              ) : state.email ? (
                <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              ) : null}
            </div>
          )}
        </div>
        {state.emailTouched && !state.emailValid && state.email && (
          <p className="text-xs text-destructive font-medium">
            请输入有效的邮箱地址
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-foreground">
          密码
        </label>
        <div className="relative">
          <Input
            id="password"
            type={state.showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={state.password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            disabled={state.isLoading}
            className={`h-11 pr-10 transition-all duration-200 ${
              state.passwordTouched
                ? state.passwordValid
                  ? 'border-2 border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : state.password
                    ? 'border-2 border-destructive focus:ring-2 focus:ring-destructive/20'
                    : 'border-2 border-border'
                : 'border-2 border-border'
            }`}
            aria-invalid={state.passwordTouched && !state.passwordValid}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={state.isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={state.showPassword ? '隐藏密码' : '显示密码'}
          >
            {state.showPassword ? (
              <Eye className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {state.passwordTouched && !state.passwordValid && state.password && (
          <p className="text-xs text-destructive font-medium">
            密码至少需要 6 个字符
          </p>
        )}
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={state.rememberMe}
            onCheckedChange={handleRememberMeChange}
            disabled={state.isLoading}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium cursor-pointer text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            记住我
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5 underline-offset-2 hover:underline"
        >
          忘记密码？
        </Link>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        size="lg"
        disabled={!isFormValid || state.isLoading}
        className="w-full h-11 gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white font-semibold shadow-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
      >
        {state.isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>登录中...</span>
          </>
        ) : (
          <span>登 录</span>
        )}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        还没有账号？{' '}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
        >
          立即注册
        </Link>
      </p>
    </form>
  )
}

'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'
import { Eye, EyeOff, Mail, User, Lock, CheckCircle2, AlertCircle, Loader } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return '姓名不能为空'
    if (name.trim().length < 2) return '至少需要 2 个字符'
    if (name.trim().length > 50) return '最多 50 个字符'
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return '邮箱不能为空'
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email)) return '请输入有效的邮箱地址'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return '密码不能为空'
    if (password.length < 8) return '密码至少需要 8 个字符'
    if (!/[a-z]/.test(password)) return '密码需要包含小写字母'
    if (!/[A-Z]/.test(password)) return '密码需要包含大写字母'
    if (!/\d/.test(password)) return '密码需要包含数字'
    return undefined
  }

  const validateConfirmPassword = (confirm: string, password: string): string | undefined => {
    if (!confirm) return '请确认密码'
    if (confirm !== password) return '两次输入的密码不一致'
    return undefined
  }

  const validateTerms = (checked: boolean): string | undefined => {
    if (!checked) return '必须同意服务条款和隐私政策'
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password)
    if (confirmError) newErrors.confirmPassword = confirmError

    const termsError = validateTerms(formData.terms)
    if (termsError) newErrors.terms = termsError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget
    const newValue = type === 'checkbox' ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMessage('请检查表单错误')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      setIsSuccess(true)
      setSuccessMessage('注册成功！正在跳转到登录页面...')

      // 延迟1秒后跳转
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '注册失败，请稍后重试'
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.terms &&
    !Object.values(errors).some((error) => error)

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">创建账户</h1>
        <p className="text-sm text-muted-foreground">
          开始使用 TranslateAI 专业翻译平台
        </p>
      </div>

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-sm transition-all duration-200 hover:bg-muted active:scale-[0.98]"
          onClick={() => { setIsLoading(true); setTimeout(() => { window.location.href = '/dashboard' }, 1500) }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-sm transition-all duration-200 hover:bg-muted active:scale-[0.98]"
          onClick={() => { setIsLoading(true); setTimeout(() => { window.location.href = '/dashboard' }, 1500) }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          GitHub
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-sm transition-all duration-200 hover:bg-muted active:scale-[0.98]"
          onClick={() => { setIsLoading(true); setTimeout(() => { window.location.href = '/dashboard' }, 1500) }}
        >
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.564.564 0 0 1 .213.428l-.033 1.512a.56.56 0 0 0 .786.516l1.691-.792a.563.563 0 0 1 .376-.036c.805.2 1.663.31 2.656.31 4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.89-7.342-8.691-7.342m-2.07 5.085a.425.425 0 0 1 .384.238l2.041 3.312 2.042-3.312a.426.426 0 0 1 .384-.238h1.326a.425.425 0 0 1 .362.65L10.456 12l2.604 4.077a.425.425 0 0 1-.362.65h-1.326a.425.425 0 0 1-.384-.237L8.946 13.18l-2.042 3.31a.425.425 0 0 1-.384.237H5.194a.425.425 0 0 1-.362-.65L7.436 12 4.832 7.923a.425.425 0 0 1 .362-.65z"/></svg>
          WeChat
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">或使用邮箱注册</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            姓名 <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="请输入你的姓名"
              value={formData.name}
              onChange={handleChange}
              className={`pl-10 transition-colors duration-200 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-border'
              }`}
              disabled={isLoading}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            邮箱地址 <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="你的邮箱地址"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 transition-colors duration-200 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border'
              }`}
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            密码 <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="至少 8 个字符"
              value={formData.password}
              onChange={handleChange}
              className={`pl-10 pr-10 transition-colors duration-200 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border'
              }`}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> {errors.password}
            </p>
          )}
          {formData.password && (
            <div className="pt-2">
              <PasswordStrengthIndicator password={formData.password} />
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            确认密码 <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="再次输入密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 pr-10 transition-colors duration-200 ${
                formData.confirmPassword && !errors.confirmPassword
                  ? 'border-green-500 focus:ring-green-500'
                  : errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-border'
              }`}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
              aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
              tabIndex={0}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            {formData.confirmPassword && !errors.confirmPassword && (
              <CheckCircle2 className="absolute right-10 h-4 w-4 text-green-500" aria-hidden="true" />
            )}
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              name="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, terms: !!checked }))
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: undefined }))
                }
              }}
              disabled={isLoading}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? 'terms-error' : undefined}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm leading-relaxed text-muted-foreground cursor-pointer"
            >
              我同意{' '}
              <Link
                href="/terms"
                className="text-primary underline transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
              >
                服务条款
              </Link>
              {' '}和{' '}
              <Link
                href="/privacy"
                className="text-primary underline transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
              >
                隐私政策
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p id="terms-error" className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden="true">×</span> {errors.terms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 h-10 font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span>注册中...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>注册成功</span>
            </>
          ) : (
            <span>注册</span>
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          已有账号？{' '}
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
          >
            登录
          </Link>
        </p>
      </form>
    </div>
  )
}

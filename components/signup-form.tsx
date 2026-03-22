'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'
import { Eye, EyeOff, Mail, User, Lock, CheckCircle2, AlertCircle, Loader, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  code: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  code?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const validateName = (v: string) => {
    if (!v.trim()) return '姓名不能为空'
    if (v.trim().length < 2) return '至少需要 2 个字符'
    if (v.trim().length > 50) return '最多 50 个字符'
  }

  const validateEmail = (v: string) => {
    if (!v.trim()) return '邮箱不能为空'
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)) return '请输入有效的邮箱地址'
  }

  const validateCode = (v: string) => {
    if (!v.trim()) return '请输入验证码'
    if (!/^\d{6}$/.test(v)) return '验证码为 6 位数字'
  }

  const validatePassword = (v: string) => {
    if (!v) return '密码不能为空'
    if (v.length < 8) return '密码至少需要 8 个字符'
    if (!/[a-z]/.test(v)) return '密码需要包含小写字母'
    if (!/[A-Z]/.test(v)) return '密码需要包含大写字母'
    if (!/\d/.test(v)) return '密码需要包含数字'
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const nameErr = validateName(formData.name); if (nameErr) newErrors.name = nameErr
    const emailErr = validateEmail(formData.email); if (emailErr) newErrors.email = emailErr
    const codeErr = validateCode(formData.code); if (codeErr) newErrors.code = codeErr
    const pwErr = validatePassword(formData.password); if (pwErr) newErrors.password = pwErr
    if (!formData.confirmPassword) newErrors.confirmPassword = '请确认密码'
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = '两次密码不一致'
    if (!formData.terms) newErrors.terms = '必须同意服务条款和隐私政策'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const startCountdown = () => {
    setCountdown(60)
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(countdownRef.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleSendCode = async () => {
    const emailErr = validateEmail(formData.email)
    if (emailErr) {
      setErrors(prev => ({ ...prev, email: emailErr }))
      return
    }

    setIsSendingCode(true)
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '发送失败')
      setCodeSent(true)
      startCountdown()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '发送失败，请稍后重试')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsSendingCode(false)
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
          code: formData.code.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '注册失败')
      setIsSuccess(true)
      setSuccessMessage('注册成功！正在跳转到登录页面...')
      setTimeout(() => { window.location.href = '/login' }, 1000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败，请稍后重试'
      setErrorMessage(msg)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.code.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.terms &&
    !Object.values(errors).some(Boolean)

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">创建账户</h1>
        <p className="text-sm text-muted-foreground">开始使用 TranslateAI 专业翻译平台</p>
      </div>

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">姓名 <span className="text-red-500">*</span></Label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input id="name" name="name" type="text" placeholder="请输入你的姓名"
              value={formData.name} onChange={handleChange}
              className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading} />
          </div>
          {errors.name && <p className="text-xs text-red-600">× {errors.name}</p>}
        </div>

        {/* Email + 发送验证码按钮 */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">邮箱地址 <span className="text-red-500">*</span></Label>
          <div className="flex gap-2">
            <div className="relative flex-1 flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="你的邮箱地址"
                value={formData.email} onChange={handleChange}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                disabled={isLoading} />
            </div>
            <Button type="button" variant="outline" onClick={handleSendCode}
              disabled={isSendingCode || countdown > 0 || isLoading}
              className="shrink-0 w-28 text-xs">
              {isSendingCode ? <Loader className="h-4 w-4 animate-spin" /> :
                countdown > 0 ? `${countdown}s 后重试` : codeSent ? '重新发送' : '获取验证码'}
            </Button>
          </div>
          {errors.email && <p className="text-xs text-red-600">× {errors.email}</p>}
        </div>

        {/* Verification Code */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">邮箱验证码 <span className="text-red-500">*</span></Label>
          <div className="relative flex items-center">
            <ShieldCheck className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input id="code" name="code" type="text" placeholder="请输入 6 位验证码"
              value={formData.code} onChange={handleChange} maxLength={6}
              className={`pl-10 tracking-widest font-mono ${errors.code ? 'border-red-500' : ''}`}
              disabled={isLoading} />
          </div>
          {errors.code && <p className="text-xs text-red-600">× {errors.code}</p>}
          {codeSent && !errors.code && (
            <p className="text-xs text-green-600">验证码已发送至 {formData.email}，请查收</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">密码 <span className="text-red-500">*</span></Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input id="password" name="password" type={showPassword ? 'text' : 'password'}
              placeholder="至少 8 个字符" value={formData.password} onChange={handleChange}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              disabled={isLoading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-muted-foreground hover:text-foreground rounded p-1">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">× {errors.password}</p>}
          {formData.password && <div className="pt-2"><PasswordStrengthIndicator password={formData.password} /></div>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">确认密码 <span className="text-red-500">*</span></Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input id="confirmPassword" name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="再次输入密码" value={formData.confirmPassword} onChange={handleChange}
              className={`pl-10 pr-10 ${
                formData.confirmPassword && !errors.confirmPassword ? 'border-green-500' :
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              disabled={isLoading} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-muted-foreground hover:text-foreground rounded p-1">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {formData.confirmPassword && !errors.confirmPassword && (
              <CheckCircle2 className="absolute right-10 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-600">× {errors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <Checkbox id="terms" name="terms" checked={formData.terms}
              onCheckedChange={(checked) => {
                setFormData(prev => ({ ...prev, terms: !!checked }))
                if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }))
              }}
              disabled={isLoading} className="mt-1" />
            <label htmlFor="terms" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
              我同意{' '}
              <Link href="/terms" className="text-primary underline hover:text-primary/80">服务条款</Link>
              {' '}和{' '}
              <Link href="/privacy" className="text-primary underline hover:text-primary/80">隐私政策</Link>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-600">× {errors.terms}</p>}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 disabled:opacity-50 h-10 font-semibold"
          size="lg">
          {isLoading ? (
            <><Loader className="mr-2 h-4 w-4 animate-spin" /><span>注册中...</span></>
          ) : isSuccess ? (
            <><CheckCircle2 className="mr-2 h-4 w-4" /><span>注册成功</span></>
          ) : (
            <span>注册</span>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          已有账号？{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80">登录</Link>
        </p>
      </form>
    </div>
  )
}

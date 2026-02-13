'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Smartphone, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function SettingsAccount() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('user@example.com')
  const [phoneNumber, setPhoneNumber] = useState('+86 138 0000 0000')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const devices = [
    { name: 'MacBook Pro', location: '北京', lastActive: '当前设备', current: true },
    { name: 'iPhone 15 Pro', location: '上海', lastActive: '2小时前', current: false },
    { name: 'Chrome on Windows', location: '深圳', lastActive: '1天前', current: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">账户管理</h2>
        <p className="text-stone-600 mt-1">管理您的登录方式和设备</p>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            账户信息已成功更新
          </AlertDescription>
        </Alert>
      )}

      {/* Email */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader className="bg-amber-50/50">
          <CardTitle className="text-lg text-stone-800 flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            登录邮箱
          </CardTitle>
          <CardDescription className="text-stone-600">
            用于登录和接收重要通知
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-700">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-stone-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            {isSaving ? '保存中...' : '更新邮箱'}
          </Button>
        </CardContent>
      </Card>

      {/* Phone Number */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader className="bg-amber-50/50">
          <CardTitle className="text-lg text-stone-800 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            手机号码
          </CardTitle>
          <CardDescription className="text-stone-600">
            用于安全验证和账户恢复
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-stone-700">手机号</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-stone-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            {isSaving ? '保存中...' : '更新手机号'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Devices */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader className="bg-amber-50/50">
          <CardTitle className="text-lg text-stone-800">登录设备</CardTitle>
          <CardDescription className="text-stone-600">
            管理已登录的设备和会话
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {devices.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-stone-200 bg-amber-50/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-stone-800">{device.name}</h4>
                    {device.current && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                        当前
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-600 mt-1">
                    {device.location} · {device.lastActive}
                  </div>
                </div>
                {!device.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-red-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            危险操作
          </CardTitle>
          <CardDescription className="text-red-700">
            这些操作无法撤销，请谨慎操作
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
          >
            删除所有会话
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
          >
            注销所有其他设备
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

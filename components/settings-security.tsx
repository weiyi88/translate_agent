'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Smartphone } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function SettingsSecurity() {
  const { language } = useTranslation()
  const [activeTab, setActiveTab] = useState<'password' | '2fa' | 'sessions'>('password')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { key: 'password' as const, zh: '修改密码', en: 'Change Password' },
    { key: '2fa' as const, zh: '双因素认证', en: 'Two-Factor Auth' },
    { key: 'sessions' as const, zh: '活动会话', en: 'Active Sessions' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {language === 'zh' ? tab.zh : tab.en}
          </button>
        ))}
      </div>

      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'zh' ? '修改密码' : 'Change Password'}</CardTitle>
            <CardDescription>
              {language === 'zh' ? '为了您的账户安全，请定期更新密码' : 'Update your password regularly for security'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'zh' ? '当前密码' : 'Current Password'}</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder={language === 'zh' ? '输入当前密码' : 'Enter current password'} className="pr-10" />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'zh' ? '新密码' : 'New Password'}</label>
              <Input type="password" placeholder={language === 'zh' ? '输入新密码' : 'Enter new password'} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'zh' ? '确认新密码' : 'Confirm New Password'}</label>
              <Input type="password" placeholder={language === 'zh' ? '确认新密码' : 'Confirm new password'} />
            </div>
            <Button className="bg-gradient-to-r from-pink-400 to-orange-300 text-white hover:opacity-90">
              {language === 'zh' ? '更新密码' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === '2fa' && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'zh' ? '双因素认证' : 'Two-Factor Authentication'}</CardTitle>
            <CardDescription>
              {language === 'zh' ? '增强您的账户安全性' : 'Enhance your account security'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <Smartphone className="mt-1 h-5 w-5 text-primary shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h4 className="font-medium">{language === 'zh' ? '身份验证器应用' : 'Authenticator App'}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'zh' ? '使用 Google Authenticator 或其他应用增强安全' : 'Use Google Authenticator or similar apps'}
                </p>
              </div>
              <Button variant="outline">{language === 'zh' ? '配置' : 'Configure'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'zh' ? '活动会话' : 'Active Sessions'}</CardTitle>
            <CardDescription>
              {language === 'zh' ? '管理所有登录的设备' : 'Manage all logged-in devices'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { device: 'Chrome / macOS', ip: '192.168.1.1', time: language === 'zh' ? '当前活动' : 'Active now' },
              { device: 'Safari / iPhone', ip: '192.168.1.2', time: language === 'zh' ? '2小时前' : '2h ago' },
              { device: 'Firefox / Windows', ip: '192.168.1.3', time: language === 'zh' ? '1天前' : '1d ago' },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{session.device}</p>
                  <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
                <Button variant="outline" size="sm">{language === 'zh' ? '登出' : 'Logout'}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

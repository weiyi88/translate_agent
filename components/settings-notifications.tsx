'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n'

export function SettingsNotifications() {
  const { language } = useTranslation()
  const [notifications, setNotifications] = useState({
    email: true,
    translation: true,
    usage: true,
    marketing: false,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationOptions = [
    {
      id: 'email',
      title: language === 'zh' ? '邮件通知' : 'Email Notifications',
      description: language === 'zh' ? '接收重要账户更新和安全提示' : 'Receive important account updates and security alerts',
    },
    {
      id: 'translation',
      title: language === 'zh' ? '翻译完成通知' : 'Translation Complete',
      description: language === 'zh' ? '文档翻译完成时立即通知' : 'Get notified when document translation is done',
    },
    {
      id: 'usage',
      title: language === 'zh' ? '使用量提醒' : 'Usage Alerts',
      description: language === 'zh' ? '当接近月度配额时收到提醒' : 'Get reminded when approaching monthly quota',
    },
    {
      id: 'marketing',
      title: language === 'zh' ? '营销邮件' : 'Marketing Emails',
      description: language === 'zh' ? '接收新功能和特别优惠信息' : 'Receive new features and special offers',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'zh' ? '通知设置' : 'Notification Settings'}</CardTitle>
          <CardDescription>
            {language === 'zh' ? '管理您的通知偏好' : 'Manage your notification preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div>
                <Label className="text-base font-medium cursor-pointer">{option.title}</Label>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
              <button
                onClick={() => handleToggle(option.id as keyof typeof notifications)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  notifications[option.id as keyof typeof notifications]
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                role="switch"
                aria-checked={notifications[option.id as keyof typeof notifications]}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notifications[option.id as keyof typeof notifications]
                      ? 'translate-x-7'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

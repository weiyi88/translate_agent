'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { AppLayout } from '@/components/app-layout'
import { SettingsProfile } from '@/components/settings-profile'
import { SettingsAccount } from '@/components/settings-account'
import { SettingsSecurity } from '@/components/settings-security'
import { SettingsNotifications } from '@/components/settings-notifications'
import { SettingsPreferences } from '@/components/settings-preferences'
import { SettingsAPI } from '@/components/settings-api'
import { useTranslation } from '@/lib/i18n'

function SettingsContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'profile'
  const { language } = useTranslation()

  const titles: Record<string, { zh: string; en: string }> = {
    profile: { zh: '个人资料', en: 'Profile' },
    security: { zh: '账户安全', en: 'Account Security' },
    notifications: { zh: '通知提醒', en: 'Notifications' },
    preferences: { zh: '系统偏好', en: 'Preferences' },
    api: { zh: 'API 密钥', en: 'API Keys' },
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'zh' ? titles[tab]?.zh : titles[tab]?.en}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'zh' ? '管理您的账户设置' : 'Manage your account settings'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-w-4xl mx-auto">
          {tab === 'profile' && <SettingsProfile />}
          {tab === 'security' && <SettingsSecurity />}
          {tab === 'notifications' && <SettingsNotifications />}
          {tab === 'preferences' && <SettingsPreferences />}
          {tab === 'api' && <SettingsAPI />}
        </div>
      </div>
    </AppLayout>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SettingsContent />
    </Suspense>
  )
}

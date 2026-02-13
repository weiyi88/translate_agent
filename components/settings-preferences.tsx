'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'

export function SettingsPreferences() {
  const { language } = useTranslation()
  const [preferences, setPreferences] = useState({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    theme: 'light',
    defaultModel: 'gpt-4o-mini',
  })

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const preferencesOptions = [
    {
      label: language === 'zh' ? '语言' : 'Language',
      name: 'language',
      options: [
        { value: 'zh-CN', label: '中文 (简体)' },
        { value: 'zh-TW', label: '中文 (繁體)' },
        { value: 'en-US', label: 'English' },
      ],
    },
    {
      label: language === 'zh' ? '时区' : 'Timezone',
      name: 'timezone',
      options: [
        { value: 'Asia/Shanghai', label: language === 'zh' ? '中国标准时间 (UTC+8)' : 'China Standard Time (UTC+8)' },
        { value: 'America/New_York', label: language === 'zh' ? '东部时间 (UTC-5)' : 'Eastern Time (UTC-5)' },
        { value: 'Europe/London', label: language === 'zh' ? '格林威治时间 (UTC+0)' : 'Greenwich Mean Time (UTC+0)' },
      ],
    },
    {
      label: language === 'zh' ? '主题' : 'Theme',
      name: 'theme',
      options: [
        { value: 'light', label: language === 'zh' ? '浅色' : 'Light' },
        { value: 'dark', label: language === 'zh' ? '深色' : 'Dark' },
        { value: 'auto', label: language === 'zh' ? '自动' : 'Auto' },
      ],
    },
    {
      label: language === 'zh' ? '默认AI模型' : 'Default AI Model',
      name: 'defaultModel',
      options: [
        { value: 'gpt-4o-mini', label: language === 'zh' ? 'GPT-4o Mini (快速)' : 'GPT-4o Mini (Fast)' },
        { value: 'gpt-4o', label: language === 'zh' ? 'GPT-4o (推荐)' : 'GPT-4o (Recommended)' },
        { value: 'claude-opus', label: language === 'zh' ? 'Claude 3.5 (高质量)' : 'Claude 3.5 (High Quality)' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'zh' ? '偏好设置' : 'Preferences'}</CardTitle>
          <CardDescription>
            {language === 'zh' ? '自定义您的使用体验' : 'Customize your experience'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {preferencesOptions.map((pref) => (
              <div key={pref.name} className="space-y-2">
                <label htmlFor={pref.name} className="text-sm font-medium">
                  {pref.label}
                </label>
                <select
                  id={pref.name}
                  name={pref.name}
                  value={preferences[pref.name as keyof typeof preferences]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {pref.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <Button className="bg-gradient-to-r from-pink-400 to-orange-300 text-white hover:opacity-90">
            {language === 'zh' ? '保存偏好设置' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Copy, Check, RotateCw, Code } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function SettingsAPI() {
  const { language } = useTranslation()
  const [activeTab, setActiveTab] = useState<'keys' | 'webhook'>('keys')
  const [copied, setCopied] = useState(false)
  const [apiKey] = useState('sk_live_1234567890abcdef')

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { key: 'keys' as const, zh: 'API 密钥', en: 'API Keys' },
    { key: 'webhook' as const, zh: 'Webhook', en: 'Webhook' },
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

      {activeTab === 'keys' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'zh' ? 'API 密钥' : 'API Keys'}</CardTitle>
              <CardDescription>
                {language === 'zh' ? '使用 API 密钥集成 TranslateAI 到您的应用' : 'Use API keys to integrate TranslateAI into your apps'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'zh' ? 'Live API 密钥' : 'Live API Key'}</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 rounded-lg border bg-muted/50 px-3">
                    <Input type="password" value={apiKey} readOnly className="border-0 bg-transparent text-sm" />
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyKey} className="shrink-0 bg-transparent">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>{language === 'zh' ? '安全提示:' : 'Security Note:'}</strong>{' '}
                  {language === 'zh' ? '请妥善保管您的 API 密钥，勿在公开代码中暴露。' : 'Keep your API key secure. Never expose it in public code.'}
                </p>
              </div>

              <Button variant="outline" className="gap-2 bg-transparent">
                <RotateCw className="h-4 w-4" />
                {language === 'zh' ? '重新生成密钥' : 'Regenerate Key'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'zh' ? 'API 文档' : 'API Documentation'}</CardTitle>
              <CardDescription>
                {language === 'zh' ? '查看完整的 API 参考和示例代码' : 'View complete API reference and code examples'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Code className="h-4 w-4" />
                {language === 'zh' ? '打开文档' : 'Open Docs'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'webhook' && (
        <Card>
          <CardHeader>
            <CardTitle>Webhook</CardTitle>
            <CardDescription>
              {language === 'zh' ? '当翻译完成或发生错误时接收事件通知' : 'Receive event notifications on translation completion or errors'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'zh' ? 'Webhook URL' : 'Webhook URL'}</label>
              <Input type="url" placeholder="https://example.com/webhook" />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                {language === 'zh' ? '订阅事件' : 'Subscribe Events'}
              </label>
              {['translation.completed', 'translation.failed', 'glossary.updated'].map((event) => (
                <label key={event} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={event === 'translation.completed'} className="h-4 w-4 rounded border-border" />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-pink-400 to-orange-300 text-white hover:opacity-90">
              {language === 'zh' ? '保存 Webhook' : 'Save Webhook'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

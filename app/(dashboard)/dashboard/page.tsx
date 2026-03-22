'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AppLayout } from '@/components/app-layout'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  FileText,
  MessageSquare,
  BookOpen,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  FileSpreadsheet,
  FileImage,
  File,
  CheckCircle2,
  Loader2,
  Heart,
  Sparkles,
  Sun,
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import type { UsageStats } from '@/lib/api/types'

const quickActions = [
  { icon: FileText, labelZh: '上传文档', labelEn: 'Upload Document', href: '/translate', color: 'from-pink-400 to-rose-400' },
  { icon: MessageSquare, labelZh: '对话翻译', labelEn: 'Chat Translation', href: '/chat', color: 'from-orange-400 to-amber-400' },
  { icon: BookOpen, labelZh: '管理术语库', labelEn: 'Manage Glossary', href: '/glossary', color: 'from-teal-400 to-emerald-400' },
  { icon: Clock, labelZh: '翻译历史', labelEn: 'View History', href: '/history', color: 'from-violet-400 to-purple-400' },
]

interface RecentTranslation {
  id: string
  name: string
  type: string
  status: string
  time: string
  progress: number
}

export default function DashboardPage() {
  const { t, language } = useTranslation()
  const { data: session } = useSession()
  const userName = session?.user?.name ?? (language === 'zh' ? '用户' : 'User')
  const [recentTranslations, setRecentTranslations] = useState<RecentTranslation[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)

  useEffect(() => {
    apiClient.getHistory({ page_size: 3 }).then((res) => {
      if (res.data?.items) {
        setRecentTranslations(
          res.data.items.map((task: any) => ({
            id: task.id,
            name: task.fileName ?? task.file_name ?? '',
            type: (task.fileName ?? task.file_name ?? '').split('.').pop() ?? '',
            status: task.status,
            time: task.status === 'processing' ? '正在处理' : new Date(task.createdAt ?? task.created_at).toLocaleString(),
            progress: task.progress ?? (task.status === 'completed' ? 100 : 0),
          }))
        )
      }
    })
    apiClient.getUsage().then((res) => {
      if (res.data) setUsageStats(res.data)
    })
  }, [])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-rose-500" />
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'xlsx':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
      case 'pptx':
        return <FileImage className="h-4 w-4 text-orange-500" />
      default:
        return <File className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-semibold text-foreground">{t.nav.dashboard}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {language === 'zh' ? '欢迎回来！这是您的翻译工作台' : 'Welcome back! Here is your translation workspace'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-br from-pink-100 via-orange-50 to-amber-100 dark:from-pink-950/40 dark:via-orange-950/20 dark:to-amber-950/20 border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-100/50 dark:shadow-pink-900/30 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 flex items-center justify-center shadow-lg">
                      <Heart className="h-8 w-8 text-white fill-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {language === 'zh' ? `您好，${userName}！` : `Hello, ${userName}!`}
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </h2>
                      <p className="text-muted-foreground">
                        {language === 'zh'
                          ? '今天也要加油哦，让我们开始愉快的翻译之旅吧！'
                          : 'Ready to start your translation journey today?'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl" 
                    asChild
                  >
                    <Link href="/translate">
                      <Zap className="h-4 w-4 mr-2" />
                      {language === 'zh' ? '开始翻译' : 'Start Translating'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <Card className="hover:shadow-lg hover:shadow-pink-100/50 dark:hover:shadow-pink-900/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full rounded-2xl border-border bg-card hover:bg-card/90 dark:hover:bg-card">
                      <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-medium text-sm text-foreground">
                          {language === 'zh' ? action.labelZh : action.labelEn}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Translations */}
              <Card className="lg:col-span-2 rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-pink-400" />
                      {language === 'zh' ? '最近翻译' : 'Recent Translations'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-xl" asChild>
                      <Link href="/history">
                        {language === 'zh' ? '查看全部' : 'View All'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTranslations.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 dark:bg-muted/30 dark:hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border shadow-sm dark:bg-background">
                        {getFileIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-pink-500 animate-spin" />
                          <span className="text-xs text-muted-foreground">{item.progress}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {recentTranslations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {language === 'zh' ? '暂无翻译记录' : 'No translations yet'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-400" />
                    {language === 'zh' ? '本月用量' : 'This Month Usage'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'zh' ? '翻译页数' : 'Pages'}
                      </span>
                      <span className="font-medium text-foreground">
                        {usageStats
                          ? `${usageStats.translations_used} / ${usageStats.translations_limit ?? '∞'}`
                          : '-- / --'}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-orange-300 rounded-full transition-all duration-500"
                        style={{
                          width: usageStats && usageStats.translations_limit
                            ? `${Math.min((usageStats.translations_used / usageStats.translations_limit) * 100, 100)}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'zh' ? 'Tokens' : 'Tokens'}
                      </span>
                      <span className="font-medium text-foreground">
                        {usageStats
                          ? `${usageStats.characters_used.toLocaleString()} / ${usageStats.characters_limit ? usageStats.characters_limit.toLocaleString() : '∞'}`
                          : '-- / --'}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-300 rounded-full transition-all duration-500"
                        style={{
                          width: usageStats && usageStats.characters_limit
                            ? `${Math.min((usageStats.characters_used / usageStats.characters_limit) * 100, 100)}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-border text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:text-pink-600 rounded-xl bg-transparent"
                    asChild
                  >
                    <Link href="/pricing">
                      {language === 'zh' ? '升级套餐' : 'Upgrade Plan'}
                      <Heart className="h-4 w-4 ml-2 fill-current" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, MessageSquare, BookOpen, Clock } from 'lucide-react'

interface WelcomeCardProps {
  userName?: string
  translations?: number
  usage?: number
  documents?: number
  avgTime?: number
}

export function WelcomeCard({
  userName = '张三',
  translations = 128,
  usage = 85,
  documents = 12,
  avgTime = 3.2,
}: WelcomeCardProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const dayStr = now.toLocaleDateString('zh-CN', { weekday: 'long' })
  
  const hour = now.getHours()
  let greeting = '晚上好'
  if (hour < 12) greeting = '早上好'
  else if (hour < 18) greeting = '下午好'

  const stats = [
    { label: '翻译', value: translations, icon: FileText },
    { label: '使用', value: `${usage}%`, icon: null },
    { label: '文档', value: documents, icon: FileText },
    { label: '耗时', value: `${avgTime}h`, icon: Clock },
  ]

  return (
    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-lg">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="mb-1 text-3xl font-bold">
            {greeting}，{userName}！
          </h1>
          <p className="text-sm opacity-90">
            今天是 {dateStr} {dayStr}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="mb-1 text-2xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-75">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="bg-white text-primary hover:bg-white/90 active:scale-95 transition-all duration-200"
            asChild
          >
            <Link href="/translate">开始翻译</Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 active:scale-95 transition-all duration-200 bg-transparent"
            asChild
          >
            <Link href="/history">查看历史</Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 active:scale-95 transition-all duration-200 bg-transparent"
            asChild
          >
            <Link href="/glossary">管理术语库</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

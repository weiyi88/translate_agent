import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FileText, MessageSquare, BookOpen, Clock } from 'lucide-react'

const actions = [
  {
    icon: FileText,
    label: '上传文档',
    href: '/translate',
    description: '开始新的文档翻译',
  },
  {
    icon: MessageSquare,
    label: '对话翻译',
    href: '/chat',
    description: '实时对话翻译',
  },
  {
    icon: BookOpen,
    label: '管理术语库',
    href: '/glossary',
    description: '自定义术语库',
  },
  {
    icon: Clock,
    label: '查看历史',
    href: '/history',
    description: '翻译历史记录',
  },
]

export function QuickActions() {
  return (
    <Card>
      <div className="p-6">
        <h2 className="mb-6 font-heading text-lg font-bold">快速操作</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-center gap-3 rounded-lg border-2 border-transparent bg-muted/50 p-6 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

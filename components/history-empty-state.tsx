import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import Link from 'next/link'

interface HistoryEmptyStateProps {
  onStartTranslate?: () => void
}

export function HistoryEmptyState({ onStartTranslate }: HistoryEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <div className="flex min-h-96 flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>

        <h3 className="mb-2 font-heading text-lg font-semibold">还没有翻译记录</h3>
        <p className="mb-6 max-w-sm text-pretty text-sm text-muted-foreground leading-relaxed">
          开始翻译文档后，记录会显示在这里。您可以随时查看、下载或重新翻译
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/translate">
            <Button className="gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 transition-opacity duration-200">
              开始翻译
            </Button>
          </Link>
          <Button variant="outline">查看示例</Button>
        </div>
      </div>
    </Card>
  )
}

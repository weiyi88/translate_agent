import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight, MoreHorizontal, Download, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Translation {
  id: string
  fileName: string
  sourceLanguage: string
  targetLanguage: string
  timeAgo: string
  pages: number
  status: 'completed' | 'processing' | 'failed'
}

interface RecentTranslationsProps {
  translations?: Translation[]
}

export function RecentTranslations({
  translations = [
    {
      id: '1',
      fileName: 'presentation.pptx',
      sourceLanguage: '中文',
      targetLanguage: '英文',
      timeAgo: '2分钟前',
      pages: 12,
      status: 'completed',
    },
    {
      id: '2',
      fileName: 'report.docx',
      sourceLanguage: '英文',
      targetLanguage: '日文',
      timeAgo: '1小时前',
      pages: 5,
      status: 'completed',
    },
    {
      id: '3',
      fileName: 'data.xlsx',
      sourceLanguage: '中文',
      targetLanguage: '韩文',
      timeAgo: '3小时前',
      pages: 3,
      status: 'completed',
    },
  ],
}: RecentTranslationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <div>
          <CardTitle>最近翻译</CardTitle>
          <CardDescription>您最近的翻译记录</CardDescription>
        </div>
        <Link href="/dashboard/history">
          <Button variant="ghost" size="sm" className="gap-1">
            查看全部
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="divide-y">
          {translations.map((translation, index) => (
            <div
              key={translation.id}
              className={`flex items-center justify-between gap-4 py-4 transition-colors duration-200 hover:bg-muted/50 px-2 -mx-2 rounded ${
                index !== translations.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex flex-1 items-start gap-3 min-w-0">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {translation.fileName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {translation.sourceLanguage} → {translation.targetLanguage} · {translation.timeAgo}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ✓ 完成 · {translation.pages}页
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="更多选项"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <button className="flex items-center gap-2 cursor-pointer w-full">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span>重新下载</span>
                    </button>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <button className="flex items-center gap-2 cursor-pointer w-full">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      <span>查看详情</span>
                    </button>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <button className="flex items-center gap-2 cursor-pointer w-full text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span>删除记录</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

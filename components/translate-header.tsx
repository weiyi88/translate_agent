'use client'

import { ChevronLeft, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function TranslateHeader() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="返回仪表板"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground">
              文档翻译
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hidden sm:flex hover:bg-muted/50 active:scale-95 transition-all duration-200"
            aria-label="访问词库"
            asChild
          >
            <Link href="/glossary">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>词库</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hidden sm:flex hover:bg-muted/50 active:scale-95 transition-all duration-200"
            aria-label="查看历史记录"
            asChild
          >
            <Link href="/history">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>历史</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

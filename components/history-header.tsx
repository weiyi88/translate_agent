'use client';

import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface HistoryHeaderProps {
  onClearHistory: () => void
}

export function HistoryHeader({ onClearHistory }: HistoryHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="返回仪表板"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="font-heading text-xl font-bold">翻译历史</h1>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClearHistory}
        className="gap-2 hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all duration-200 bg-transparent"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">清空历史</span>
      </Button>
    </div>
  )
}

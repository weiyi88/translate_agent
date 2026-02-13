'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export function GlossaryUploadHeader() {
  return (
    <header className="border-b px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/glossary"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="返回词库"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">上传词库</h1>
          <p className="text-sm text-muted-foreground">导入您的自定义术语库以提高翻译准确性</p>
        </div>
      </div>
    </header>
  )
}

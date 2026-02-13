'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export function ChatHeader() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-medium">返回</span>
        </Link>

        <h1 className="absolute left-1/2 -translate-x-1/2 font-heading text-lg font-semibold">
          对话翻译
        </h1>

        <Button
          size="sm"
          className="gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 hover:shadow-lg active:scale-95 transition-all duration-200"
          aria-label="新建对话"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">新建对话</span>
        </Button>
      </div>
    </header>
  )
}

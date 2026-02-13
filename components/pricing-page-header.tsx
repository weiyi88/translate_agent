'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export function PricingPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/dashboard" className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">返回</span>
          </Button>
        </Link>
        <h1 className="font-heading text-xl font-bold tracking-tight">选择适合您的方案</h1>
      </div>
    </header>
  )
}

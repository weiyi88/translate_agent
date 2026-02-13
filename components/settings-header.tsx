import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-colors hover:text-muted-foreground"
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="font-heading text-xl font-bold tracking-tight">账号设置</h1>
      </div>
    </header>
  )
}

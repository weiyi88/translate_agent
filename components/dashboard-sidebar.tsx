'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { DashboardSidebarNav } from './dashboard-sidebar-nav'
import { UsageCard } from './dashboard-usage-card'
import { UserMenu } from './dashboard-user-menu'

export function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-card p-6 lg:flex">
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
          <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight">
          TranslateAI
        </span>
      </Link>

      <DashboardSidebarNav />

      <div className="mt-auto">
        <UsageCard used={85} total={100} />
        
        <div className="mt-6 border-t pt-6">
          <UserMenu userName="张三" userEmail="zhang@example.com" />
        </div>
      </div>
    </aside>
  )
}

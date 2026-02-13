'use client'

import Link from 'next/link'
import { Bell, HelpCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
  title?: string
}

export function DashboardHeader({
  breadcrumbs = [{ label: '首页' }, { label: '仪表板' }],
  title,
}: DashboardHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:left-64">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="通知"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" aria-label="有新通知" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="帮助"
          >
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}

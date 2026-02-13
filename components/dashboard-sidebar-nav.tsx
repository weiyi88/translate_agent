'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  MessageSquare,
  BookOpen,
  Clock,
  Settings,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: '首页', href: '/dashboard' },
  { icon: FileText, label: '文档翻译', href: '/translate' },
  { icon: MessageSquare, label: '对话翻译', href: '/chat' },
  { icon: BookOpen, label: '术语库', href: '/glossary' },
  { icon: Clock, label: '翻译历史', href: '/history' },
  { icon: Settings, label: '设置', href: '/settings' },
]

export function DashboardSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 py-6" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? 'border-l-4 border-primary bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {isActive && (
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

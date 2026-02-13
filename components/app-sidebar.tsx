'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Home,
  FileText,
  MessageSquare,
  BookOpen,
  Clock,
  Settings,
  CreditCard,
  Moon,
  Sun,
  LogOut,
  User,
  Shield,
  Bell,
  Sliders,
  Code,
  ChevronDown,
  Languages,
  Upload,
  Heart,
  Sparkles,
} from 'lucide-react'

// Main nav items (no submenu)
const mainNavItems = [
  { icon: Home, label: '首页', labelEn: 'Home', href: '/dashboard' },
  { icon: FileText, label: '文档翻译', labelEn: 'Document', href: '/translate' },
  { icon: MessageSquare, label: '对话翻译', labelEn: 'Chat', href: '/chat' },
  { icon: Clock, label: '翻译历史', labelEn: 'History', href: '/history' },
]

// Glossary submenu items
const glossarySubItems = [
  { icon: BookOpen, label: '词库管理', labelEn: 'Manage', href: '/glossary', action: null },
  { icon: Upload, label: '导入词库', labelEn: 'Import', href: null, action: 'import' as const },
]

// Settings submenu items
const settingsSubItems = [
  { icon: User, label: '个人资料', labelEn: 'Profile', href: '/settings?tab=profile' },
  { icon: Shield, label: '账户安全', labelEn: 'Security', href: '/settings?tab=security' },
  { icon: Bell, label: '通知提醒', labelEn: 'Notifications', href: '/settings?tab=notifications' },
  { icon: Sliders, label: '系统偏好', labelEn: 'Preferences', href: '/settings?tab=preferences' },
  { icon: Code, label: 'API 密钥', labelEn: 'API Keys', href: '/settings?tab=api' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { language, toggleLanguage } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load expanded menus from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem('expandedMenus')
    if (saved) {
      setExpandedMenus(JSON.parse(saved))
    }
  }, [])

  // Save expanded menus to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('expandedMenus', JSON.stringify(expandedMenus))
    }
  }, [expandedMenus, isMounted])

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href.includes('?')) return pathname.startsWith(href.split('?')[0])
    return pathname.startsWith(href)
  }

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col bg-sidebar border-r border-sidebar-border shadow-lg">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sidebar-foreground text-sm">TranslateAI</span>
          <span className="text-[10px] text-sidebar-foreground/60 flex items-center gap-1">
            <Heart className="h-2.5 w-2.5 text-pink-400 fill-pink-400" />
            {language === 'zh' ? '温暖翻译' : 'Warm Translation'}
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-sidebar-accent/50">
          <Avatar className="h-9 w-9 ring-2 ring-pink-300/50">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-pink-300 to-orange-200 text-white text-sm font-medium">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {language === 'zh' ? '你好，用户' : 'Hi, User'}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">user@example.com</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Main Nav Items */}
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md shadow-pink-200/50'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-pink-400')} />
              <span className="text-sm font-medium">{language === 'zh' ? item.label : item.labelEn}</span>
            </Link>
          )
        })}

        {/* Glossary with Expandable Submenu */}
        <div>
          <button
            onClick={() => toggleMenu('glossary')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              pathname.startsWith('/glossary')
                ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md shadow-pink-200/50'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <BookOpen className={cn('h-5 w-5', pathname.startsWith('/glossary') ? 'text-white' : 'text-pink-400')} />
            <span className="text-sm font-medium flex-1 text-left">
              {language === 'zh' ? '词库' : 'Glossary'}
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              expandedMenus.includes('glossary') ? 'rotate-180' : ''
            )} />
          </button>
          
          {/* Glossary Submenu */}
          <div className={cn(
            'overflow-hidden transition-all duration-200',
            expandedMenus.includes('glossary') ? 'max-h-40 mt-1' : 'max-h-0'
          )}>
            <div className="ml-4 pl-4 border-l-2 border-pink-200 dark:border-pink-800 space-y-1">
              {glossarySubItems.map((subItem) => {
                const SubIcon = subItem.icon
                const subActive = subItem.href ? pathname === subItem.href : false
                if (subItem.href) {
                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97] active:bg-pink-200 dark:active:bg-pink-900',
                        subActive
                          ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 font-medium shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <SubIcon className="h-4 w-4" />
                      <span>{language === 'zh' ? subItem.label : subItem.labelEn}</span>
                    </Link>
                  )
                }
                return (
                  <button
                    key={subItem.label}
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-glossary-import'))
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97] active:bg-pink-200 dark:active:bg-pink-900 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <SubIcon className="h-4 w-4" />
                    <span>{language === 'zh' ? subItem.label : subItem.labelEn}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Settings with Expandable Submenu */}
        <div>
          <button
            onClick={() => toggleMenu('settings')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              pathname.startsWith('/settings')
                ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md shadow-pink-200/50'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Settings className={cn('h-5 w-5', pathname.startsWith('/settings') ? 'text-white' : 'text-pink-400')} />
            <span className="text-sm font-medium flex-1 text-left">
              {language === 'zh' ? '设置' : 'Settings'}
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              expandedMenus.includes('settings') ? 'rotate-180' : ''
            )} />
          </button>
          
          {/* Settings Submenu */}
          <div className={cn(
            'overflow-hidden transition-all duration-200',
            expandedMenus.includes('settings') ? 'max-h-60 mt-1' : 'max-h-0'
          )}>
            <div className="ml-4 pl-4 border-l-2 border-pink-200 dark:border-pink-800 space-y-1">
              {settingsSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                const subActive = subItem.href.includes('?') 
                  ? pathname.startsWith('/settings') && subItem.href.includes(pathname.split('tab=')[1] || 'profile')
                  : pathname === subItem.href
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 active:scale-[0.97] active:bg-pink-200 dark:active:bg-pink-900',
                      subActive
                        ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 font-medium shadow-sm'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <SubIcon className="h-4 w-4" />
                    <span>{language === 'zh' ? subItem.label : subItem.labelEn}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 space-y-2 border-t border-sidebar-border">
        {/* Pricing */}
        <Link
          href="/pricing"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
            pathname === '/pricing'
              ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md shadow-pink-200/50'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
          )}
        >
          <CreditCard className={cn('h-5 w-5', pathname === '/pricing' ? 'text-white' : 'text-pink-400')} />
          <span className="text-sm font-medium">{language === 'zh' ? '订阅' : 'Pricing'}</span>
        </Link>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 px-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex-1 h-9 gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-xl"
          >
            <Languages className="h-4 w-4 text-pink-400" />
            <span className="text-xs">{language === 'zh' ? 'EN' : '中'}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex-1 h-9 gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-xl"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-orange-400" />
            ) : (
              <Moon className="h-4 w-4 text-pink-400" />
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-1 h-9 text-sidebar-foreground/70 hover:bg-pink-100 hover:text-pink-500 rounded-xl"
          >
            <Link href="/">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

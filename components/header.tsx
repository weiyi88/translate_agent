'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            TranslateAI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link
            href="#features"
            className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
          >
            功能特性
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
          >
            价格方案
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
          >
            开发文档
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:inline-flex hover:bg-muted/50 active:scale-95 transition-all duration-200" 
            aria-label="登录账户"
            asChild
          >
            <Link href="/login">登录</Link>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            asChild
          >
            <Link href="/signup">免费开始</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="border-t md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4" aria-label="Mobile navigation">
            <Link
              href="#features"
              className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              功能特性
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              价格方案
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              开发文档
            </Link>
            <div className="border-t my-2" />
            <Link
              href="/login"
              className="text-sm font-medium text-foreground/60 transition-colors duration-200 hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-white bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-md px-3 py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              免费开始
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

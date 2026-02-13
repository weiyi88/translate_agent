'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react'

interface UserMenuProps {
  userName?: string
  userEmail?: string
  avatar?: string
}

export function UserMenu({
  userName = '张三',
  userEmail = 'zhang@example.com',
  avatar,
}: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Simulate logout and redirect to landing page
    router.push('/')
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="用户菜单"
        >
          {avatar ? (
            <img
              src={avatar || "/placeholder.svg"}
              alt={userName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {userName.charAt(0)}
            </div>
          )}
          <span className="hidden text-sm font-medium sm:inline">{userName}</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer w-full">
            <User className="h-4 w-4" aria-hidden="true" />
            <span>个人资料</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer w-full">
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>账号设置</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/pricing" className="flex items-center gap-2 cursor-pointer w-full">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            <span>订阅管理</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer w-full text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>退出登录</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

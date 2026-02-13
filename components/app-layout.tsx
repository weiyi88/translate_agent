'use client'

import React from "react"

import { AppSidebar } from './app-sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  if (!showSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-56">
        {children}
      </main>
    </div>
  )
}

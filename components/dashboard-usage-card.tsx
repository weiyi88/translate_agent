'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UsageCardProps {
  used: number
  total: number
}

export function UsageCard({ used = 85, total = 100 }: UsageCardProps) {
  const percentage = (used / total) * 100

  return (
    <div className="mt-8 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] p-6 text-white">
      <h3 className="mb-1 text-sm font-medium opacity-90">本月使用量</h3>
      
      <div className="mb-6 mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
          <div className="text-sm opacity-90">{used} / {total} 页</div>
        </div>
        
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="使用量进度"
          />
        </div>
      </div>

      <Link href="/pricing" className="inline-block">
        <Button
          size="sm"
          className="w-full bg-white text-primary hover:bg-white/90 transition-colors duration-200"
        >
          升级到 Pro
        </Button>
      </Link>
    </div>
  )
}

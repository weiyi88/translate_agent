'use client'

import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'

interface GlossaryHeaderProps {
  name: string
  count: number
}

export function GlossaryHeader({ name, count }: GlossaryHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          词库: {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {count} 条术语
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-muted/50 active:scale-95 transition-all duration-200 bg-transparent"
          aria-label={`编辑 ${name}`}
        >
          <Edit2 className="h-4 w-4" aria-hidden="true" />
          编辑
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all duration-200 bg-transparent"
          aria-label={`删除 ${name}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          删除
        </Button>
      </div>
    </div>
  )
}

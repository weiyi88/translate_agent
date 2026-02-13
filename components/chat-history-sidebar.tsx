'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Copy, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface HistoryItem {
  id: string
  sourceText: string
  translatedText: string
  timestamp: Date
  sourceLang: string
  targetLang: string
}

interface ChatHistorySidebarProps {
  items?: HistoryItem[]
  onSelect?: (item: HistoryItem) => void
  onDelete?: (id: string) => void
  onClearAll?: () => void
}

export function ChatHistorySidebar({
  items = [],
  onSelect,
  onDelete,
  onClearAll,
}: ChatHistorySidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const groupedByDate = items.reduce(
    (acc, item) => {
      const date = item.timestamp.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const dateKey = item.timestamp.toDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = { date, items: [] }
      }
      acc[dateKey].items.push(item)
      return acc
    },
    {} as Record<string, { date: string; items: HistoryItem[] }>
  )

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-lg border-2 border-border/40 bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold">历史记录</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearAll}
          disabled={items.length === 0}
          aria-label="清除所有历史记录"
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {sortedDates.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            暂无历史记录
          </p>
        ) : (
          sortedDates.map((dateKey) => {
            const { date, items: dateItems } = groupedByDate[dateKey]
            return (
              <div key={dateKey} className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                  {date}
                </h4>

                {dateItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group relative cursor-pointer border transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                    onClick={() => onSelect?.(item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelect?.(item)
                      }
                    }}
                  >
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-medium text-foreground/70 truncate">
                        {item.sourceText.slice(0, 30)}
                        {item.sourceText.length > 30 ? '...' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.sourceLang} → {item.targetLang}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {hoveredId === item.id && (
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(item.translatedText)
                          }}
                          aria-label="复制翻译结果"
                        >
                          <Copy className="h-3 w-3" aria-hidden="true" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.(item.id)
                          }}
                          aria-label="删除历史记录"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

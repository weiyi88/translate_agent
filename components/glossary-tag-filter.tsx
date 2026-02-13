'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'

interface TagOption {
  id: string
  name: string
  count: number
}

const tags: TagOption[] = [
  { id: 'all', name: '全部', count: 0 },
  { id: 'computer', name: '计算机', count: 56 },
  { id: 'medical', name: '医学', count: 34 },
  { id: 'finance', name: '金融', count: 28 },
  { id: 'legal', name: '法律', count: 8 },
]

export function GlossaryTagFilter() {
  const [selected, setSelected] = useState<string[]>(['all'])

  const handleToggle = (tagId: string) => {
    if (tagId === 'all') {
      setSelected(['all'])
    } else {
      const newSelected = selected.filter(s => s !== 'all')
      if (newSelected.includes(tagId)) {
        setSelected(newSelected.filter(s => s !== tagId))
      } else {
        setSelected([...newSelected, tagId])
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover:bg-muted/50 transition-colors duration-200 bg-transparent"
          size="sm"
        >
          标签
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-heading text-sm font-semibold">
          标签过滤
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag.id}
            checked={selected.includes(tag.id)}
            onCheckedChange={() => handleToggle(tag.id)}
            className="flex items-center justify-between gap-2 transition-colors duration-200"
          >
            <div className="flex-1">
              <span className="text-sm">{tag.name}</span>
              {tag.count > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({tag.count})
                </span>
              )}
            </div>
            {selected.includes(tag.id) && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

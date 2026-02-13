'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'

interface LanguageOption {
  id: string
  name: string
  count: number
}

const languages: LanguageOption[] = [
  { id: 'all', name: '全部', count: 126 },
  { id: 'en', name: '英文', count: 45 },
  { id: 'ja', name: '日文', count: 23 },
  { id: 'ko', name: '韩文', count: 18 },
  { id: 'other', name: '其他', count: 40 },
]

export function GlossaryLanguageFilter() {
  const [selected, setSelected] = useState('all')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover:bg-muted/50 transition-colors duration-200 bg-transparent"
          size="sm"
        >
          语言
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-heading text-sm font-semibold">
          语言过滤
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {languages.map((lang) => (
          <DropdownMenuCheckboxItem
            key={lang.id}
            checked={selected === lang.id}
            onCheckedChange={() => setSelected(lang.id)}
            className="flex items-center justify-between gap-2 transition-colors duration-200"
          >
            <div className="flex-1">
              <span className="text-sm">{lang.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({lang.count})
              </span>
            </div>
            {selected === lang.id && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

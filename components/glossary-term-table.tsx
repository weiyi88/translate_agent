'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/i18n'

interface Term {
  id: string
  source: string
  target: string
  language: string
  tags: string[]
}

const terms: Term[] = [
  {
    id: '1',
    source: 'AI',
    target: 'Artificial Intelligence',
    language: '英文',
    tags: ['计算机', '科技'],
  },
  {
    id: '2',
    source: 'ML',
    target: 'Machine Learning',
    language: '英文',
    tags: ['计算机', '科技'],
  },
  {
    id: '3',
    source: '深度学习',
    target: 'Deep Learning',
    language: '英文',
    tags: ['计算机', '科技'],
  },
]

export function GlossaryTermTable() {
  const { language } = useTranslation()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-1/4">{language === 'zh' ? '原文' : 'Source'}</TableHead>
              <TableHead className="w-1/3">{language === 'zh' ? '译文' : 'Target'}</TableHead>
              <TableHead className="w-1/12">{language === 'zh' ? '语言' : 'Lang'}</TableHead>
              <TableHead className="w-1/6">{language === 'zh' ? '标签' : 'Tags'}</TableHead>
              <TableHead className="w-1/12 text-center">{language === 'zh' ? '操作' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terms.map((term) => (
              <TableRow
                key={term.id}
                onMouseEnter={() => setHoveredId(term.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="border-border hover:bg-muted/30 transition-colors duration-200"
              >
                <TableCell className="font-medium text-sm">
                  {term.source}
                </TableCell>
                <TableCell className="text-sm text-foreground/90">
                  {term.target}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {term.language}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex flex-wrap gap-1">
                    {term.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {hoveredId === term.id ? (
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors duration-200"
                        aria-label={`编辑 ${term.source}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                        aria-label={`删除 ${term.source}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-muted transition-colors duration-200"
                          aria-label={`更多操作 ${term.source}`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-200">
                          <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {language === 'zh' ? '编辑' : 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-destructive transition-colors duration-200"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {language === 'zh' ? '删除' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{language === 'zh' ? '共 126 条术语' : '126 terms total'}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            {'◀'}
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'default' : 'outline'}
              size="sm"
              className={`h-8 w-8 p-0 ${
                page === 1
                  ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white'
                  : ''
              }`}
            >
              {page}
            </Button>
          ))}
          <span className="px-2">...</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            13
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
            {'▶'}
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react'

interface Glossary {
  id: string
  name: string
  count: number
}

const glossaries: Glossary[] = [
  { id: '1', name: '技术术语库', count: 126 },
  { id: '2', name: '法律术语库', count: 48 },
  { id: '3', name: '医学术语库', count: 89 },
  { id: '4', name: '金融术语库', count: 67 },
]

export function GlossarySidebar() {
  const [activeId, setActiveId] = useState('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredGlossaries = glossaries.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background overflow-y-auto">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="返回仪表板"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            词库
          </h2>
        </div>

        <Button
          className="w-full gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 hover:shadow-lg active:scale-95 transition-all duration-200"
          size="sm"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          新建词库
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            placeholder="搜索词库..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/50 border-muted focus:border-primary transition-colors duration-200"
            aria-label="搜索词库"
          />
        </div>

        <div className="space-y-2">
          {filteredGlossaries.map((glossary) => (
            <div
              key={glossary.id}
              onMouseEnter={() => setHoveredId(glossary.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <button
                onClick={() => setActiveId(glossary.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeId === glossary.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                <div className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  activeId === glossary.id ? 'bg-primary' : 'bg-muted'
                }`} aria-hidden="true" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate">
                    {glossary.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {glossary.count}
                  </p>
                </div>
              </button>

              {hoveredId === glossary.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors duration-200"
                    aria-label={`编辑 ${glossary.name}`}
                  >
                    <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                    aria-label={`删除 ${glossary.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-muted hover:bg-muted/50 active:scale-95 transition-all duration-200 bg-transparent"
          size="sm"
          asChild
        >
          <Link href="/glossary/upload">
            <Plus className="h-4 w-4" aria-hidden="true" />
            从文件导入
          </Link>
        </Button>
      </div>
    </aside>
  )
}

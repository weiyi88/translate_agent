'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown, Plus, BookOpen } from 'lucide-react'

const glossaries = [
  { id: 'none', name: '无词库', count: 0 },
  { id: 'tech', name: '技术术语库', count: 126 },
  { id: 'legal', name: '法律术语库', count: 48 },
  { id: 'medical', name: '医学术语库', count: 89 },
]

interface TranslateGlossarySelectorProps {
  selectedGlossary: string | null
  onSelect: (id: string | null) => void
}

export function TranslateGlossarySelector({
  selectedGlossary,
  onSelect,
}: TranslateGlossarySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedGlossaryName =
    glossaries.find((g) => g.id === selectedGlossary)?.name || '选择词库'

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">词库 (可选):</p>

      <Card className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-input bg-background px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={isOpen}
          aria-label="选择词库"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-foreground">{selectedGlossaryName}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="absolute top-full z-10 mt-2 w-full rounded-lg border border-input bg-background shadow-lg">
            <div className="space-y-1 p-2">
              {glossaries.map((glossary) => (
                <button
                  key={glossary.id}
                  onClick={() => {
                    onSelect(glossary.id === 'none' ? null : glossary.id)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedGlossary === glossary.id || (glossary.id === 'none' && !selectedGlossary)
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedGlossary === glossary.id || (glossary.id === 'none' && !selectedGlossary)}
                    onChange={() => {}}
                    className="cursor-pointer"
                    aria-label={glossary.name}
                  />
                  <span className="flex-1">{glossary.name}</span>
                  {glossary.count > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({glossary.count} 条)
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>创建新词库</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

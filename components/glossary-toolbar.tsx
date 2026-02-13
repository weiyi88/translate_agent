'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Upload, Plus } from 'lucide-react'
import { GlossaryLanguageFilter } from '@/components/glossary-language-filter'
import { GlossaryTagFilter } from '@/components/glossary-tag-filter'
import { useTranslation } from '@/lib/i18n'

export function GlossaryToolbar() {
  const { language } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            placeholder={language === 'zh' ? '搜索术语...' : 'Search terms...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/50 border-muted focus:border-primary transition-colors duration-200"
            aria-label={language === 'zh' ? '搜索术语' : 'Search terms'}
          />
        </div>

        <GlossaryLanguageFilter />
        <GlossaryTagFilter />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button
          variant="outline"
          className="gap-2 hover:bg-muted/50 transition-colors duration-200 bg-transparent"
          size="sm"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {language === 'zh' ? '导入' : 'Import'}
        </Button>

        <Button
          variant="outline"
          className="gap-2 hover:bg-muted/50 transition-colors duration-200 bg-transparent"
          size="sm"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {language === 'zh' ? '导出' : 'Export'}
        </Button>

        <Button
          className="ml-auto gap-2 bg-gradient-to-r from-pink-400 to-orange-300 text-white hover:opacity-90 transition-opacity duration-200"
          size="sm"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {language === 'zh' ? '添加术语' : 'Add Term'}
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '@/components/app-layout'
import { GlossaryToolbar } from '@/components/glossary-toolbar'
import { GlossaryTermTable } from '@/components/glossary-term-table'
import { GlossaryTermDialog } from '@/components/glossary-term-dialog'
import { GlossaryImportDialog } from '@/components/glossary-import-dialog'
import { GlossaryExportDialog } from '@/components/glossary-export-dialog'
import { useTranslation } from '@/lib/i18n'
import { BookOpen, Plus, Sparkles, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const mockGlossaries = [
  { id: '1', name: '汽车行业术语', nameEn: 'Automotive Terms', termCount: 126, lang: 'zh-CN -> en' },
  { id: '2', name: '医学术语', nameEn: 'Medical Terms', termCount: 89, lang: 'zh-CN -> en' },
  { id: '3', name: 'IT 技术术语', nameEn: 'IT Technical Terms', termCount: 234, lang: 'zh-CN -> en' },
  { id: '4', name: '法律术语', nameEn: 'Legal Terms', termCount: 67, lang: 'zh-CN -> en' },
]

export default function GlossaryPage() {
  const [termDialogOpen, setTermDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [selectedGlossary, setSelectedGlossary] = useState(mockGlossaries[0])
  const [glossaryDropdownOpen, setGlossaryDropdownOpen] = useState(false)
  const { language } = useTranslation()

  const handleImportEvent = useCallback(() => {
    setImportDialogOpen(true)
  }, [])

  useEffect(() => {
    window.addEventListener('open-glossary-import', handleImportEvent)
    return () => window.removeEventListener('open-glossary-import', handleImportEvent)
  }, [handleImportEvent])

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 flex items-center justify-center shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {language === 'zh' ? '词库管理' : 'Glossary Management'}
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh'
                    ? `${selectedGlossary.termCount} 个术语`
                    : `${selectedGlossary.termCount} terms`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Glossary Switcher */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-border bg-card text-foreground hover:bg-muted"
                  onClick={() => setGlossaryDropdownOpen(!glossaryDropdownOpen)}
                >
                  <BookOpen className="h-4 w-4 text-pink-400" />
                  {language === 'zh' ? selectedGlossary.name : selectedGlossary.nameEn}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', glossaryDropdownOpen && 'rotate-180')} />
                </Button>
                {glossaryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-xl z-50 py-2 animate-in slide-in-from-top-2 duration-150">
                    {mockGlossaries.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all duration-150 hover:bg-muted active:scale-[0.98]',
                          selectedGlossary.id === g.id && 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-300'
                        )}
                        onClick={() => {
                          setSelectedGlossary(g)
                          setGlossaryDropdownOpen(false)
                        }}
                      >
                        <BookOpen className="h-4 w-4 text-pink-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-foreground">{language === 'zh' ? g.name : g.nameEn}</p>
                          <p className="text-xs text-muted-foreground">{g.termCount} {language === 'zh' ? '个术语' : 'terms'} &middot; {g.lang}</p>
                        </div>
                        {selectedGlossary.id === g.id && <Check className="h-4 w-4 text-pink-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={() => setTermDialogOpen(true)}
                className="bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" />
                {language === 'zh' ? '添加术语' : 'Add Term'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <GlossaryToolbar />
          <GlossaryTermTable />
        </div>
      </div>

      <GlossaryTermDialog
        open={termDialogOpen}
        onOpenChange={setTermDialogOpen}
        mode="add"
      />
      <GlossaryImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <GlossaryExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </AppLayout>
  )
}

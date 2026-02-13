'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TranslateLanguageSelector } from './translate-language-selector'
import { TranslateModelSelector } from './translate-model-selector'
import { TranslateGlossarySelector } from './translate-glossary-selector'

interface TranslateSidebarProps {
  selectedLanguage: string
  onLanguageChange: (code: string) => void
  selectedModel: string
  onModelChange: (id: string) => void
  selectedGlossary: string | null
  onGlossaryChange: (id: string | null) => void
  isTranslating: boolean
  onTranslate: () => void
}

export function TranslateSidebar({
  selectedLanguage,
  onLanguageChange,
  selectedModel,
  onModelChange,
  selectedGlossary,
  onGlossaryChange,
  isTranslating,
  onTranslate,
}: TranslateSidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 p-4 sm:p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
          翻译设置
        </h2>

        <div className="space-y-6">
          <TranslateLanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={onLanguageChange}
          />

          <div className="border-t pt-6">
            <TranslateModelSelector
              selectedModel={selectedModel}
              onSelect={onModelChange}
            />
          </div>

          <div className="border-t pt-6">
            <TranslateGlossarySelector
              selectedGlossary={selectedGlossary}
              onSelect={onGlossaryChange}
            />
          </div>

          <Button
            onClick={onTranslate}
            disabled={isTranslating}
            size="lg"
            className="w-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 transition-opacity"
          >
            {isTranslating ? (
              <>
                <div className="relative h-4 w-4 mr-2">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
                翻译中...
              </>
            ) : (
              '开始翻译'
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

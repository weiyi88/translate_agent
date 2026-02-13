'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown, Search } from 'lucide-react'

const quickLanguages = [
  { code: 'en', name: '英文' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'pt', name: '葡萄牙语' },
]

const allLanguages = [
  { code: 'en', name: 'English', native: '英语' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '中文 (简体)' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어 (韩语)' },
  { code: 'fr', name: 'French', native: 'Français (法语)' },
  { code: 'de', name: 'German', native: 'Deutsch (德语)' },
  { code: 'es', name: 'Spanish', native: 'Español (西班牙语)' },
  { code: 'pt', name: 'Portuguese', native: 'Português (葡萄牙语)' },
  { code: 'ru', name: 'Russian', native: 'Русский (俄语)' },
  { code: 'ar', name: 'Arabic', native: 'العربية (阿拉伯语)' },
  { code: 'th', name: 'Thai', native: 'ไทย (泰语)' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt (越南语)' },
]

interface TranslateLanguageSelectorProps {
  selectedLanguage: string
  onSelect: (code: string) => void
}

export function TranslateLanguageSelector({
  selectedLanguage,
  onSelect,
}: TranslateLanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLanguages = allLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedLangName = allLanguages.find(
    (lang) => lang.code === selectedLanguage
  )?.native || '选择语言'

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">目标语言:</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(lang.code)}
              className={
                selectedLanguage === lang.code
                  ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white'
                  : ''
              }
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </div>

      <Card className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-input bg-background px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={isOpen}
          aria-label="选择语言"
        >
          <span className="text-foreground">{selectedLangName}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full rounded-lg border border-input bg-background shadow-lg">
            <div className="border-b p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="搜索语言..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="搜索语言"
                />
              </div>
            </div>

            <div className="max-h-48 space-y-1 overflow-y-auto p-2">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelect(lang.code)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedLanguage === lang.code}
                      onChange={() => {}}
                      className="cursor-pointer"
                      aria-label={lang.native}
                    />
                    <span>{lang.native}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  未找到匹配的语言
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

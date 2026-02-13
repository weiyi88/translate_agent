'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { AppLayout } from '@/components/app-layout'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  ArrowLeftRight,
  Send,
  Copy,
  Check,
  Loader2,
  Plus,
  Trash2,
  Clock,
  X,
  MessageCircle,
  Sparkles,
  Heart,
} from 'lucide-react'

interface HistoryItem {
  id: string
  sourceText: string
  translatedText: string
  timestamp: Date
  sourceLang: string
  targetLang: string
}

const languages = [
  { code: 'zh-CN', name: '简体中文', nameEn: 'Chinese', flag: '' },
  { code: 'en', name: 'English', nameEn: 'English', flag: '' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese', flag: '' },
  { code: 'ko', name: '한국어', nameEn: 'Korean', flag: '' },
  { code: 'fr', name: 'Français', nameEn: 'French', flag: '' },
  { code: 'de', name: 'Deutsch', nameEn: 'German', flag: '' },
  { code: 'es', name: 'Español', nameEn: 'Spanish', flag: '' },
]

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    sourceText: '车型名称',
    translatedText: 'Vehicle model name',
    timestamp: new Date(Date.now() - 5 * 60000),
    sourceLang: 'zh-CN',
    targetLang: 'en',
  },
  {
    id: '2',
    sourceText: '这是一个测试翻译',
    translatedText: 'This is a test translation',
    timestamp: new Date(Date.now() - 15 * 60000),
    sourceLang: 'zh-CN',
    targetLang: 'en',
  },
  {
    id: '3',
    sourceText: '人工智能正在改变世界',
    translatedText: 'Artificial intelligence is changing the world',
    timestamp: new Date(Date.now() - 60 * 60000),
    sourceLang: 'zh-CN',
    targetLang: 'en',
  },
]

export default function ChatPage() {
  const { t, language } = useTranslation()
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('zh-CN')
  const [targetLang, setTargetLang] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory)
  const [charCount, setCharCount] = useState(0)
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setCharCount(sourceText.length)
  }, [sourceText])

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim() || isTranslating) return

    setIsTranslating(true)
    setTranslatedText('')

    await new Promise((r) => setTimeout(r, 500))

    const mockTranslations: Record<string, string> = {
      '车型名称': 'Vehicle model name',
      '你好': 'Hello',
      'Hello': '你好',
      '测试': 'Test',
    }

    let result = mockTranslations[sourceText.trim()] || 
      (sourceLang.startsWith('zh') 
        ? `Translation of "${sourceText}"` 
        : `"${sourceText}" 的翻译结果`)

    for (let i = 0; i <= result.length; i++) {
      await new Promise((r) => setTimeout(r, 20))
      setTranslatedText(result.slice(0, i))
    }

    setIsTranslating(false)

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      sourceText: sourceText.trim(),
      translatedText: result,
      timestamp: new Date(),
      sourceLang,
      targetLang,
    }
    setHistory((prev) => [newItem, ...prev])
  }, [sourceText, sourceLang, targetLang, isTranslating])

  const handleCopy = async () => {
    if (!translatedText) return
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClearSource = () => {
    setSourceText('')
    setTranslatedText('')
    sourceTextareaRef.current?.focus()
  }

  const handleSelectHistory = (item: HistoryItem) => {
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setSourceLang(item.sourceLang)
    setTargetLang(item.targetLang)
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleNewConversation = () => {
    setSourceText('')
    setTranslatedText('')
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return language === 'zh' ? '刚刚' : 'Just now'
    if (minutes < 60) return language === 'zh' ? `${minutes}分钟前` : `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return language === 'zh' ? `${hours}小时前` : `${hours}h ago`
    return date.toLocaleDateString()
  }

  const getLangName = (code: string) => {
    const lang = languages.find((l) => l.code === code)
    return language === 'zh' ? lang?.name : lang?.nameEn
  }

  return (
    <AppLayout>
      <div className="flex h-screen bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Left Sidebar - History */}
        <div className="w-72 flex flex-col border-r border-border bg-card shrink-0">
          {/* History Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-pink-400" />
              {t.chat.history}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-xl"
              onClick={handleNewConversation}
              title={t.chat.newConversation}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-auto p-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mb-3">
                  <Clock className="h-8 w-8 text-pink-300" />
                </div>
                <p className="text-sm text-stone-500">
                  {language === 'zh' ? '暂无历史记录' : 'No history yet'}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {language === 'zh' ? '开始翻译后会显示在这里~' : 'Start translating to see history~'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all duration-200 border border-transparent hover:border-border"
                    onClick={() => handleSelectHistory(item)}
                  >
                    <p className="text-sm text-foreground truncate pr-6 font-medium">
                      {item.sourceText}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.translatedText}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 px-1.5 py-0.5 rounded-full">
                        {getLangName(item.sourceLang)}
                      </span>
                      <span>→</span>
                      <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 px-1.5 py-0.5 rounded-full">
                        {getLangName(item.targetLang)}
                      </span>
                      <span className="ml-auto">{formatTime(item.timestamp)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteHistory(item.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear History Button */}
          {history.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                onClick={handleClearHistory}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.chat.clearHistory}
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              {/* Source Language */}
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-36 h-10 bg-card border-border rounded-xl text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                      {lang.flag} {language === 'zh' ? lang.name : lang.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Swap Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-xl"
                onClick={swapLanguages}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              {/* Target Language */}
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-36 h-10 bg-card border-border rounded-xl text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                      {lang.flag} {language === 'zh' ? lang.name : lang.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Translate Button */}
            <Button
              className="gap-2 bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl h-10 px-6"
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
            >
              {isTranslating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {language === 'zh' ? '翻译' : 'Translate'}
            </Button>
          </div>

          {/* Translation Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Source Panel */}
            <div className="flex-1 flex flex-col border-r border-border bg-card">
              <div className="flex-1 relative">
                <textarea
                  ref={sourceTextareaRef}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder={t.chat.inputPlaceholder}
                  className="w-full h-full resize-none bg-card p-5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-base leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleTranslate()
                    }
                  }}
                />
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 text-muted-foreground/50 hover:text-foreground hover:bg-muted rounded-lg"
                    onClick={handleClearSource}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {/* Character Count & Add Button */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-md"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{charCount}</span>
                  <span>Ctrl + Enter {language === 'zh' ? '翻译' : 'to translate'}</span>
                </div>
              </div>
            </div>

            {/* Target Panel */}
            <div className="flex-1 flex flex-col bg-muted/20">
              <div className="flex-1 relative p-5">
                {isTranslating && !translatedText ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
                    <span>{t.translation.translating}</span>
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                  </div>
                ) : translatedText ? (
                  <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
                    {translatedText}
                    {isTranslating && <span className="inline-block w-0.5 h-5 bg-pink-400 ml-0.5 animate-pulse" />}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="h-12 w-12 text-pink-200 dark:text-pink-800 mb-3" />
                    <p className="text-muted-foreground">{t.chat.outputPlaceholder}</p>
                  </div>
                )}
                
                {/* Copy Button */}
                {translatedText && !isTranslating && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 rounded-lg"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              {/* Bottom Info */}
              {translatedText && (
                <div className="flex items-center justify-end px-5 py-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3 w-3 text-pink-400 fill-pink-400" />
                    {translatedText.length} {language === 'zh' ? '字符' : 'chars'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

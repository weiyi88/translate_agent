'use client'

import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { AlertCircle, Trash2 } from 'lucide-react'

interface ChatInputAreaProps {
  onTranslate: (text: string, sourceLang: string, targetLang: string, model: string) => void
  isLoading?: boolean
}

export function ChatInputArea({ onTranslate, isLoading = false }: ChatInputAreaProps) {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [model, setModel] = useState('gpt-4o')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = text.length
  const maxChars = 5000
  const isOverLimit = charCount > maxChars
  const isValidForm = text.trim().length > 0

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [text])

  const handleClear = () => {
    if (text.trim()) {
      const confirmed = confirm('确定要清空输入框吗？')
      if (confirmed) {
        setText('')
      }
    }
  }

  const handleTranslate = () => {
    if (isValidForm && !isOverLimit) {
      onTranslate(text, sourceLang, targetLang, model)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="translate-input" className="text-sm font-medium">
          输入文本
        </label>

        <div className="relative">
          <textarea
            ref={textareaRef}
            id="translate-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入要翻译的文本..."
            maxLength={isOverLimit ? undefined : maxChars}
            className={`w-full resize-none rounded-lg border-2 bg-background p-4 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isOverLimit
                ? 'border-destructive'
                : 'border-border/40 focus:border-primary/50'
            }`}
            aria-label="输入要翻译的文本"
            aria-invalid={isOverLimit}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOverLimit && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <span>已超过字符限制</span>
              </div>
            )}
          </div>
          <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">语言选择</label>
        <div className="flex gap-3">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 rounded-lg border-2 border-border/40 bg-background px-3 py-2 text-foreground transition-colors duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="源语言"
          >
            <option value="auto">自动检测</option>
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="ja">日文</option>
            <option value="ko">韩文</option>
            <option value="fr">法文</option>
            <option value="de">德文</option>
            <option value="es">西班牙文</option>
          </select>

          <div className="flex items-center justify-center px-2 text-muted-foreground" aria-hidden="true">
            →
          </div>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 rounded-lg border-2 border-border/40 bg-background px-3 py-2 text-foreground transition-colors duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="目标语言"
          >
            <option value="en">英文</option>
            <option value="zh">中文</option>
            <option value="ja">日文</option>
            <option value="ko">韩文</option>
            <option value="fr">法文</option>
            <option value="de">德文</option>
            <option value="es">西班牙文</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="model-select" className="text-sm font-medium">
          AI 模型
        </label>
        <select
          id="model-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-lg border-2 border-border/40 bg-background px-3 py-2 text-foreground transition-colors duration-200 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="claude-3.5">Claude 3.5</option>
        </select>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 transition-colors duration-200 hover:bg-muted/50 bg-transparent"
          onClick={handleClear}
          disabled={!text}
          aria-label="清空输入框"
        >
          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
          清除
        </Button>
        <Button
          className="flex-1 gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
          onClick={handleTranslate}
          disabled={!isValidForm || isLoading || isOverLimit}
          aria-label={isLoading ? '翻译中...' : '开始翻译'}
        >
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              翻译中...
            </>
          ) : (
            '翻译'
          )}
        </Button>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Save, Share2, Pause, Square } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChatOutputAreaProps {
  result: string
  isLoading?: boolean
  isStreaming?: boolean
  progress?: number
  onCopy?: () => void
  onSave?: () => void
  onShare?: () => void
  onPause?: () => void
  onStop?: () => void
}

export function ChatOutputArea({
  result,
  isLoading = false,
  isStreaming = false,
  progress = 0,
  onCopy,
  onSave,
  onShare,
  onPause,
  onStop,
}: ChatOutputAreaProps) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (!isStreaming) {
      setDisplayText(result)
      return
    }

    if (!result) {
      setDisplayText('')
      return
    }

    const speed = 20
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < result.length) {
        setDisplayText(result.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [result, isStreaming])

  const hasContent = displayText.length > 0
  const canCopy = hasContent && !isLoading

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-lg">翻译结果</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="min-h-32 rounded-lg border-2 border-border/40 bg-muted/30 p-4">
          {isLoading && !isStreaming ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-12 w-12 items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">正在翻译...</p>
                <div className="w-48 rounded-full bg-muted">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="翻译进度"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {displayText || (
                <span className="text-muted-foreground">翻译结果将显示在这里...</span>
              )}
              {isStreaming && <span className="animate-pulse">|</span>}
            </div>
          )}
        </div>

        {hasContent && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 transition-colors duration-200 hover:bg-muted/50 bg-transparent"
              onClick={onCopy}
              disabled={!canCopy}
              aria-label="复制翻译结果"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              复制
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-2 transition-colors duration-200 hover:bg-muted/50 bg-transparent"
              onClick={onSave}
              aria-label="保存到术语库"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              保存
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-2 transition-colors duration-200 hover:bg-muted/50 bg-transparent"
              onClick={onShare}
              aria-label="分享翻译结果"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              分享
            </Button>

            {isStreaming && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 transition-colors duration-200 hover:bg-muted/50 bg-transparent"
                  onClick={onPause}
                  aria-label="暂停翻译"
                >
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  暂停
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 transition-colors duration-200 hover:bg-destructive/10 text-destructive hover:text-destructive bg-transparent"
                  onClick={onStop}
                  aria-label="停止翻译"
                >
                  <Square className="h-4 w-4" aria-hidden="true" />
                  停止
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

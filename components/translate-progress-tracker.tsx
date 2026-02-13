'use client'

import { AlertCircle, CheckCircle2, RefreshCw, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export type TranslationPhase = 'idle' | 'uploading' | 'translating' | 'completed' | 'error'

interface TranslateProgressTrackerProps {
  phase: TranslationPhase
  fileName?: string
  progress?: number
  currentPage?: number
  totalPages?: number
  estimatedTimeLeft?: number
  elapsedTime?: string
  fileSize?: string
  errorMessage?: string
  onRetry?: () => void
  onDownload?: () => void
  onRetranslate?: () => void
}

export function TranslateProgressTracker({
  phase,
  fileName = '',
  progress = 0,
  currentPage = 0,
  totalPages = 0,
  estimatedTimeLeft = 0,
  elapsedTime = '',
  fileSize = '',
  errorMessage = '',
  onRetry,
  onDownload,
  onRetranslate,
}: TranslateProgressTrackerProps) {
  if (phase === 'idle') return null

  return (
    <Card className="overflow-hidden border-2">
      <div className="space-y-4 p-4">
        {/* Header with Icon and File Name */}
        <div className="flex items-center gap-3">
          {phase === 'uploading' && (
            <div className="relative h-5 w-5">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
            </div>
          )}
          {phase === 'translating' && (
            <div className="relative h-5 w-5">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-secondary" />
            </div>
          )}
          {phase === 'completed' && (
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
          )}
          {phase === 'error' && (
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" aria-hidden="true" />
          )}

          <div>
            <p className="text-sm font-semibold text-foreground">
              {phase === 'uploading' && '📤 上传中'}
              {phase === 'translating' && '⚙️ 翻译中'}
              {phase === 'completed' && '✓ 翻译完成'}
              {phase === 'error' && '✗ 翻译失败'}
            </p>
            {fileName && (
              <p className="text-xs text-muted-foreground">{fileName}</p>
            )}
          </div>
        </div>

        {/* Progress Bar (for uploading and translating) */}
        {(phase === 'uploading' || phase === 'translating') && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {phase === 'uploading' && `上传中... ${progress}%`}
                  {phase === 'translating' && `翻译中... ${progress}%`}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {/* File Size or Page Info */}
            <div className="space-y-1 text-xs text-muted-foreground">
              {phase === 'uploading' && fileSize && (
                <p>{fileSize}</p>
              )}
              {phase === 'translating' && currentPage > 0 && totalPages > 0 && (
                <p>正在处理第 {currentPage}/{totalPages} 页</p>
              )}
            </div>

            {/* Estimated Time */}
            {estimatedTimeLeft && (
              <p className="text-xs text-muted-foreground">
                预计剩余: {estimatedTimeLeft}秒
              </p>
            )}
          </>
        )}

        {/* Completed State */}
        {phase === 'completed' && (
          <div className="space-y-3">
            <div className="space-y-1 text-xs text-muted-foreground">
              {elapsedTime && <p>耗时: {elapsedTime}</p>}
              {fileSize && <p>文件大小: {fileSize}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="sm"
                onClick={onDownload}
                className="flex-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                下载翻译结果
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onRetranslate}
                className="flex-1 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                重新翻译
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {phase === 'error' && (
          <div className="space-y-3">
            {errorMessage && (
              <p className="text-sm text-destructive">
                错误: {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="flex-1 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                重新上传
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {}}
                className="flex-1"
              >
                联系支持
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

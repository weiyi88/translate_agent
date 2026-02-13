'use client';

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Download, Trash2, RotateCw } from 'lucide-react'

interface HistoryDetailModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  translation: {
    id: string
    fileName: string
    fileSize: string
    sourceLanguage: string
    targetLanguage: string
    model: string
    timestamp: string
    duration: string
    pageCount: number
    characterCount: number
    sourcePreview: string
    targetPreview: string
  }
  onDownloadSource: () => void
  onDownloadTarget: () => void
  onRetranslate: () => void
}

export function HistoryDetailModal({
  isOpen,
  onOpenChange,
  translation,
  onDownloadSource,
  onDownloadTarget,
  onRetranslate,
}: HistoryDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">翻译详情</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-foreground/60">文件</p>
              <p className="mt-1 break-all font-medium">{translation.fileName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">大小</p>
              <p className="mt-1 font-medium">{translation.fileSize}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">语言对</p>
              <p className="mt-1 font-medium">
                {translation.sourceLanguage} → {translation.targetLanguage}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">模型</p>
              <p className="mt-1 font-medium">{translation.model}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">时间</p>
              <p className="mt-1 font-medium">{translation.timestamp}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">耗时</p>
              <p className="mt-1 font-medium">{translation.duration}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">页数</p>
              <p className="mt-1 font-medium">{translation.pageCount}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">字符数</p>
              <p className="mt-1 font-medium">{translation.characterCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-heading font-semibold">翻译预览</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/60">原文</p>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
                  {translation.sourcePreview}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground/60">译文</p>
                <div className="rounded-lg border bg-primary/5 p-3 text-sm leading-relaxed">
                  {translation.targetPreview}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t pt-6 sm:flex-row">
            <Button
              variant="outline"
              onClick={onDownloadSource}
              className="flex-1 gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              下载原文
            </Button>
            <Button
              variant="outline"
              onClick={onDownloadTarget}
              className="flex-1 gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              下载译文
            </Button>
            <Button
              onClick={onRetranslate}
              className="flex-1 gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 transition-opacity duration-200"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              重新翻译
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client';

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Eye, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { FileIcon } from 'lucide-react'

interface HistoryItemProps {
  id: string
  fileName: string
  fileType: string
  sourceLanguage: string
  targetLanguage: string
  status: 'success' | 'failed' | 'processing'
  timeAgo: string
  pageCount: number
  fileSize?: string
  duration?: string
  model?: string
  onDownload: (id: string) => void
  onViewDetails: (id: string) => void
  onDelete: (id: string) => void
}

const statusConfig = {
  success: { icon: '✅', label: '成功', color: 'text-green-600' },
  failed: { icon: '❌', label: '失败', color: 'text-red-600' },
  processing: { icon: '⏳', label: '进行中', color: 'text-yellow-600' },
}

export function HistoryItem({
  id,
  fileName,
  fileType,
  sourceLanguage,
  targetLanguage,
  status,
  timeAgo,
  pageCount,
  fileSize,
  duration,
  model,
  onDownload,
  onViewDetails,
  onDelete,
}: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const statusInfo = statusConfig[status]

  return (
    <Card className="border transition-all duration-200 hover:border-primary/50 hover:shadow-lg focus-within:border-primary/50 focus-within:shadow-lg">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <h3 className="font-heading text-base font-semibold truncate">{fileName}</h3>
            </div>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                {sourceLanguage} → {targetLanguage} · {timeAgo}
              </p>
              <p className="flex items-center gap-2">
                <span className={statusInfo.color}>{statusInfo.icon}</span>
                <span>
                  {statusInfo.label} · {pageCount} 页
                  {fileSize && ` · ${fileSize}`}
                </span>
              </p>
            </div>
          </div>

          <div className="hidden gap-2 md:flex md:items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(id)}
              className="gap-1.5"
              disabled={status !== 'success'}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">下载</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(id)}
              className="gap-1.5"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">详情</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(id)}
              className="gap-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">删除</span>
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
            aria-label={isExpanded ? '收起详情' : '展开详情'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4 md:hidden">
            <div className="space-y-2 text-sm text-muted-foreground">
              {model && <p>模型: {model}</p>}
              {duration && <p>耗时: {duration}</p>}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(id)}
                className="flex-1 gap-1.5"
                disabled={status !== 'success'}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                下载
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(id)}
                className="flex-1 gap-1.5"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                详情
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(id)}
                className="flex-1 gap-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                删除
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

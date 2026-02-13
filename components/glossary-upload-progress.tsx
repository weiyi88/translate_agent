'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgressStatus {
  successCount: number
  skipCount: number
  errorCount: number
  totalCount: number
  currentProgress: number
}

export function UploadProgress({ successCount, skipCount, errorCount, totalCount, currentProgress }: ProgressStatus) {
  const estimatedRemaining = Math.max(0, Math.ceil((100 - currentProgress) / 2))

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>上传进度</CardTitle>
        <CardDescription>正在处理您的词库...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">进度</span>
            <span className="text-sm text-muted-foreground">{currentProgress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <p className="text-sm text-muted-foreground">已导入</p>
            <p className="text-2xl font-bold text-green-600">{successCount}</p>
            <p className="text-xs text-muted-foreground">条成功</p>
          </div>
          <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-muted-foreground">跳过</p>
            <p className="text-2xl font-bold text-yellow-600">{skipCount}</p>
            <p className="text-xs text-muted-foreground">条重复</p>
          </div>
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <p className="text-sm text-muted-foreground">错误</p>
            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
            <p className="text-xs text-muted-foreground">条失败</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border-2 bg-muted/50 p-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            预计剩余 <span className="font-medium text-foreground">{estimatedRemaining} 秒</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

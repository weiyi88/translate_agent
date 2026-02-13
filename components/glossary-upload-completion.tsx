'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface CompletionStatus {
  successCount: number
  skipCount: number
  errorCount: number
}

export function UploadCompletion({ successCount, skipCount, errorCount }: CompletionStatus) {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-500" aria-hidden="true" />
          <div>
            <CardTitle>上传完成</CardTitle>
            <CardDescription>您的词库已成功导入</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <p className="text-sm text-muted-foreground">成功导入 {successCount + skipCount + errorCount} 条术语</p>
          <p className="text-2xl font-bold text-green-600">{successCount} 条成功</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border-2 bg-muted/50 p-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
            <span className="text-sm">
              <span className="font-medium text-green-600">{successCount}</span>
              <span className="text-muted-foreground"> 条成功</span>
            </span>
          </div>
          {skipCount > 0 && (
            <div className="flex items-center gap-3 rounded-lg border-2 bg-muted/50 p-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" aria-hidden="true" />
              <span className="text-sm">
                <span className="font-medium text-yellow-600">{skipCount}</span>
                <span className="text-muted-foreground"> 条跳过 (重复)</span>
              </span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-3 rounded-lg border-2 bg-muted/50 p-3">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" aria-hidden="true" />
              <span className="text-sm">
                <span className="font-medium text-red-600">{errorCount}</span>
                <span className="text-muted-foreground"> 条失败</span>
              </span>
            </div>
          )}
        </div>

        {errorCount > 0 && (
          <Button variant="outline" className="w-full border-2 bg-transparent">
            查看失败记录
          </Button>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="border-2 bg-transparent">
            查看词库
          </Button>
          <Button variant="outline" className="border-2 bg-transparent">
            上传更多
          </Button>
          <Button variant="outline" className="border-2 bg-transparent">
            返回
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

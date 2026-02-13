'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface PreviewTerm {
  id: string
  source: string
  target: string
  status: 'success' | 'warning' | 'error'
  error?: string
}

interface PreviewTableProps {
  terms: PreviewTerm[]
  totalCount: number
  warningCount: number
}

export function PreviewTable({ terms, totalCount, warningCount }: PreviewTableProps) {
  const getStatusIcon = (status: PreviewTerm['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>预览和确认</CardTitle>
            <CardDescription>检测到 {totalCount} 条术语</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            展开全部
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="px-4 py-3 text-left text-sm font-semibold">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">原文</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">译文</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">错误</th>
              </tr>
            </thead>
            <tbody>
              {terms.slice(0, 10).map((term) => (
                <tr key={term.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3">{getStatusIcon(term.status)}</td>
                  <td className="px-4 py-3 text-sm">{term.source}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{term.target}</td>
                  <td className="px-4 py-3 text-sm text-red-600">{term.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border-2 bg-muted/50 p-4">
          <p className="text-sm text-foreground">
            显示前 10 条 · 共 {totalCount} 条
            {warningCount > 0 && ` · ${warningCount} 条警告`}
          </p>
          {warningCount > 0 && (
            <Button variant="link" size="sm" className="mt-2 p-0 text-primary">
              查看详情
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

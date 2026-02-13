'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Download, ChevronDown } from 'lucide-react'

interface HistoryFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  dateFilter: string
  onDateFilterChange: (filter: string) => void
  typeFilter: string
  onTypeFilterChange: (filter: string) => void
  statusFilter: string
  onStatusFilterChange: (filter: string) => void
  onExport: () => void
}

const dateOptions = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
]

const typeOptions = [
  { value: 'all', label: '全部', count: null },
  { value: 'ppt', label: 'PPT', count: 45 },
  { value: 'word', label: 'Word', count: 23 },
  { value: 'excel', label: 'Excel', count: 18 },
  { value: 'pdf', label: 'PDF', count: 42 },
]

const statusOptions = [
  { value: 'all', label: '全部', count: null },
  { value: 'success', label: '成功', count: 115 },
  { value: 'failed', label: '失败', count: 8 },
  { value: 'processing', label: '进行中', count: 5 },
]

export function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
}: HistoryFilterBarProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="搜索文件名或翻译语言..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              日期 <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={dateFilter} onValueChange={onDateFilterChange}>
              {dateOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              类型 <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={typeFilter} onValueChange={onTypeFilterChange}>
              {typeOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              状态 <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={onStatusFilterChange}>
              {statusOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onExport} className="gap-2 bg-transparent" variant="outline">
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">导出</span>
        </Button>
      </div>
    </div>
  )
}

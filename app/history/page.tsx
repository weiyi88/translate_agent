'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Search,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  Sparkles,
  Heart,
} from 'lucide-react'

type TranslationStatus = 'completed' | 'failed' | 'processing'

interface HistoryRecord {
  id: string
  fileName: string
  fileType: string
  fileSize: string
  sourceLang: string
  targetLang: string
  status: TranslationStatus
  createdAt: Date
  completedAt?: Date
  duration?: string
  model: string
  pageCount: number
  characterCount: number
}

const mockHistoryData: HistoryRecord[] = [
  {
    id: '1',
    fileName: 'presentation.pptx',
    fileType: 'pptx',
    fileSize: '2.5 MB',
    sourceLang: '简体中文',
    targetLang: 'English',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60000),
    completedAt: new Date(Date.now() - 60000),
    duration: '1分23秒',
    model: 'GPT-4o',
    pageCount: 12,
    characterCount: 15234,
  },
  {
    id: '2',
    fileName: 'report.docx',
    fileType: 'docx',
    fileSize: '1.2 MB',
    sourceLang: 'English',
    targetLang: '日本語',
    status: 'completed',
    createdAt: new Date(Date.now() - 60 * 60000),
    completedAt: new Date(Date.now() - 59 * 60000),
    duration: '45秒',
    model: 'GPT-4o Mini',
    pageCount: 5,
    characterCount: 8456,
  },
  {
    id: '3',
    fileName: 'budget_2024.xlsx',
    fileType: 'xlsx',
    fileSize: '856 KB',
    sourceLang: 'English',
    targetLang: '简体中文',
    status: 'failed',
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    model: 'Claude 3.5',
    pageCount: 1,
    characterCount: 3200,
  },
  {
    id: '4',
    fileName: 'manual.pdf',
    fileType: 'pdf',
    fileSize: '5.8 MB',
    sourceLang: '简体中文',
    targetLang: '한국어',
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 60 * 60000),
    completedAt: new Date(Date.now() - 2.9 * 60 * 60000),
    duration: '2分15秒',
    model: 'GPT-4o',
    pageCount: 20,
    characterCount: 45678,
  },
  {
    id: '5',
    fileName: 'contract.docx',
    fileType: 'docx',
    fileSize: '2.1 MB',
    sourceLang: '简体中文',
    targetLang: 'English',
    status: 'processing',
    createdAt: new Date(Date.now() - 30000),
    model: 'GPT-4o',
    pageCount: 8,
    characterCount: 12340,
  },
]

export default function HistoryPage() {
  const { t, language } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = mockHistoryData.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || item.fileType === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredData.map((item) => item.id)))
    }
  }

  const handleExportSelected = (type: 'source' | 'translated' | 'both') => {
    const selected = filteredData.filter((item) => selectedIds.has(item.id))
    console.log(`Exporting ${type}:`, selected.map((s) => s.fileName))
    alert(
      language === 'zh'
        ? `正在导出 ${selected.length} 个文件的${type === 'source' ? '源文件' : type === 'translated' ? '译文' : '源文件和译文'}...`
        : `Exporting ${type === 'both' ? 'source and translated files' : type + ' files'} for ${selected.length} items...`
    )
  }

  const handleDelete = (id: string) => {
    const item = filteredData.find((i) => i.id === id)
    if (confirm(language === 'zh' ? `确定要删除 ${item?.fileName} 吗？` : `Delete ${item?.fileName}?`)) {
      // Handle delete
    }
  }

  const handleClearAll = () => {
    if (confirm(language === 'zh' ? '确定要清空所有翻译历史吗？此操作无法撤销。' : 'Clear all history? This cannot be undone.')) {
      // Handle clear
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-rose-400" />
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-400" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
      case 'pptx':
      case 'ppt':
        return <FileImage className="h-5 w-5 text-orange-400" />
      default:
        return <File className="h-5 w-5 text-stone-400" />
    }
  }

  const getStatusBadge = (status: TranslationStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            {t.history.statusCompleted}
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-600">
            <XCircle className="h-3 w-3" />
            {t.history.statusFailed}
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t.history.statusProcessing}
          </span>
        )
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return language === 'zh' ? '刚刚' : 'Just now'
    if (minutes < 60) return language === 'zh' ? `${minutes}分钟前` : `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return language === 'zh' ? `${hours}小时前` : `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return language === 'zh' ? `${days}天前` : `${days}d ago`
    return date.toLocaleDateString()
  }

  const isAllSelected = filteredData.length > 0 && selectedIds.size === filteredData.length
  const hasSelection = selectedIds.size > 0

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-pink-400" />
              {t.history.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {language === 'zh' ? `共 ${filteredData.length} 条记录` : `${filteredData.length} records total`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasSelection && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-md shadow-pink-200/50 dark:shadow-pink-900/30 rounded-xl">
                    <Download className="h-4 w-4" />
                    {t.history.exportSelected} ({selectedIds.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border rounded-xl">
                  <DropdownMenuItem onClick={() => handleExportSelected('source')} className="rounded-lg">
                    {t.history.exportSourceFiles}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportSelected('translated')} className="rounded-lg">
                    {t.history.exportTranslatedFiles}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => handleExportSelected('both')} className="rounded-lg">
                    {language === 'zh' ? '导出全部文件' : 'Export All Files'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="outline"
              className="gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 border-border rounded-xl bg-transparent"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4" />
              {t.history.clearAll}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/30 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'zh' ? '搜索文件名...' : 'Search files...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border rounded-xl focus:border-pink-400 focus:ring-pink-400 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 bg-card border-border rounded-xl">
              <Filter className="h-4 w-4 mr-2 text-pink-400" />
              <SelectValue placeholder={t.history.fileType} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              <SelectItem value="all" className="rounded-lg">{t.common.all}</SelectItem>
              <SelectItem value="pdf" className="rounded-lg">PDF</SelectItem>
              <SelectItem value="docx" className="rounded-lg">Word</SelectItem>
              <SelectItem value="pptx" className="rounded-lg">PowerPoint</SelectItem>
              <SelectItem value="xlsx" className="rounded-lg">Excel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-card border-border rounded-xl">
              <SelectValue placeholder={t.history.status} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              <SelectItem value="all" className="rounded-lg">{t.common.all}</SelectItem>
              <SelectItem value="completed" className="rounded-lg">{t.history.statusCompleted}</SelectItem>
              <SelectItem value="processing" className="rounded-lg">{t.history.statusProcessing}</SelectItem>
              <SelectItem value="failed" className="rounded-lg">{t.history.statusFailed}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-muted/30 text-xs font-semibold text-foreground/60 shrink-0">
          <div className="w-8">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
              aria-label={t.history.selectAll}
              className="border-border data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
            />
          </div>
          <div className="flex-1">{t.history.fileName}</div>
          <div className="w-40">{t.history.languagePair}</div>
          <div className="w-28">{t.history.status}</div>
          <div className="w-28">{t.history.createdAt}</div>
          <div className="w-20">{t.history.duration}</div>
          <div className="w-20 text-right">{t.history.actions}</div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          {paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-pink-100 dark:from-pink-950/40 to-orange-100 dark:to-orange-950/40 flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-pink-300 dark:text-pink-600" />
              </div>
              <p className="text-muted-foreground">{t.history.noHistory}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {language === 'zh' ? '翻译文档后会显示在这里~' : 'Translated documents will appear here~'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {paginatedData.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-all duration-200',
                    selectedIds.has(item.id) && 'bg-muted'
                  )}
                >
                  <div className="w-8">
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                      aria-label={`Select ${item.fileName}`}
                      className="border-border data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted shrink-0">
                      {getFileIcon(item.fileType)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.fileName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {item.fileSize} · {item.pageCount} {language === 'zh' ? '页' : 'pages'} · {item.characterCount.toLocaleString()} {language === 'zh' ? '字符' : 'chars'}
                      </p>
                    </div>
                  </div>
                  <div className="w-40 flex items-center gap-1.5 text-sm text-foreground">
                    <span className="bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full text-xs">{item.sourceLang}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full text-xs">{item.targetLang}</span>
                  </div>
                  <div className="w-28">{getStatusBadge(item.status)}</div>
                  <div className="w-28 text-sm text-muted-foreground">{formatTime(item.createdAt)}</div>
                  <div className="w-20 text-sm text-muted-foreground">{item.duration || '-'}</div>
                  <div className="w-20 flex items-center justify-end gap-1">
                    {item.status === 'completed' && (
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted hover:text-pink-500 rounded-xl">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border rounded-xl">
                        {item.status === 'completed' && (
                          <>
                            <DropdownMenuItem className="rounded-lg">
                              <Download className="h-4 w-4 mr-2" />
                              {t.history.exportSourceFiles}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">
                              <Download className="h-4 w-4 mr-2" />
                              {t.history.exportTranslatedFiles}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                          </>
                        )}
                        <DropdownMenuItem
                          className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 rounded-lg"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.history.deleteHistory}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-pink-100 bg-white shrink-0">
            <p className="text-sm text-stone-500">
              {hasSelection
                ? `${t.history.selected} ${selectedIds.size} ${t.history.items}`
                : `${language === 'zh' ? '第' : 'Page'} ${currentPage} ${language === 'zh' ? '页，共' : 'of'} ${totalPages} ${language === 'zh' ? '页' : ''}`}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-pink-200 hover:bg-pink-50 rounded-xl bg-transparent"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'h-9 w-9 rounded-xl',
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white shadow-md border-0'
                      : 'border-pink-200 hover:bg-pink-50'
                  )}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-pink-200 hover:bg-pink-50 rounded-xl bg-transparent"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

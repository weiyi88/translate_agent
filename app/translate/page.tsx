'use client'

import React from "react"

import { useState, useCallback } from 'react'
import { AppLayout } from '@/components/app-layout'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Upload,
  FileText,
  X,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  File,
  FileSpreadsheet,
  FileImage,
  Sparkles,
  Heart,
  CloudUpload,
} from 'lucide-react'

type TranslationStatus = 'idle' | 'queued' | 'translating' | 'completed' | 'error'

type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  status: TranslationStatus
  progress: number
  error?: string
}

const languages = [
  { code: 'zh-CN', name: '简体中文', nameEn: 'Simplified Chinese' },
  { code: 'en', name: 'English', nameEn: 'English' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese' },
  { code: 'ko', name: '한국어', nameEn: 'Korean' },
  { code: 'fr', name: 'Français', nameEn: 'French' },
  { code: 'de', name: 'Deutsch', nameEn: 'German' },
  { code: 'es', name: 'Español', nameEn: 'Spanish' },
  { code: 'pt', name: 'Português', nameEn: 'Portuguese' },
  { code: 'ru', name: 'Русский', nameEn: 'Russian' },
  { code: 'it', name: 'Italiano', nameEn: 'Italian' },
]

const aiModels = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', descZh: '快速高效', descEn: 'Fast & efficient' },
  { id: 'gpt-4o', name: 'GPT-4o', descZh: '精准强大', descEn: 'Powerful & precise', recommended: true },
  { id: 'claude-3.5', name: 'Claude 3.5', descZh: '长文本处理', descEn: 'Long-text expert' },
]

const glossaries = [
  { id: 'none', nameZh: '不使用术语库', nameEn: 'No Glossary', count: 0 },
  { id: 'tech', nameZh: '技术术语库', nameEn: 'Tech Glossary', count: 1280 },
  { id: 'legal', nameZh: '法律术语库', nameEn: 'Legal Glossary', count: 856 },
  { id: 'medical', nameZh: '医学术语库', nameEn: 'Medical Glossary', count: 2340 },
  { id: 'finance', nameZh: '金融术语库', nameEn: 'Finance Glossary', count: 1120 },
]

export default function TranslatePage() {
  const { t, language } = useTranslation()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [targetLang, setTargetLang] = useState('en')
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [selectedGlossary, setSelectedGlossary] = useState('none')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop() || '',
      status: 'idle' as TranslationStatus,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const startTranslation = async () => {
    if (files.length === 0) return

    setIsTranslating(true)

    setFiles((prev) =>
      prev.map((f) => (f.status === 'idle' ? { ...f, status: 'queued' as TranslationStatus } : f))
    )

    for (const file of files) {
      if (file.status !== 'queued' && file.status !== 'idle') continue

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'translating' as TranslationStatus } : f))
      )

      for (let p = 0; p <= 100; p += 5) {
        await new Promise((r) => setTimeout(r, 100))
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: p } : f))
        )
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'completed' as TranslationStatus, progress: 100 } : f
        )
      )
    }

    setIsTranslating(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
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
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusIcon = (status: TranslationStatus) => {
    switch (status) {
      case 'queued':
        return <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
      case 'translating':
        return <Loader2 className="h-4 w-4 text-pink-500 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-500" />
      default:
        return null
    }
  }

  const idleFiles = files.filter((f) => f.status === 'idle')
  const hasFilesToTranslate = idleFiles.length > 0 || files.some((f) => f.status === 'queued')
  const completedCount = files.filter((f) => f.status === 'completed').length

  return (
    <AppLayout>
      <div className="flex h-screen bg-gradient-to-br from-orange-50/50 via-pink-50/30 to-amber-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Left Panel - Upload & Settings */}
        <div className="flex-1 flex flex-col border-r border-border bg-muted/20 dark:bg-background overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-pink-400" />
              <h1 className="text-lg font-semibold text-foreground">
                {t.nav.translate}
              </h1>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer min-h-[200px]',
                isDragActive
                  ? 'border-pink-400 bg-pink-100 dark:bg-pink-950/40 scale-[1.02]'
                  : 'border-border bg-background dark:bg-muted/10 hover:border-pink-300 hover:bg-muted/30 dark:hover:bg-muted/20'
              )}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30">
                  <CloudUpload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">
                    {t.translation.dragDropHint}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    PDF, DOCX, PPTX, XLSX | {language === 'zh' ? '最大' : 'Max'} 100MB
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  {language === 'zh' ? '已上传文件' : 'Uploaded Files'} ({files.length})
                </h3>
                {files.map((file) => (
                  <Card key={file.id} className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            {getStatusIcon(file.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatFileSize(file.size)}
                          </p>
                          {file.status === 'translating' && (
                            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-400 to-orange-300 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {file.status === 'completed' && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted hover:text-pink-500 rounded-xl">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {file.status === 'error' && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted hover:text-pink-500 rounded-xl">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {(file.status === 'idle' || file.status === 'completed') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                              onClick={() => removeFile(file.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Translation Settings */}
            <div className="mt-8 space-y-6">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                {language === 'zh' ? '翻译设置' : 'Translation Settings'}
              </h3>

              {/* Target Language */}
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">
                  {t.translation.targetLanguage}
                </label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-full bg-card border-border rounded-xl focus:border-pink-400 focus:ring-pink-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
                        <span>{language === 'zh' ? lang.name : lang.nameEn}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AI Model - Horizontal Layout */}
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">
                  {t.translation.aiModel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        'flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 text-center',
                        selectedModel === model.id
                          ? 'border-pink-400 bg-gradient-to-br from-pink-50 dark:from-pink-950/40 to-orange-50 dark:to-orange-950/20 shadow-md shadow-pink-100/50 dark:shadow-pink-900/30'
                          : 'border-border hover:border-pink-300 dark:hover:border-pink-600 bg-card hover:bg-card/80 dark:hover:bg-card'
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground">{model.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {language === 'zh' ? model.descZh : model.descEn}
                      </span>
                      {model.recommended && (
                        <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-white font-medium">
                          {language === 'zh' ? '推荐' : 'Best'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glossary */}
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">
                  {t.translation.glossary}
                </label>
                <Select value={selectedGlossary} onValueChange={setSelectedGlossary}>
                  <SelectTrigger className="w-full bg-card border-border rounded-xl focus:border-pink-400 focus:ring-pink-400 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {glossaries.map((glossary) => (
                      <SelectItem key={glossary.id} value={glossary.id} className="rounded-lg">
                        <span className="flex items-center gap-2">
                          <span>{language === 'zh' ? glossary.nameZh : glossary.nameEn}</span>
                          {glossary.count > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({glossary.count})
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Action & Queue */}
        <div className="w-80 flex flex-col bg-card border-l border-border shrink-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-400 fill-pink-400" />
              {t.translation.translationQueue}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col overflow-auto">
            {/* Start Translation Button */}
            <Button
              size="lg"
              className={cn(
                'w-full gap-2 font-semibold transition-all duration-300 rounded-2xl h-14 text-base shrink-0',
                hasFilesToTranslate
                  ? 'bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 hover:shadow-xl active:scale-[0.98]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
              onClick={startTranslation}
              disabled={!hasFilesToTranslate || isTranslating}
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t.translation.translating}</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>{t.translation.startTranslation}</span>
                </>
              )}
            </Button>

            {/* Queue Status */}
            {files.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.translation.progress}</span>
                  <span className="font-semibold text-foreground">
                    {completedCount} / {files.length}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-orange-300 rounded-full transition-all duration-500"
                    style={{ width: files.length > 0 ? `${(completedCount / files.length) * 100}%` : '0%' }}
                  />
                </div>

                {/* Individual File Progress */}
                <div className="space-y-2 mt-5">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                        file.status === 'translating'
                          ? 'bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800'
                          : 'bg-muted'
                      )}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-orange-300 text-[10px] font-bold text-white shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                        {file.status === 'translating' && (
                          <p className="text-[10px] text-pink-500 font-semibold mt-0.5">{file.progress}%</p>
                        )}
                      </div>
                      {getStatusIcon(file.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {files.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 dark:from-pink-950/40 to-orange-100 dark:to-orange-950/30 mb-4">
                  <FileText className="h-10 w-10 text-pink-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh'
                    ? '上传文件后开始翻译'
                    : 'Upload files to start'}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {language === 'zh'
                    ? '支持拖拽上传哦~'
                    : 'Drag & drop supported~'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

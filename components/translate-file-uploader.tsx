'use client'

import React from "react"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploadProgress {
  file: File
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

interface TranslateFileUploaderProps {
  onFileSelect: (file: File) => void
  uploadedFile: FileUploadProgress | null
  onRemove: () => void
}

export function TranslateFileUploader({ onFileSelect, uploadedFile, onRemove }: TranslateFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supportedFormats = ['pptx', 'docx', 'xlsx', 'pdf']

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext && supportedFormats.includes(ext)) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  if (uploadedFile) {
    return (
      <Card className="overflow-hidden border-2">
        <div className="p-4">
          {uploadedFile.status === 'uploading' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative h-5 w-5">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {uploadedFile.file.name}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>上传中... {uploadedFile.progress}%</span>
                  <span>{(uploadedFile.progress / 100 * 2.5).toFixed(1)}MB / 2.5MB</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-300"
                    style={{ width: `${uploadedFile.progress}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  预计剩余: {Math.ceil((100 - uploadedFile.progress) / 10)}秒
                </p>
              </div>
            </div>
          )}

          {uploadedFile.status === 'error' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-destructive">上传失败</p>
                  <p className="text-xs text-muted-foreground">
                    {uploadedFile.error || '未知错误'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fileInputRef.current?.click()
                }}
              >
                重新上传
              </Button>
            </div>
          )}

          {uploadedFile.status === 'success' && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB · {uploadedFile.file.type}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                aria-label="删除已上传的文件"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`relative overflow-hidden border-2 transition-all duration-200 ${
        isDragging
          ? 'border-primary/80 bg-primary/10'
          : 'border-dashed border-border hover:border-primary/50 hover:bg-primary/5'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="block cursor-pointer p-12">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.docx,.xlsx,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="选择要翻译的文件"
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={`transition-transform duration-200 ${isDragging ? 'scale-110' : 'scale-100'}`}>
            <Upload
              className={`h-10 w-10 ${
                isDragging ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-hidden="true"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {isDragging ? '释放文件以上传' : '拖拽文件到此处，或点击上传'}
            </p>
            <p className="text-xs text-muted-foreground">
              支持 PPT, Word, Excel, PDF
              <br />
              最大 100MB
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              fileInputRef.current?.click()
            }}
          >
            选择文件
          </Button>
        </div>
      </label>
    </Card>
  )
}

'use client'

import React from "react"

import { useState } from 'react'
import { Upload, X, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile?: File
  isLoading?: boolean
}

export function FileUploadZone({ onFileSelect, selectedFile, isLoading }: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file: File) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const supportedFormats = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'application/xml']

    if (file.size > maxSize) {
      alert('文件大小不能超过 10MB')
      return
    }

    if (!supportedFormats.includes(file.type) && !file.name.endsWith('.tmx')) {
      alert('仅支持 CSV, XLSX, JSON, TMX 格式')
      return
    }

    onFileSelect(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  if (selectedFile) {
    return (
      <Card className="border-2 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <File className="mt-1 h-6 w-6 text-primary shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileSelect(null as any)}
            disabled={isLoading}
            aria-label="移除文件"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        {isLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">正在解析文件...</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-500" />
            </div>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card
      className={`border-2 border-dashed p-12 text-center transition-all duration-200 ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted hover:border-primary/50 hover:bg-muted/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <p className="mb-1 text-lg font-medium text-foreground">拖拽文件到此处，或点击上传</p>
      <p className="mb-6 text-sm text-muted-foreground">支持 CSV, XLSX, JSON, TMX 格式，最大 10MB</p>
      <div className="flex items-center justify-center gap-2">
        <input
          type="file"
          accept=".csv,.xlsx,.json,.tmx"
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
          aria-label="选择文件"
        />
        <Button asChild size="lg" className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 transition-opacity duration-200">
          <label htmlFor="file-upload" className="cursor-pointer">
            选择文件
          </label>
        </Button>
      </div>
    </Card>
  )
}

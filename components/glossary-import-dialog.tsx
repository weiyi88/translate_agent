'use client'

import React from "react"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Upload, FileText } from 'lucide-react'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlossaryImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true)
  const [overwrite, setOverwrite] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImport = async () => {
    if (selectedFile) {
      setIsLoading(true)
      console.log('[v0] Importing file:', {
        file: selectedFile.name,
        skipDuplicates,
        autoDetectLanguage,
        overwrite,
      })
      setTimeout(() => {
        setIsLoading(false)
        onOpenChange(false)
      }, 1500)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold">
            导入术语
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            支持格式: CSV, XLSX, JSON
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:bg-muted/30">
              <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <div className="text-center">
                <p className="font-medium text-sm">选择文件</p>
                <p className="text-xs text-muted-foreground">或拖拽文件到此处</p>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {selectedFile.name}
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="选择导入文件"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="skip-duplicates"
                checked={skipDuplicates}
                onCheckedChange={(checked) =>
                  setSkipDuplicates(checked === true)
                }
              />
              <Label
                htmlFor="skip-duplicates"
                className="text-sm font-medium cursor-pointer"
              >
                跳过重复术语
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="auto-detect"
                checked={autoDetectLanguage}
                onCheckedChange={(checked) =>
                  setAutoDetectLanguage(checked === true)
                }
              />
              <Label
                htmlFor="auto-detect"
                className="text-sm font-medium cursor-pointer"
              >
                自动检测语言
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="overwrite"
                checked={overwrite}
                onCheckedChange={(checked) => setOverwrite(checked === true)}
              />
              <Label
                htmlFor="overwrite"
                className="text-sm font-medium cursor-pointer"
              >
                覆盖现有术语
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="hover:bg-muted/50 transition-colors duration-200"
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
            className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
          >
            {isLoading ? '导入中...' : '导入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

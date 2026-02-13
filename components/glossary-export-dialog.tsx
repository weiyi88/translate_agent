'use client'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ExportFormat = 'csv' | 'xlsx' | 'json' | 'tmx'

export function GlossaryExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [includeSource, setIncludeSource] = useState(true)
  const [includeTarget, setIncludeTarget] = useState(true)
  const [includeLanguage, setIncludeLanguage] = useState(true)
  const [includeTags, setIncludeTags] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    console.log('[v0] Exporting glossary:', {
      format,
      includeSource,
      includeTarget,
      includeLanguage,
      includeTags,
      includeNotes,
    })
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold">
            导出术语
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            选择导出格式和包含的字段
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-3">
            <Label className="font-medium text-sm">选择格式:</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="csv" id="format-csv" />
                <Label htmlFor="format-csv" className="text-sm font-normal cursor-pointer">
                  CSV
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <Label htmlFor="format-xlsx" className="text-sm font-normal cursor-pointer">
                  Excel (.xlsx)
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="json" id="format-json" />
                <Label htmlFor="format-json" className="text-sm font-normal cursor-pointer">
                  JSON
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="tmx" id="format-tmx" />
                <Label htmlFor="format-tmx" className="text-sm font-normal cursor-pointer">
                  TMX (翻译记忆)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="font-medium text-sm">包含:</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="include-source"
                  checked={includeSource}
                  onCheckedChange={(checked) =>
                    setIncludeSource(checked === true)
                  }
                  disabled
                />
                <Label
                  htmlFor="include-source"
                  className="text-sm font-normal cursor-pointer opacity-70"
                >
                  原文
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="include-target"
                  checked={includeTarget}
                  onCheckedChange={(checked) =>
                    setIncludeTarget(checked === true)
                  }
                  disabled
                />
                <Label
                  htmlFor="include-target"
                  className="text-sm font-normal cursor-pointer opacity-70"
                >
                  译文
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="include-language"
                  checked={includeLanguage}
                  onCheckedChange={(checked) =>
                    setIncludeLanguage(checked === true)
                  }
                  disabled
                />
                <Label
                  htmlFor="include-language"
                  className="text-sm font-normal cursor-pointer opacity-70"
                >
                  语言
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="include-tags"
                  checked={includeTags}
                  onCheckedChange={(checked) => setIncludeTags(checked === true)}
                />
                <Label
                  htmlFor="include-tags"
                  className="text-sm font-normal cursor-pointer"
                >
                  标签
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="include-notes"
                  checked={includeNotes}
                  onCheckedChange={(checked) =>
                    setIncludeNotes(checked === true)
                  }
                />
                <Label
                  htmlFor="include-notes"
                  className="text-sm font-normal cursor-pointer"
                >
                  备注
                </Label>
              </div>
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
            onClick={handleExport}
            disabled={isLoading}
            className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
          >
            {isLoading ? '导出中...' : '导出'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

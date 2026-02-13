'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface TermDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'add' | 'edit'
}

export function GlossaryTermDialog({ open, onOpenChange, mode = 'add' }: TermDialogProps) {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [sourceLang, setSourceLang] = useState('zh')
  const [targetLang, setTargetLang] = useState('en')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [notes, setNotes] = useState('')

  const isValid = source.trim() && target.trim() && sourceLang && targetLang

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (isValid) {
      console.log('[v0] Form submitted:', { source, target, sourceLang, targetLang, tags, notes })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold">
            {mode === 'add' ? '添加术语' : '编辑术语'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source" className="font-medium text-sm">
              原文 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="source"
              placeholder="输入原文..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="border-border focus:border-primary focus:ring-primary transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="font-medium text-sm">
              译文 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="target"
              placeholder="输入译文..."
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="border-border focus:border-primary focus:ring-primary transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="source-lang" className="font-medium text-sm">
                源语言 <span className="text-destructive">*</span>
              </Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger id="source-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">英文</SelectItem>
                  <SelectItem value="ja">日文</SelectItem>
                  <SelectItem value="ko">韩文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-lang" className="font-medium text-sm">
                目标语言 <span className="text-destructive">*</span>
              </Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger id="target-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">英文</SelectItem>
                  <SelectItem value="ja">日文</SelectItem>
                  <SelectItem value="ko">韩文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">标签</Label>
            <div className="flex gap-2">
              <Input
                placeholder="输入标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="border-border focus:border-primary focus:ring-primary transition-colors duration-200"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="hover:bg-muted/50 transition-colors duration-200 bg-transparent"
              >
                添加
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:opacity-70 transition-opacity duration-200"
                      aria-label={`删除标签 ${tag}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium text-sm">
              备注 (可选)
            </Label>
            <Textarea
              id="notes"
              placeholder="输入备注..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-border focus:border-primary focus:ring-primary transition-colors duration-200 min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted/50 transition-colors duration-200"
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

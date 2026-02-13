'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface ConfigFormProps {
  onConfigChange: (config: ConfigData) => void
}

export interface ConfigData {
  glossaryName: string
  description: string
  sourceLanguage: string
  targetLanguage: string
  skipDuplicates: boolean
  autoDetectLanguage: boolean
  overrideExisting: boolean
  createBackup: boolean
}

const languages = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: '英文' },
  { value: 'es', label: '西班牙文' },
  { value: 'fr', label: '法文' },
  { value: 'de', label: '德文' },
  { value: 'ja', label: '日文' },
]

export function ConfigForm({ onConfigChange }: ConfigFormProps) {
  const [config, setConfig] = useState<ConfigData>({
    glossaryName: '技术术语库',
    description: '计算机和编程相关术语',
    sourceLanguage: 'zh-CN',
    targetLanguage: 'en',
    skipDuplicates: true,
    autoDetectLanguage: true,
    overrideExisting: false,
    createBackup: true,
  })

  const handleChange = (key: keyof ConfigData, value: string | boolean) => {
    const updated = { ...config, [key]: value }
    setConfig(updated)
    onConfigChange(updated)
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>配置导入选项</CardTitle>
        <CardDescription>设置词库名称、语言和导入规则</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="glossary-name" className="font-medium">
            词库名称
          </Label>
          <Input
            id="glossary-name"
            value={config.glossaryName}
            onChange={(e) => handleChange('glossaryName', e.target.value)}
            placeholder="输入词库名称"
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-medium">
            描述 (可选)
          </Label>
          <textarea
            id="description"
            value={config.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="输入词库描述"
            className="min-h-24 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm transition-colors duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="source-lang" className="font-medium">
              源语言
            </Label>
            <Select value={config.sourceLanguage} onValueChange={(val) => handleChange('sourceLanguage', val)}>
              <SelectTrigger id="source-lang" className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-lang" className="font-medium">
              目标语言
            </Label>
            <Select value={config.targetLanguage} onValueChange={(val) => handleChange('targetLanguage', val)}>
              <SelectTrigger id="target-lang" className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-medium">高级选项</div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="skip-duplicates"
                checked={config.skipDuplicates}
                onCheckedChange={(checked) => handleChange('skipDuplicates', checked as boolean)}
              />
              <Label htmlFor="skip-duplicates" className="cursor-pointer font-normal">
                跳过重复术语
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="auto-detect"
                checked={config.autoDetectLanguage}
                onCheckedChange={(checked) => handleChange('autoDetectLanguage', checked as boolean)}
              />
              <Label htmlFor="auto-detect" className="cursor-pointer font-normal">
                自动检测语言
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="override-existing"
                checked={config.overrideExisting}
                onCheckedChange={(checked) => handleChange('overrideExisting', checked as boolean)}
              />
              <Label htmlFor="override-existing" className="cursor-pointer font-normal">
                覆盖现有术语
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="create-backup"
                checked={config.createBackup}
                onCheckedChange={(checked) => handleChange('createBackup', checked as boolean)}
              />
              <Label htmlFor="create-backup" className="cursor-pointer font-normal">
                创建备份
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

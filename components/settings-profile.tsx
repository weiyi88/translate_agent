'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function SettingsProfile() {
  const { language } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '张三',
    email: 'zhang@example.com',
    company: 'TranslateAI',
    position: '产品经理',
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {language === 'zh' ? '基本信息' : 'Basic Info'}
          </CardTitle>
          <CardDescription>
            {language === 'zh' ? '更新您的个人资料' : 'Update your profile information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 dark:from-pink-800 dark:to-orange-800 flex items-center justify-center border-2 border-pink-300/50 dark:border-pink-700/50 shadow-md">
              <span className="text-2xl font-bold text-pink-600 dark:text-pink-300">Z</span>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4 text-pink-500" aria-hidden="true" />
              {language === 'zh' ? '上传头像' : 'Upload Avatar'}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                {language === 'zh' ? '姓名' : 'Name'}
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {language === 'zh' ? '邮箱' : 'Email'}
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-foreground">
                {language === 'zh' ? '公司/组织' : 'Company'}
              </label>
              <Input id="company" name="company" value={formData.company} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium text-foreground">
                {language === 'zh' ? '职位' : 'Position'}
              </label>
              <Input id="position" name="position" value={formData.position} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white shadow-md"
            >
              {isLoading
                ? (language === 'zh' ? '保存中...' : 'Saving...')
                : (language === 'zh' ? '保存更改' : 'Save Changes')}
            </Button>
            {isSaved && (
              <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">
                {language === 'zh' ? '保存成功!' : 'Saved!'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

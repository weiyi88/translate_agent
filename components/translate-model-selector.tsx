'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, DollarSign } from 'lucide-react'

const models = [
  {
    id: 'gpt4-mini',
    name: 'GPT-4o Mini',
    description: '快速处理，适合简单文档',
    price: '¥0.02/页',
    speed: '10秒/页',
    recommended: false,
  },
  {
    id: 'gpt4',
    name: 'GPT-4o',
    description: '平衡性能和质量',
    price: '¥0.05/页',
    speed: '20秒/页',
    recommended: true,
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    description: '最高质量，适合专业文档',
    price: '¥0.08/页',
    speed: '30秒/页',
    recommended: false,
  },
]

interface TranslateModelSelectorProps {
  selectedModel: string
  onSelect: (id: string) => void
}

export function TranslateModelSelector({
  selectedModel,
  onSelect,
}: TranslateModelSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">AI 模型:</p>

      {models.map((model) => (
        <Card
          key={model.id}
          className={`relative overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
            selectedModel === model.id
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onSelect(model.id)}
          role="radio"
          aria-checked={selectedModel === model.id}
          aria-label={model.name}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={selectedModel === model.id}
                  onChange={() => onSelect(model.id)}
                  className="mt-1 cursor-pointer"
                  aria-label={`选择 ${model.name}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {model.name}
                    </p>
                    {model.recommended && (
                      <Badge
                        className="bg-green-100 text-green-700 text-xs"
                        variant="secondary"
                      >
                        推荐
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 border-t pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{model.price}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{model.speed}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

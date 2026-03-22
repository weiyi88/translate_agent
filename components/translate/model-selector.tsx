/**
 * Model Selector Component
 * AI 模型选择器组件
 */
'use client';

import { useState } from 'react';
import { Sparkles, Zap, Award, ChevronDown, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: 'sparkle' | 'zap' | 'award';
  quality: 'standard' | 'high' | 'premium';
  pricePer1kTokens: number;
  free: boolean;
  recommended?: boolean;
}

const MODELS: AIModel[] = [
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    description: '快速经济，适合日常翻译',
    icon: 'zap',
    quality: 'standard',
    pricePer1kTokens: 0.15,
    free: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: '平衡性能与成本，推荐选择',
    icon: 'sparkle',
    quality: 'high',
    pricePer1kTokens: 2.5,
    free: false,
    recommended: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: '高质量翻译，擅长长文本',
    icon: 'award',
    quality: 'premium',
    pricePer1kTokens: 3.0,
    free: false,
  },
];

const QUALITY_LABELS = {
  standard: { text: '标准质量', color: 'bg-muted text-muted-foreground' },
  high: { text: '高质量', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  premium: { text: '顶级质量', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
};

const ICONS = {
  sparkle: Sparkles,
  zap: Zap,
  award: Award,
};

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedModel = MODELS.find((m) => m.id === value) ?? MODELS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <span className="flex items-center gap-2">
            <ModelIcon model={selectedModel} className="w-4 h-4 text-muted-foreground" />
            <span>{selectedModel.name}</span>
            {selectedModel.free && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs">免费</Badge>
            )}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-1" align="start" sideOffset={4}>
        {MODELS.map((model) => {
          const isSelected = (value ?? MODELS[0].id) === model.id;
          const isLocked = !model.free;

          return (
            <button
              key={model.id}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) {
                  onChange?.(model.id);
                  setOpen(false);
                }
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${isSelected ? 'bg-accent' : ''}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}
              `}
            >
              {/* 选中状态 */}
              <div className="w-4 flex-shrink-0">
                {isSelected && !isLocked && <Check className="w-4 h-4 text-primary" />}
                {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>

              {/* 模型图标 */}
              <ModelIcon model={model} className="w-4 h-4 text-muted-foreground flex-shrink-0" />

              {/* 模型名 */}
              <span className={`w-28 text-left font-medium truncate ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                {model.name}
                {model.recommended && (
                  <span className="ml-1 text-xs text-primary">推荐</span>
                )}
              </span>

              {/* 费用标签 */}
              {model.free ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs flex-shrink-0">
                  免费
                </Badge>
              ) : (
                <Badge className="bg-muted text-muted-foreground text-xs flex-shrink-0">
                  订阅
                </Badge>
              )}

              {/* 质量标签 */}
              <Badge className={`${QUALITY_LABELS[model.quality].color} text-xs flex-shrink-0`}>
                {QUALITY_LABELS[model.quality].text}
              </Badge>

              {/* 价格 */}
              <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">
                ¥{model.pricePer1kTokens}/1K
              </span>
            </button>
          );
        })}

        {/* 底部提示 */}
        <div className="border-t border-border mt-1 pt-2 pb-1 px-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            升级订阅后可解锁 GPT-4o、Claude 等高级模型
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ModelIcon({ model, className }: { model: AIModel; className?: string }) {
  const Icon = ICONS[model.icon];
  return <Icon className={className} />;
}

// Model Comparison Table
export function ModelComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">模型</th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">质量</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">价格</th>
          </tr>
        </thead>
        <tbody>
          {MODELS.map((model) => (
            <tr key={model.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <ModelIcon model={model} className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{model.name}</span>
                  {model.recommended && (
                    <Badge className="badge-primary text-xs">推荐</Badge>
                  )}
                  {!model.free && <Lock className="w-3 h-3 text-muted-foreground" />}
                </div>
              </td>
              <td className="text-center py-3 px-4">
                <Badge className={QUALITY_LABELS[model.quality].color}>
                  {QUALITY_LABELS[model.quality].text}
                </Badge>
              </td>
              <td className="text-right py-3 px-4 font-mono text-sm text-foreground">
                {model.free ? <span className="text-green-600 dark:text-green-400">免费</span> : `¥${model.pricePer1kTokens}/1K`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

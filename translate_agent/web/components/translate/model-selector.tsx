/**
 * Model Selector Component
 * AI 模型选择器组件
 */
'use client';

import { useState } from 'react';
import { Sparkles, Zap, Award, ChevronDown, Check, Info } from 'lucide-react';
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
  speed: 'fast' | 'medium' | 'slow';
  quality: 'standard' | 'high' | 'premium';
  pricePer1kTokens: number;
  recommended?: boolean;
}

const MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: '快速且经济，适合日常翻译',
    icon: 'zap',
    speed: 'fast',
    quality: 'standard',
    pricePer1kTokens: 0.15,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: '平衡性能和成本，推荐选择',
    icon: 'sparkle',
    speed: 'medium',
    quality: 'high',
    pricePer1kTokens: 2.5,
    recommended: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: '高质量翻译，擅长长文本',
    icon: 'award',
    speed: 'medium',
    quality: 'premium',
    pricePer1kTokens: 3.0,
  },
];

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ICONS = {
  sparkle: Sparkles,
  zap: Zap,
  award: Award,
};

const SPEED_LABELS = {
  fast: { text: '快速', color: 'bg-green-100 text-green-700' },
  medium: { text: '中等', color: 'bg-yellow-100 text-yellow-700' },
  slow: { text: '较慢', color: 'bg-red-100 text-red-700' },
};

const QUALITY_LABELS = {
  standard: { text: '标准', color: 'bg-gray-100 text-gray-700' },
  high: { text: '高质量', color: 'bg-blue-100 text-blue-700' },
  premium: { text: '顶级', color: 'bg-purple-100 text-purple-700' },
};

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedModel = MODELS.find((model) => model.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedModel ? (
            <span className="flex items-center gap-2">
              {selectedModel.recommended && (
                <Badge className="badge-primary text-xs">推荐</Badge>
              )}
              <ModelIcon model={selectedModel} className="w-4 h-4" />
              <span>{selectedModel.name}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-4 h-4" />
              选择 AI 模型
            </span>
          )}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
        <div className="p-2">
          {MODELS.map((model) => {
            const Icon = ICONS[model.icon];
            const isSelected = value === model.id;

            return (
              <button
                key={model.id}
                onClick={() => {
                  onChange?.(model.id);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-start gap-3 p-4 rounded-lg transition-all duration-200
                  ${isSelected ? 'bg-primary-50 border-2 border-primary-500' : 'hover:bg-gray-50 border-2 border-transparent'}
                `}
              >
                {/* Check Icon */}
                <div className="flex-shrink-0 pt-1">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}
                `}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-gray-600'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
                      {model.name}
                    </span>
                    {model.recommended && (
                      <Badge className="badge-primary text-xs">推荐</Badge>
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${isSelected ? 'text-primary-600' : 'text-gray-600'}`}>
                    {model.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge className={SPEED_LABELS[model.speed].color}>
                      {SPEED_LABELS[model.speed].text}
                    </Badge>
                    <Badge className={QUALITY_LABELS[model.quality].color}>
                      {QUALITY_LABELS[model.quality].text}
                    </Badge>
                    <span className="text-gray-500">
                      ¥{model.pricePer1kTokens}/1K tokens
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              不同模型的翻译质量和速度有所不同。GPT-4o Mini 适合快速翻译，Claude 3.5 Sonnet 适合高质量翻译。
            </p>
          </div>
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
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">模型</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900">速度</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900">质量</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">价格</th>
          </tr>
        </thead>
        <tbody>
          {MODELS.map((model) => (
            <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <ModelIcon model={model} className="w-4 h-4" />
                  <span className="font-medium">{model.name}</span>
                  {model.recommended && (
                    <Badge className="badge-primary text-xs">推荐</Badge>
                  )}
                </div>
              </td>
              <td className="text-center py-3 px-4">
                <Badge className={SPEED_LABELS[model.speed].color}>
                  {SPEED_LABELS[model.speed].text}
                </Badge>
              </td>
              <td className="text-center py-3 px-4">
                <Badge className={QUALITY_LABELS[model.quality].color}>
                  {QUALITY_LABELS[model.quality].text}
                </Badge>
              </td>
              <td className="text-right py-3 px-4 font-mono text-sm">
                ¥{model.pricePer1kTokens}/1K
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

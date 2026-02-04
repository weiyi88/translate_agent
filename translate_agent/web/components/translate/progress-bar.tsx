/**
 * Progress Bar Component
 * 翻译进度条组件
 */
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ProgressStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface ProgressBarProps {
  value: number; // 0-100
  status: ProgressStatus;
  fileName?: string;
  errorMessage?: string;
  outputUrl?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function ProgressBar({
  value,
  status,
  fileName,
  errorMessage,
  outputUrl,
  onRetry,
  onCancel,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth animation for progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return '正在上传文件...';
      case 'processing':
        return '正在翻译中...';
      case 'completed':
        return '翻译完成！';
      case 'error':
        return '翻译失败';
      default:
        return '准备就绪';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    if (status === 'error') return 'bg-error';
    if (status === 'completed') return 'bg-success';
    return 'bg-gradient-to-r from-primary-500 to-secondary-500';
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            {fileName && (
              <p className="font-medium text-gray-900">{fileName}</p>
            )}
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === 'processing' && onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              取消
            </Button>
          )}
          {status === 'error' && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              重试
            </Button>
          )}
          {status === 'completed' && outputUrl && (
            <Button size="sm" className="btn-primary" asChild>
              <a href={outputUrl} download>
                <Download className="w-4 h-4 mr-1" />
                下载
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {status !== 'idle' && status !== 'completed' && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                getProgressColor()
              )}
              style={{ width: `${displayValue}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {Math.round(displayValue)}%
            </span>
            {status === 'processing' && (
              <span className="text-gray-500">
                预计剩余 {Math.ceil((100 - displayValue) / 10)} 秒
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <div className="mt-4 p-3 rounded-lg bg-error-light text-error text-sm">
          {errorMessage}
        </div>
      )}

      {/* Completed Stats */}
      {status === 'completed' && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">完成度</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">~5s</p>
            <p className="text-sm text-gray-600">耗时</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">1.2MB</p>
            <p className="text-sm text-gray-600">文件大小</p>
          </div>
        </div>
      )}
    </Card>
  );
}

// Staggered Progress for Batch Translation
interface BatchProgressProps {
  items: Array<{
    id: string;
    name: string;
    progress: number;
    status: ProgressStatus;
  }>;
}

export function BatchProgress({ items }: BatchProgressProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ProgressBar
          key={item.id}
          value={item.progress}
          status={item.status}
          fileName={item.name}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}

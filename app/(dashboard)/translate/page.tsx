/**
 * Translate Dashboard Page
 * 翻译仪表板页面
 */
'use client';

import { useState } from 'react';
import { ArrowLeft, History, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUploader } from '@/components/translate/file-uploader';
import { LanguageSelector, QuickLanguageSelector } from '@/components/translate/language-selector';
import { ModelSelector } from '@/components/translate/model-selector';
import { ProgressBar, ProgressStatus } from '@/components/translate/progress-bar';
import { apiClient } from '@/lib/api';

export default function TranslatePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [model, setModel] = useState('gpt-5-mini');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [currentTaskId, setCurrentTaskId] = useState<string>();
  const [outputUrl, setOutputUrl] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleTranslate = async () => {
    if (files.length === 0) {
      alert('请先选择文件');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(10);
      setErrorMessage(undefined);

      // 上传文件并创建翻译任务（新 API）
      const file = files[0]; // MVP 只支持单文件
      const uploadResponse = await apiClient.uploadAndTranslate(
        file,
        targetLanguage,
        model
      );

      if (uploadResponse.error) {
        setStatus('error');
        setErrorMessage(uploadResponse.error);
        return;
      }

      const taskId = uploadResponse.data!.task_id;
      setCurrentTaskId(taskId);
      setProgress(30);
      setStatus('processing');

      // 轮询任务状态
      const pollResponse = await apiClient.pollTaskStatus(
        taskId,
        (result) => {
          // 更新进度
          const newProgress = 30 + (result.progress / 100) * 70;
          setProgress(newProgress);
        },
        2000, // 每 2 秒轮询一次
        300   // 最多 10 分钟
      );

      if (pollResponse.error) {
        setStatus('error');
        setErrorMessage(pollResponse.error);
        return;
      }

      if (pollResponse.data?.status === 'completed') {
        setStatus('completed');
        setProgress(100);
        // 使用新的下载 URL 方法
        setOutputUrl(apiClient.getDownloadUrl(taskId));
      } else if (pollResponse.data?.status === 'failed') {
        setStatus('error');
        setErrorMessage(pollResponse.data.error_message || '翻译失败');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProgress(0);
    setStatus('idle');
    setCurrentTaskId(undefined);
    setOutputUrl(undefined);
    setErrorMessage(undefined);
  };

  const handleRetry = () => {
    handleTranslate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-semibold">文档翻译</h1>
                <p className="text-sm text-muted-foreground">上传文件，AI 智能翻译</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard/glossary">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  词库
                </Button>
              </Link>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  历史
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <Card className="p-6">
              <h2 className="text-lg font-display font-semibold mb-4">上传文件</h2>
              <FileUploader
                accept=".pptx,.docx,.xlsx,.pdf"
                maxSize={100}
                multiple={true}
                onFilesChange={setFiles}
              />
            </Card>

            {/* Progress */}
            {status !== 'idle' && (
              <ProgressBar
                value={progress}
                status={status}
                fileName={files[0]?.name}
                errorMessage={errorMessage}
                outputUrl={outputUrl}
                onRetry={handleRetry}
              />
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Language Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-display font-semibold mb-4">翻译设置</h2>

              <div className="space-y-4">
                {/* Target Language */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    目标语言
                  </label>
                  <QuickLanguageSelector
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                  />
                </div>

                {/* Advanced Language Selector */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary-600 hover:text-primary-700">
                    查看所有语言...
                  </summary>
                  <div className="mt-3">
                    <LanguageSelector
                      value={targetLanguage}
                      onChange={setTargetLanguage}
                    />
                  </div>
                </details>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    AI 模型
                  </label>
                  <ModelSelector value={model} onChange={setModel} />
                </div>

                {/* Glossary */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    词库 (可选)
                  </label>
                  {/* TODO: replace with dynamic glossary list from GET /api/glossary when implemented */}
                  <select className="input" disabled>
                    <option>无词库</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  className="w-full btn-primary"
                  size="lg"
                  onClick={handleTranslate}
                  disabled={files.length === 0 || status === 'processing'}
                >
                  {status === 'processing' ? '翻译中...' : '开始翻译'}
                </Button>
                {status !== 'idle' && status !== 'processing' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleReset}
                  >
                    重新开始
                  </Button>
                )}
              </div>

              {/* Usage Info — TODO: replace with GET /api/usage when implemented */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  本月剩余翻译额度: <span className="font-semibold text-foreground">-- 页</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

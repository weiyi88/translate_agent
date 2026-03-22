/**
 * History Page
 * 翻译历史记录页面
 */
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Trash2, RefreshCw, FileText, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TranslationTask {
  id: string;
  fileName: string;
  fileType: string;
  sourceLanguage: string | null;
  targetLanguage: string;
  model: string;
  status: string;
  progress: number;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<TranslationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.tasks ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [filterStatus]);

  const handleDelete = async (taskId: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    const res = await fetch(`/api/translate/${taskId}`, { method: 'DELETE' });
    if (res.ok) {
      loadHistory();
    } else {
      alert('删除失败');
    }
  };

  const handleDownload = (taskId: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/translate/${taskId}/download`;
    link.download = `translated_${fileName}`;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      PENDING: '等待中',
      QUEUED: '排队中',
      PROCESSING: '翻译中',
      COMPLETED: '已完成',
      FAILED: '失败',
      CANCELED: '已取消',
    };
    return map[status] ?? status;
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('zh-CN');

  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-xl font-display font-semibold">翻译历史</h1>
                <p className="text-sm text-muted-foreground">共 {history.length} 条记录</p>
              </div>
            </div>
            <Button onClick={loadHistory} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">状态筛选:</label>
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={filterStatus ?? 'all'}
              onChange={(e) => setFilterStatus(e.target.value === 'all' ? undefined : e.target.value)}
            >
              <option value="all">全部</option>
              <option value="COMPLETED">已完成</option>
              <option value="PROCESSING">翻译中</option>
              <option value="FAILED">失败</option>
              <option value="PENDING">等待中</option>
            </select>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">加载中...</span>
          </div>
        ) : history.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无翻译记录</h3>
            <p className="text-muted-foreground mb-6">开始你的第一次翻译吧</p>
            <Link href="/dashboard/translate">
              <Button>去翻译</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((task) => (
              <Card key={task.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-foreground">{task.fileName || '未命名文件'}</h3>
                      <span className="text-sm px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {task.fileType?.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span>状态:</span>{' '}
                        <span className="font-medium">{getStatusText(task.status)}</span>
                      </div>
                      <div>
                        <span>进度:</span>{' '}
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <div>
                        <span>模型:</span>{' '}
                        <span className="font-medium">{task.model || 'N/A'}</span>
                      </div>
                      <div>
                        <span>创建时间:</span>{' '}
                        <span className="font-medium">{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                    {task.errorMessage && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>错误:</strong> {task.errorMessage}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    {task.status === 'COMPLETED' && (
                      <Button size="sm" onClick={() => handleDownload(task.id, task.fileName)}>
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

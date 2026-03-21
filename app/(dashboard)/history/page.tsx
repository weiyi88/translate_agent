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
import { apiClient, TaskResult } from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();

  // 加载历史记录
  const loadHistory = async () => {
    setLoading(true);
    const response = await apiClient.getHistory({
      page,
      page_size: pageSize,
      status: filterStatus,
    });

    if (response.data) {
      setHistory(response.data.items);
      setTotal(response.data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [page, filterStatus]);

  // 删除任务
  const handleDelete = async (taskId: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    const response = await apiClient.deleteHistory(taskId, true);
    if (response.data?.success) {
      // 重新加载列表
      loadHistory();
    } else {
      alert('删除失败: ' + response.error);
    }
  };

  // 下载文件
  const handleDownload = (taskId: string, fileName: string) => {
    const url = apiClient.getDownloadUrl(taskId);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translated_${fileName}`;
    link.click();
  };

  // 状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // 状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '等待中',
      processing: '翻译中',
      completed: '已完成',
      failed: '失败',
    };
    return statusMap[status] || status;
  };

  // 格式化时间
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
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
                <h1 className="text-xl font-display font-semibold">翻译历史</h1>
                <p className="text-sm text-muted-foreground">共 {total} 条记录</p>
              </div>
            </div>

            <Button onClick={loadHistory} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">状态筛选:</label>
            <select
              className="input w-48"
              value={filterStatus || 'all'}
              onChange={(e) => setFilterStatus(e.target.value === 'all' ? undefined : e.target.value)}
            >
              <option value="all">全部</option>
              <option value="completed">已完成</option>
              <option value="processing">翻译中</option>
              <option value="failed">失败</option>
              <option value="pending">等待中</option>
            </select>
          </div>
        </Card>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-3 text-muted-foreground">加载中...</span>
          </div>
        ) : history.length === 0 ? (
          // Empty State
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无翻译记录</h3>
            <p className="text-muted-foreground mb-6">开始你的第一次翻译吧</p>
            <Link href="/dashboard/translate">
              <Button className="btn-primary">
                去翻译
              </Button>
            </Link>
          </Card>
        ) : (
          // History List
          <div className="space-y-4">
            {history.map((task) => (
              <Card key={task.task_id} className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left: File Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-foreground">{task.file_name || '未命名文件'}</h3>
                      <span className="text-sm px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {task.file_type?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="text-muted-foreground">状态:</span>{' '}
                        <span className="font-medium">{getStatusText(task.status)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">进度:</span>{' '}
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">模型:</span>{' '}
                        <span className="font-medium">{task.model || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">创建时间:</span>{' '}
                        <span className="font-medium">{formatDate(task.created_at)}</span>
                      </div>
                    </div>

                    {task.error_message && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>错误:</strong> {task.error_message}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 ml-6">
                    {task.status === 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(task.task_id, task.file_name || 'file')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(task.task_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > pageSize && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              上一页
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
            </span>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
            >
              下一页
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

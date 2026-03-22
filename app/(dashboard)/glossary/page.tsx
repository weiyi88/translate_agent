/**
 * Glossary Manager Page
 * 词库管理页面
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Download, Search, Trash2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import type { GlossaryItem, TermItem } from '@/lib/api/types';

export default function GlossaryPage() {
  const [glossaries, setGlossaries] = useState<GlossaryItem[]>([]);
  const [selectedGlossary, setSelectedGlossary] = useState<GlossaryItem | null>(null);
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 新建词库 dialog
  const [isCreateGlossaryOpen, setIsCreateGlossaryOpen] = useState(false);
  const [newGlossary, setNewGlossary] = useState({ name: '', description: '', targetLanguage: 'en' });

  // 添加术语 dialog
  const [isAddTermOpen, setIsAddTermOpen] = useState(false);
  const [newTerm, setNewTerm] = useState({ source: '', target: '', context: '', category: '' });

  // 上传词库 dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载词库列表
  useEffect(() => {
    apiClient.getGlossaries().then((res) => {
      if (res.data?.glossaries) {
        setGlossaries(res.data.glossaries);
        if (res.data.glossaries.length > 0) {
          setSelectedGlossary(res.data.glossaries[0]);
        }
      }
    });
  }, []);

  // 选中词库变化时加载术语
  useEffect(() => {
    if (!selectedGlossary) return;
    setLoading(true);
    apiClient.getTerms(selectedGlossary.id, searchQuery || undefined).then((res) => {
      setTerms(res.data?.terms ?? []);
      setLoading(false);
    });
  }, [selectedGlossary]);

  // 搜索防抖
  useEffect(() => {
    if (!selectedGlossary) return;
    const timer = setTimeout(() => {
      apiClient.getTerms(selectedGlossary.id, searchQuery || undefined).then((res) => {
        setTerms(res.data?.terms ?? []);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateGlossary = async () => {
    if (!newGlossary.name.trim()) return;
    const res = await apiClient.createGlossary(newGlossary);
    if (res.data?.glossary) {
      const created = res.data.glossary;
      setGlossaries((prev) => [created, ...prev]);
      setSelectedGlossary(created);
      setTerms([]);
    }
    setNewGlossary({ name: '', description: '', targetLanguage: 'en' });
    setIsCreateGlossaryOpen(false);
  };

  const handleDeleteGlossary = async (id: string) => {
    await apiClient.deleteGlossary(id);
    setGlossaries((prev) => prev.filter((g) => g.id !== id));
    if (selectedGlossary?.id === id) {
      const next = glossaries.find((g) => g.id !== id) ?? null;
      setSelectedGlossary(next);
      setTerms([]);
    }
  };

  const handleAddTerm = async () => {
    if (!newTerm.source || !newTerm.target || !selectedGlossary) return;
    const res = await apiClient.createTerm(selectedGlossary.id, newTerm);
    if (res.data?.term) {
      setTerms((prev) => [...prev, res.data!.term]);
      setGlossaries((prev) =>
        prev.map((g) => g.id === selectedGlossary.id ? { ...g, termCount: g.termCount + 1 } : g)
      );
    }
    setNewTerm({ source: '', target: '', context: '', category: '' });
    setIsAddTermOpen(false);
  };

  const handleDeleteTerm = async (termId: string) => {
    if (!selectedGlossary) return;
    await apiClient.deleteTerm(selectedGlossary.id, termId);
    setTerms((prev) => prev.filter((t) => t.id !== termId));
    setGlossaries((prev) =>
      prev.map((g) => g.id === selectedGlossary.id ? { ...g, termCount: Math.max(0, g.termCount - 1) } : g)
    );
  };

  const handleDownloadSample = () => {
    const csv = '原文,译文,语种\n人工智能,Artificial Intelligence,英语\n机器学习,Machine Learning,英语\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glossary_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(terms.map((t) => t.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-display font-semibold">词库管理</h1>
              <p className="text-sm text-muted-foreground">管理专业术语，确保翻译一致性</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Dialog open={isCreateGlossaryOpen} onOpenChange={setIsCreateGlossaryOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    新建词库
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新词库</DialogTitle>
                    <DialogDescription>创建一个新的术语库来管理专业词汇</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">词库名称</label>
                      <Input
                        placeholder="例如：技术术语库"
                        value={newGlossary.name}
                        onChange={(e) => setNewGlossary({ ...newGlossary, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">描述（可选）</label>
                      <Input
                        placeholder="简要描述此词库的用途"
                        value={newGlossary.description}
                        onChange={(e) => setNewGlossary({ ...newGlossary, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">目标语言</label>
                      <Input
                        placeholder="例如：en、zh、ja"
                        value={newGlossary.targetLanguage}
                        onChange={(e) => setNewGlossary({ ...newGlossary, targetLanguage: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateGlossaryOpen(false)}>取消</Button>
                    <Button className="btn-primary" onClick={handleCreateGlossary}>创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left - Glossary List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                我的词库 ({glossaries.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="w-3 h-3 mr-1" />
                上传词库
              </Button>
            </div>
            {glossaries.map((glossary) => (
              <Card
                key={glossary.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedGlossary?.id === glossary.id
                    ? 'border-2 border-primary bg-primary/5'
                    : 'hover:border-border'
                }`}
                onClick={() => setSelectedGlossary(glossary)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground mb-1 flex-1 min-w-0 truncate">{glossary.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDeleteGlossary(glossary.id); }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                {glossary.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{glossary.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{glossary.termCount} 个术语</span>
                  <Badge variant="secondary">{glossary.targetLanguage}</Badge>
                </div>
              </Card>
            ))}
            {glossaries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">暂无词库，点击新建</p>
            )}
          </div>

          {/* Right - Term List */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-display font-semibold">
                    {selectedGlossary?.name ?? '请选择词库'}
                  </h2>
                  {selectedGlossary?.description && (
                    <p className="text-sm text-muted-foreground">{selectedGlossary.description}</p>
                  )}
                </div>
                {selectedGlossary && (
                  <Dialog open={isAddTermOpen} onOpenChange={setIsAddTermOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        添加术语
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>添加新术语</DialogTitle>
                        <DialogDescription>添加源语言和目标语言的术语对照</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">源语言术语</label>
                          <Input
                            placeholder="例如：人工智能"
                            value={newTerm.source}
                            onChange={(e) => setNewTerm({ ...newTerm, source: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">目标语言术语</label>
                          <Input
                            placeholder="例如：Artificial Intelligence"
                            value={newTerm.target}
                            onChange={(e) => setNewTerm({ ...newTerm, target: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">上下文/注释（可选）</label>
                          <Input
                            placeholder="例如：计算机科学领域"
                            value={newTerm.context}
                            onChange={(e) => setNewTerm({ ...newTerm, context: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">分类（可选）</label>
                          <Input
                            placeholder="例如：技术"
                            value={newTerm.category}
                            onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTermOpen(false)}>取消</Button>
                        <Button className="btn-primary" onClick={handleAddTerm}>添加</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索术语..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={!selectedGlossary}
                />
              </div>

              {/* Terms Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[30%]">源语言</TableHead>
                      <TableHead className="w-[30%]">目标语言</TableHead>
                      <TableHead className="w-[20%]">分类</TableHead>
                      <TableHead className="w-[20%]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {terms.map((term) => (
                      <TableRow key={term.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{term.source}</TableCell>
                        <TableCell>{term.target}</TableCell>
                        <TableCell>
                          {term.category && (
                            <Badge variant="secondary" className="text-xs">{term.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTerm(term.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && terms.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {!selectedGlossary
                            ? '请先选择左侧词库'
                            : searchQuery
                            ? '未找到匹配的术语'
                            : '暂无术语，点击上方按钮添加'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedGlossary?.termCount ?? 0}</p>
                  <p className="text-sm text-muted-foreground">总术语数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">分类数量</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Upload Glossary Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传词库</DialogTitle>
            <DialogDescription>
              上传 CSV 或 Excel 文件导入词库，每行格式：原文、译文、语种
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">示例词库文件</p>
                <p className="text-xs text-muted-foreground">CSV 格式，含原文、译文、语种列</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadSample}>
                <FileDown className="w-4 h-4 mr-1.5" />
                下载示例
              </Button>
            </div>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              {uploadFile ? (
                <p className="text-sm font-medium text-foreground">{uploadFile.name}</p>
              ) : (
                <>
                  <p className="text-sm text-foreground font-medium">点击或拖拽上传</p>
                  <p className="text-xs text-muted-foreground mt-1">支持 .csv、.xlsx 格式</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadFile(null); setIsUploadDialogOpen(false); }}>
              取消
            </Button>
            <Button
              className="btn-primary"
              disabled={!uploadFile}
              onClick={() => { setUploadFile(null); setIsUploadDialogOpen(false); }}
            >
              确认上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

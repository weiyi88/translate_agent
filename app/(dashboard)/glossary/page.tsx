/**
 * Glossary Manager Page
 * 词库管理页面
 */
'use client';

import { useState } from 'react';
import { Plus, Upload, Download, Search, Edit, Trash2 } from 'lucide-react';
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

interface Term {
  id: string;
  source: string;
  target: string;
  context?: string;
  category?: string;
}

interface Glossary {
  id: string;
  name: string;
  description: string;
  language: string;
  termCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function GlossaryPage() {
  const [glossaries, setGlossaries] = useState<Glossary[]>([
    {
      id: '1',
      name: '技术术语库',
      description: '常用技术术语中英对照',
      language: 'en',
      termCount: 156,
      createdAt: '2026-01-15',
      updatedAt: '2026-02-01',
    },
    {
      id: '2',
      name: '法律术语库',
      description: '法律文档专用术语',
      language: 'en',
      termCount: 89,
      createdAt: '2026-01-20',
      updatedAt: '2026-01-28',
    },
  ]);

  const [selectedGlossary, setSelectedGlossary] = useState<Glossary | null>(glossaries[0]);
  const [terms, setTerms] = useState<Term[]>([
    { id: '1', source: '人工智能', target: 'Artificial Intelligence', category: '技术' },
    { id: '2', source: '机器学习', target: 'Machine Learning', category: '技术' },
    { id: '3', source: '深度学习', target: 'Deep Learning', category: '技术' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTerm, setNewTerm] = useState({ source: '', target: '', context: '', category: '' });

  const filteredTerms = terms.filter((term) =>
    term.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTerm = () => {
    if (!newTerm.source || !newTerm.target) return;

    const term: Term = {
      id: Math.random().toString(36).substring(7),
      ...newTerm,
    };

    setTerms([...terms, term]);
    setNewTerm({ source: '', target: '', context: '', category: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteTerm = (id: string) => {
    setTerms(terms.filter((t) => t.id !== id));
  };

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
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    新建词库
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新词库</DialogTitle>
                    <DialogDescription>
                      创建一个新的术语库来管理专业词汇
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        词库名称
                      </label>
                      <Input
                        placeholder="例如：技术术语库"
                        value={newTerm.source}
                        onChange={(e) => setNewTerm({ ...newTerm, source: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        描述
                      </label>
                      <Input
                        placeholder="简要描述此词库的用途"
                        value={newTerm.target}
                        onChange={(e) => setNewTerm({ ...newTerm, target: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button className="btn-primary" onClick={handleAddTerm}>
                      创建
                    </Button>
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
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              我的词库 ({glossaries.length})
            </h2>
            {glossaries.map((glossary) => (
              <Card
                key={glossary.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedGlossary?.id === glossary.id
                    ? 'border-2 border-primary-500 bg-primary-50'
                    : 'hover:border-border'
                }`}
                onClick={() => setSelectedGlossary(glossary)}
              >
                <h3 className="font-semibold text-foreground mb-1">{glossary.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{glossary.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{glossary.termCount} 个术语</span>
                  <Badge className="badge-primary">{glossary.language}</Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Right - Term List */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-display font-semibold">
                    {selectedGlossary?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{selectedGlossary?.description}</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      添加术语
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加新术语</DialogTitle>
                      <DialogDescription>
                        添加源语言和目标语言的术语对照
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          源语言术语
                        </label>
                        <Input
                          placeholder="例如：人工智能"
                          value={newTerm.source}
                          onChange={(e) => setNewTerm({ ...newTerm, source: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          目标语言术语
                        </label>
                        <Input
                          placeholder="例如：Artificial Intelligence"
                          value={newTerm.target}
                          onChange={(e) => setNewTerm({ ...newTerm, target: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          上下文/注释（可选）
                        </label>
                        <Input
                          placeholder="例如：计算机科学领域"
                          value={newTerm.context}
                          onChange={(e) => setNewTerm({ ...newTerm, context: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          分类（可选）
                        </label>
                        <Input
                          placeholder="例如：技术"
                          value={newTerm.category}
                          onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button className="btn-primary" onClick={handleAddTerm}>
                        添加
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索术语..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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
                    {filteredTerms.map((term) => (
                      <TableRow key={term.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{term.source}</TableCell>
                        <TableCell>{term.target}</TableCell>
                        <TableCell>
                          {term.category && (
                            <Badge className="badge-primary text-xs">{term.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTerm(term.id)}
                            >
                              <Trash2 className="w-4 h-4 text-error" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTerms.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {searchQuery ? '未找到匹配的术语' : '暂无术语，点击上方按钮添加'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{terms.length}</p>
                  <p className="text-sm text-muted-foreground">总术语数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(terms.map((t) => t.category)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">分类数量</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">使用率</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

# 🚀 V0 平台实现 Prompt - AI 翻译平台

> 基于UI/UX Pro Max 专业设计系统优化
> 目标: 创建完整的 Web 原型

---

## 📋 项目概述

**项目名称**: TranslateAI - AI Office 文档翻译平台
**目标用户**: 专业用户和企业团队
**核心价值**: 智能翻译，保留格式，高效工作

---

## 🎨 设计系统（基于 UI/UX Pro Max）

### 设计模式
- **主模式**: Minimal Single Column
- **风格**: Glassmorphism（毛玻璃态）+ Clean Modern
- **参考**: Stripe / Vercel 的简洁现代风格

### 色彩方案

#### 方案 A: Cyan + Green（UI/UX Pro Max 推荐）
```css
--primary-500: #0891B2      /* Cyan 600 */
--primary-400: #22D3EE      /* Cyan 400 */
--secondary-500: #22C55E    /* Green 500 */
--background: #ECFEFF       /* Cyan 50 */
--text-main: #164E63        /* Cyan 900 */
--text-muted: #4B5563       /* Gray 600 */
```

#### 方案 B: Indigo + Violet（备选）
```css
--primary-500: #6366F1      /* Indigo 500 */
--secondary-500: #8B5CF6    /* Violet 500 */
--gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)
--background: #F9FAFB       /* Gray 50 */
--text-main: #111827        /* Gray 900 */
```

### 字体系统

#### 方案 A: Poppins + Open Sans（推荐）
```css
--font-display: 'Poppins', sans-serif;
--font-body: 'Open Sans', sans-serif;
```

#### 方案 B: Space Grotesk + Inter
```css
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

### 设计原则

#### ✅ 必须
1. **可访问性优先**
   - 颜色对比度最小 4.5:1
   - 所有交互元素有 `cursor-pointer`
   - 焦点状态可见（`focus:ring-2`）
   - 键盘导航友好
   - ARIA 标签完整

2. **性能优化**
   - 使用 Next.js Image 组件
   - 懒加载非首屏内容
   - 代码分割
   - Skeleton 加载状态

3. **响应式设计**
   - 移动优先策略
   - 测试断点: 375px, 768px, 1024px, 1440px
   - 表格在移动端使用水平滚动或卡片布局

4. **交互动效**
   - 微交互: 150-200ms
   - 状态切换: 200-300ms
   - 使用 `ease-out` 缓动
   - 尊重 `prefers-reduced-motion`

#### ❌ 避免
1. 不使用表情符号作为图标（使用 SVG）
2. 不使用 `scale` 导致布局偏移
3. 不使用 `linear` 缓动
4. 不无限动画（仅用于加载）
5. 不仅用颜色传达信息

---

## 🏗 页面结构

### 1. Landing Page（首页）

**URL**: `/`

#### 布局: Minimal Single Column
```
1. Header（固定导航）
   - Logo（左侧）
   - 导航链接（中间：功能、价格、文档）
   - CTA 按钮（右侧：登录、免费开始）

2. Hero Section
   - Badge: "新一代 AI 文档翻译平台"
   - H1: "智能翻译 保持格式 专业高效"
   - 副标题: 支持 PPT、Word、Excel、PDF
   - CTA 按钮: "免费开始翻译"（大，渐变背景）
   - Social Proof: "免费试用 · 无需信用卡 · 秒级处理"

3. Hero Demo（UI 预览）
   - 模拟翻译界面
   - 左侧: 文件上传区
   - 右侧: 设置面板
   - Glow 效果和卡片阴影

4. Features Section（6 个功能卡片）
   - 多格式支持
   - AI 智能翻译
   - 术语库管理
   - 对话翻译
   - 格式保留
   - API 集成

   **布局**: Grid 3 列（移动端 1 列）

5. Pricing Section（3 种方案）
   - 免费版: ¥0/月
   - 专业版: ¥99/月（"最受欢迎"标签）
   - 企业版: 定制价格

   **布局**: Grid 3 列（移动端 1 列）

6. Footer
   - Logo + 简介
   - 产品链接（功能、价格、API）
   - 资源链接（文档、博客、支持）
   - 公司链接（关于、联系、隐私）
```

#### 关键设计点
- **背景**: 渐变背景 + 网格纹理
- **导航**: 固定顶部，添加 `pt-20` 到 body 避免内容遮挡
- **CTA**: 大按钮，渐变背景，高对比度（7:1+）
- **卡片**: 悬停时边框颜色变化 + 阴影加深

---

### 2. Translate Page（翻译页面）

**URL**: `/translate`

#### 布局: Dashboard（侧边栏 + 主内容）

```
Header（固定）
├── Logo
├── 返回按钮
├── 页面标题
└── 工具栏（词库、历史、设置）

Main Content（Grid: 2/3 + 1/3）
├── 左栏（2/3）
│   ├── File Uploader（拖拽上传区）
│   │   ├── 虚线边框
│   │   ├── 图标 + 文案
│   │   └── 选择文件按钮
│   │
│   └── Progress Bar（翻译进度）
│       ├── 状态指示
│       ├── 进度条
│       ├── 百分比 + 预计时间
│       └── 统计数据（完成时）
│
└── 右栏（1/3）
    ├── 语言选择（快速按钮网格）
    ├── 高级语言选择器（下拉）
    ├── AI 模型选择
    ├── 词库选择（可选）
    └── 开始翻译按钮（大）
```

#### 关键组件

**File Uploader**:
```tsx
// 状态
- 默认: 拖拽区域
- 悬停: 边框高亮
- 上传中: 显示文件卡片
- 文件卡片: 图标 + 文件名 + 大小 + 删除按钮
```

**Language Selector**:
```tsx
// 快速选择（8 个常用语言）
Grid 2x4: 英文、中文、日文、韩文、法文、德文、西班牙文、葡萄牙文

// 高级选择器（下拉）
- 搜索框
- 20+ 语言列表
- 使用 Command 组件
```

**Model Selector**:
```tsx
// 3 个模型卡片
- GPT-4o Mini（快速）
- GPT-4o（推荐，徽章）
- Claude 3.5 Sonnet（高质量）

每个卡片:
- 名称 + 描述
- 速度/质量徽章
- 价格显示
- 选择状态（边框高亮）
```

**Progress Bar**:
```tsx
// 状态
- 上传中: 0-20%
- 翻译中: 20-100%
- 完成: 绿色勾选 + 下载按钮
- 错误: 红色错误图标 + 重试按钮

// 信息
- 文件名
- 当前状态文本
- 进度条（渐变色）
- 百分比
- 预计剩余时间

// 完成时
- 统计卡片（完成度、耗时、文件大小）
- 下载按钮
```

#### 响应式处理
```tsx
// 移动端（< 768px）
- 单列布局
- 右栏折叠到下方
- 快速语言选择改为 2x4 网格
```

---

### 3. Glossary Page（词库管理）

**URL**: `/glossary`

#### 布局: Dashboard（双栏）

```
Main Content（Grid: 1/4 + 3/4）
├── 左栏（1/4）- 词库列表
│   ├── 创建词库按钮
│   ├── 搜索框
│   └── 词库列表（卡片）
│       ├── 词库名称
│       ├── 术语数量
│       └── 操作按钮（编辑、删除）
│
└── 右栏（3/4）- 术语表格
    ├── 工具栏
    │   ├── 搜索框
    │   ├── 批量导入按钮
    │   └── 添加术语按钮
    │
    ├── Table（桌面端）
    │   ├── 列: 原文、译文、语言、标签、操作
    │   ├── 排序功能
    │   └── 分页
    │
    └── Cards（移动端）
        └── 术语卡片列表
```

#### 关键组件

**术语表格**:
```tsx
// 桌面端
<table className="w-full">
  <thead>
    <tr>
      <th>原文</th>
      <th>译文</th>
      <th>语言</th>
      <th>标签</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody>
    {terms.map(term => (
      <tr key={term.id}>
        <td>{term.source}</td>
        <td>{term.target}</td>
        <td><Badge>{term.language}</Badge></td>
        <td>
          {term.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </td>
        <td>
          <Button variant="ghost" size="sm">编辑</Button>
          <Button variant="ghost" size="sm">删除</Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

// 移动端（响应式）
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
    {/* 同上 */}
  </table>
</div>
```

**添加/编辑术语对话框**:
```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>添加术语</DialogTitle>
  </DialogHeader>

  <Form>
    <FormField name="source">
      <FormLabel>原文</FormLabel>
      <Input placeholder="输入原文" />
    </FormField>

    <FormField name="target">
      <FormLabel>译文</FormLabel>
      <Input placeholder="输入译文" />
    </FormField>

    <FormField name="language">
      <FormLabel>语言</FormLabel>
      <LanguageSelector />
    </FormField>

    <FormField name="tags">
      <FormLabel>标签</FormLabel>
      <Input placeholder="用逗号分隔" />
    </FormField>
  </Form>

  <DialogFooter>
    <Button variant="outline">取消</Button>
    <Button>保存</Button>
  </DialogFooter>
</Dialog>
```

---

### 4. Pricing Page（订阅页面）

**URL**: `/pricing`

#### 布局: 单列居中

```
1. Hero Section
   - H1: "灵活的定价 按需选择"
   - 副标题: "从免费开始，随业务增长随时升级"

2. 计费切换
   - 月付 / 年付（省 20% 标签）
   - Toggle 切换

3. Pricing Cards（Grid 3 列）
   ├── 免费版
   │   ├── ¥0/月
   │   ├── 功能列表（✓ 5 项）
   │   └── "免费开始" 按钮（outline）
   │
   ├── 专业版（"最受欢迎" 徽章）
   │   ├── ¥99/月
   │   ├── 功能列表（✓ 8 项）
   │   └── "立即订阅" 按钮（primary）
   │
   └── 企业版
       ├── 定制价格
       ├── 功能列表（✓ 10 项）
       └── "联系我们" 按钮（outline）

4. 功能对比表
   ├── 列: 功能、免费版、专业版、企业版
   └── 行: 10+ 项功能对比

5. FAQ Section（4-8 个问题）
   └── 手风琴展开/收起

6. CTA Section（渐变背景）
   ├── H2: "准备好开始了吗？"
   ├── 副标题
   └── 两个按钮: "免费开始" + "联系销售"
```

#### 关键设计点
- **突出推荐**: 中间卡片上移 + "最受欢迎" 徽章
- **对比清晰**: 表格形式对比功能
- **转化优化**: 多个 CTA 点

---

## 🧩 核心组件规范

### Button（按钮）

```tsx
// Primary
<Button className="
  bg-gradient-to-r from-primary-600 to-secondary-600
  text-white
  px-6 py-3 rounded-lg
  font-medium shadow-md
  hover:from-primary-700 hover:to-secondary-700
  hover:shadow-lg
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  cursor-pointer
">
  开始翻译
</Button>

// Secondary
<Button variant="outline" className="
  bg-white text-gray-700
  border border-gray-300
  hover:bg-gray-50 hover:border-gray-400
  transition-all duration-200
  cursor-pointer
">
  取消
</Button>

// Loading State
<Button disabled={loading}>
  {loading ? <Spinner className="animate-spin" /> : '提交'}
</Button>
```

### Card（卡片）

```tsx
<Card className="
  bg-white rounded-xl border border-gray-200 shadow-card
  transition-all duration-200
  hover:border-primary-300 hover:shadow-md
  cursor-pointer
">
  {/* 内容 */}
</Card>

// Glassmorphism
<Card className="
  backdrop-blur-xl bg-white/80
  border border-white/20
  shadow-lg
">
  {/* 内容 */}
</Card>
```

### Input（输入框）

```tsx
<Input className="
  w-full px-4 py-2.5
  rounded-lg border border-gray-300
  focus:outline-none
  focus:ring-2 focus:ring-primary-500/20
  focus:border-primary-500
  transition-all duration-200
  placeholder:text-gray-400
" />

// Error State
<Input className="
  border-error ring-4 ring-error/10
" />

// Success State
<Input className="
  border-success ring-4 ring-success/10
" />
```

### Table（表格）

```tsx
// 桌面端
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-medium">
          列名
        </th>
      </tr>
    </thead>
    <tbody>
      {rows.map(row => (
        <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
          <td className="px-6 py-4">{row.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

// 移动端卡片
<div className="space-y-4 md:hidden">
  {rows.map(row => (
    <Card key={row.id}>
      {/* 卡片内容 */}
    </Card>
  ))}
</div>
```

### Dialog（对话框）

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>标题</DialogTitle>
      <DialogDescription>描述</DialogDescription>
    </DialogHeader>

    {/* 内容 */}

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        取消
      </Button>
      <Button>确认</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form（表单）

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm({
  resolver: zodResolver(formSchema),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit">提交</Button>
  </form>
</Form>
```

---

## 📱 响应式设计规范

### 断点

```css
/* Tailwind 默认 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
2xl: 1536px /* 超大屏 */
```

### 布局策略

```tsx
// Grid 响应式
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>

// 隐藏/显示
<div className="hidden md:block">桌面端显示</div>
<div className="block md:hidden">移动端显示</div>

// 字体响应式
<h1 className="text-4xl md:text-6xl lg:text-7xl">
  响应式标题
</h1>
```

### 移动端优化

```tsx
// 表格水平滚动
<div className="overflow-x-auto -mx-4 px-4">
  <table className="w-full min-w-[600px]">
    {/* 表格内容 */}
  </table>
</div>

// 表格改为卡片
<div className="md:hidden space-y-4">
  {rows.map(row => (
    <Card key={row.id}>
      {/* 卡片内容 */}
    </Card>
  ))}
</div>
```

---

## ♿ 可访问性清单

### ✅ 必须

1. **键盘导航**
   - Tab 顺序与视觉顺序一致
   - 焦点状态可见（`focus:ring-2`）
   - 跳转到主内容链接

2. **ARIA 标签**
   - 仅图标按钮有 `aria-label`
   - 表单输入有 `label`
   - 对话框有完整语义结构

3. **颜色对比度**
   - 普通文本最小 4.5:1
   - 大文本最小 3:1
   - 推荐使用 7:1+

4. **不仅用颜色**
   - 错误状态: 红色 + 错误图标
   - 成功状态: 绿色 + 勾选图标
   - 警告状态: 橙色 + 警告图标

5. **Alt 文本**
   - 有意义的图像有描述性 alt
   - 装饰性图像 alt=""

6. **表单标签**
   - 使用 `<label for="...">`
   - 禁止仅用 placeholder

---

## ✨ 动画规范

### 时长

```css
/* 微交互 */
hover: 150-200ms

/* 状态切换 */
transition: 200-300ms

/* 页面过渡 */
transition: 300-400ms
```

### 缓动

```css
/* 进入 */
ease-out

/* 退出 */
ease-in

/* 状态切换 */
ease-in-out
```

### 加载状态

```tsx
// Skeleton 骨架屏
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded" />
</div>

// Spinner 加载器
<div className="animate-spin">
  <LoaderIcon />
</div>
```

### 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎯 V0 实现优先级

### Phase 1: 核心页面（必须）

1. **Landing Page**
   - Header + Navigation
   - Hero Section + CTA
   - Features Grid（6 个卡片）
   - Pricing Cards（3 个方案）
   - Footer

2. **Translate Page**
   - File Uploader（拖拽上传）
   - Language Selector（快速 + 高级）
   - Model Selector（3 个模型）
   - Progress Bar（完整状态）

### Phase 2: 重要页面（应该）

3. **Glossary Page**
   - 词库列表（左侧）
   - 术语表格（右侧）
   - 添加/编辑对话框

4. **Pricing Page**
   - 计费切换（月付/年付）
   - Pricing Cards（3 个）
   - 功能对比表
   - FAQ

### Phase 3: 优化细节（可以）

- Loading 状态
- 错误处理
- 深色模式
- 更多交互动画

---

## 📦 技术栈

```json
{
  "framework": "Next.js 14",
  "ui": "shadcn/ui",
  "styling": "Tailwind CSS",
  "forms": "React Hook Form + Zod",
  "icons": "Lucide React",
  "fonts": "Poppins + Open Sans (或 Space Grotesk + Inter)"
}
```

---

## 🎨 设计交付

### 需要 V0 生成

1. **4 个主要页面**（Landing, Translate, Glossary, Pricing）
2. **5 个核心组件**（FileUploader, LanguageSelector, ModelSelector, ProgressBar, GlossaryTable）
3. **响应式设计**（375px - 1440px）
4. **可访问性**（WCAG AA 标准）
5. **交互状态**（hover, focus, loading, error）

### 设计风格参考

- **主要**: Stripe / Vercel 的简洁现代风格
- **色彩**: Glassmorphism 毛玻璃效果
- **字体**: Poppins + Open Sans（科技感）
- **间距**: 大量留白，视觉呼吸感
- **阴影**: 微妙，不过分

---

## 🚀 开始实现

请在 V0 平台上实现以上设计，优先完成 Phase 1 的核心页面和组件。

**重点**:
- ✅ 可访问性优先
- ✅ 响应式设计
- ✅ 性能优化
- ✅ 代码质量

---

**创建日期**: 2026-02-04
**设计者**: Claude (UI/UX Pro Max)
**版本**: v3.0（优化版）

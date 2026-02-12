# 🎨 AI 翻译平台 - Next.js 全栈项目

> **项目名称**: AI 文档翻译平台 (TranslateAI)
> **架构版本**: v3.0.0 - Next.js 全栈架构
> **技术栈**: Next.js 14 + React 18 + TypeScript + Tailwind CSS + shadcn/ui
> **更新日期**: 2026-02-12

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入必需配置（数据库、API Keys）

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:3000
```

### 项目结构说明

```
项目根目录/              # Next.js 全栈应用
├── app/                # App Router（前端页面 + API Routes）
│   ├── (dashboard)/    # 主应用路由组
│   ├── (pricing)/      # 定价路由组
│   └── api/            # 后端 API Routes
├── components/         # React 组件
├── lib/                # 工具库
├── source_back/        # Python 后端（已归档，作为参考）
└── cc_code/            # 开发过程文件和文档
```

**重要说明**:
- 项目已从 Python/FastAPI 重构为 Next.js 全栈架构
- Python 代码保留在 `source_back/` 目录作为实现参考
- API Routes 骨架已创建，业务逻辑待实现

---

## 📐 设计文档

本文档后续内容为前端设计方案，包含设计系统、组件库、页面架构等详细说明。

> **设计风格**: 简洁现代 (Stripe/Vercel 风格)
> **设计日期**: 2026-02-04

---

## 📋 目录

- [设计系统](#设计系统)
- [页面架构](#页面架构)
- [核心组件](#核心组件)
- [交互动效](#交互动效)
- [响应式设计](#响应式设计)
- [文件清单](#文件清单)
- [下一步开发](#下一步开发)

---

## 🎨 设计系统

### 色彩方案

**主色调**: Indigo + Violet 渐变
```css
--primary-500: #6366f1  /* 主色 */
--secondary-500: #8b5cf6  /* 辅色 */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
```

**语义色**:
- Success: `#10b981` (绿色)
- Warning: `#f59e0b` (橙色)
- Error: `#ef4444` (红色)
- Info: `#3b82f6` (蓝色)

### 字体系统

**Display (标题)**: Space Grotesk
- 科技感、现代感
- 用于 H1-H6、卡片标题

**Body (正文)**: Geist / Inter
- 清晰易读
- 用于正文、UI 文本

**Mono (代码)**: Geist Mono / Fira Code
- 等宽字体
- 用于代码、数字、文件路径

### 间距系统

```css
--spacing-1: 0.25rem  (4px)
--spacing-2: 0.5rem   (8px)
--spacing-4: 1rem     (16px) - 基础单位
--spacing-8: 2rem     (32px)
--spacing-12: 3rem    (48px)
```

### 圆角系统

```css
--radius-sm: 0.375rem  (6px)
--radius-md: 0.5rem    (8px)  - 默认圆角
--radius-lg: 0.75rem   (12px) - 卡片
--radius-xl: 1rem      (16px) - 大卡片
```

### 阴影系统

```css
--shadow-card: 0 2px 8px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.02)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-glow: 0 0 20px rgb(99 102 241 / 0.3)
```

---

## 🏗 页面架构

### 路由结构 (Next.js App Router)

```
/                           # Landing Page (首页)
├── /login                  # 登录页
├── /signup                 # 注册页
├── /pricing                # 价格页
│
├── /(dashboard)/           # 主应用路由组
│   ├── /                   # Dashboard 首页
│   ├── /translate          # 翻译页面
│   │   ├── /documents      # 文档翻译
│   │   └── /chat           # 对话翻译
│   ├── /glossary           # 词库管理
│   ├── /history            # 翻译历史
│   └── /settings           # 设置
│
├── /(pricing)/             # 订阅路由组
│   └── /page.tsx           # 价格页面
│   └── /checkout           # 结账流程
│
└── /api/                   # API Routes
    ├── /auth/[...nextauth]/
    ├── /translate/
    ├── /glossary/
    └── /subscription/
```

### 核心页面说明

#### 1. Landing Page (`app/page.tsx`)

**功能**: 产品介绍和转化

**关键区域**:
- Hero Section: 标题、副标题、CTA、演示图
- Features Section: 6 个核心功能卡片
- Pricing Section: 3 种订阅方案
- Footer: 导航链接

**设计亮点**:
- 渐变背景 + 网格纹理
- 卡片悬停效果
- 平滑滚动动画

#### 2. Translate Page (`app/(dashboard)/translate/page.tsx`)

**功能**: 文档翻译主界面

**布局**: 三栏网格
- 左栏 (2/3): 文件上传区 + 进度条
- 右栏 (1/3): 设置面板（语言、模型、词库）

**组件**:
- FileUploader: 拖拽上传
- LanguageSelector: 语言选择
- ModelSelector: AI 模型选择
- ProgressBar: 翻译进度

**交互流程**:
1. 上传文件 → 2. 选择语言和模型 → 3. 开始翻译 → 4. 下载结果

#### 3. Glossary Page (`app/(dashboard)/glossary/page.tsx`)

**功能**: 术语库管理

**布局**: 双栏
- 左栏 (1/4): 词库列表
- 右栏 (3/4): 术语表格 + 搜索 + 添加

**功能**:
- 创建/编辑/删除术语
- 搜索过滤
- 批量导入导出

#### 4. Pricing Page (`app/(pricing)/page.tsx`)

**功能**: 订阅方案展示

**内容**:
- 3 种方案卡片（免费/专业/企业）
- 功能对比表
- FAQ
- CTA

**设计**:
- 突出"最受欢迎"标签
- 年付优惠提示
- 详细功能对比表

---

## 🧩 核心组件

### 1. FileUploader (`components/translate/file-uploader.tsx`)

**功能**: 文件拖拽上传

**特性**:
- 拖拽 + 点击上传
- 文件类型验证
- 文件大小限制
- 多文件支持
- 上传预览 + 移除

**UI**:
- 虚线边框上传区
- 拖拽时高亮效果
- 文件卡片列表

### 2. LanguageSelector (`components/translate/language-selector.tsx`)

**功能**: 目标语言选择

**特性**:
- 20+ 语言支持
- 搜索过滤
- Command 组件实现下拉菜单

**变体**:
- 下拉选择器 (LanguageSelector)
- 快速按钮网格 (QuickLanguageSelector)

### 3. ModelSelector (`components/translate/model-selector.tsx`)

**功能**: AI 模型选择

**模型**:
- GPT-4o Mini (快速)
- GPT-4o (推荐)
- Claude 3.5 Sonnet (高质量)

**特性**:
- 模型描述和对比
- 速度/质量徽章
- 价格显示
- 推荐标签

### 4. ProgressBar (`components/translate/progress-bar.tsx`)

**功能**: 翻译进度展示

**状态**:
- idle: 初始
- uploading: 上传中
- processing: 翻译中
- completed: 完成
- error: 失败

**UI**:
- 渐变进度条
- 百分比显示
- 预估剩余时间
- 下载按钮（完成时）
- 重试按钮（失败时）

### 5. shadcn/ui 基础组件

使用 shadcn/ui 组件库：
- Button
- Card
- Input
- Dialog
- Table
- Tabs
- Popover
- Badge

---

## ✨ 交互动效

### 页面加载动画

```css
.animate-fade-in      /* 淡入 */
.animate-slide-up     /* 上浮淡入 */
.animate-scale-in     /* 缩放淡入 */
```

### 悬停效果

- 卡片: `hover:border-primary-300 hover:shadow-md`
- 按钮: `hover:from-primary-700 hover:to-secondary-700`
- 按钮: `hover:bg-gray-50`

### 过渡动画

```css
transition-all duration-200
transition-colors duration-150
```

### 加载状态

- Skeleton 骨架屏: `.skeleton` 类
- Spin 加载动画: `animate-spin`
- Pulse 脉冲效果: `animate-pulse`

---

## 📱 响应式设计

### 断点

```css
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
2xl: 1536px /* 超大屏 */
```

### 响应式策略

1. **移动优先**: 默认样式为移动端
2. **弹性网格**: `grid-cols-1 md:grid-cols-3`
3. **隐藏元素**: `hidden md:block`
4. **自适应字体**: `text-4xl md:text-6xl`

---

## 📁 文件清单

### 设计系统文件

```
web/
├── DESIGN_SYSTEM.md         # 设计系统文档
├── PROJECT_STRUCTURE.md     # 项目结构说明
└── app/
    └── globals.css          # 全局样式和 CSS 变量
```

### 页面文件

```
web/app/
├── page.tsx                         # Landing Page
├── (dashboard)/
│   ├── translate/page.tsx           # 翻译页面
│   └── glossary/page.tsx           # 词库管理
└── (pricing)/
    └── page.tsx                     # 价格页面
```

### 组件文件

```
web/components/
├── translate/
│   ├── file-uploader.tsx            # 文件上传
│   ├── language-selector.tsx       # 语言选择
│   ├── model-selector.tsx          # 模型选择
│   └── progress-bar.tsx            # 进度条
└── ui/                              # shadcn/ui 基础组件
```

---

## 🚀 下一步开发

### Phase 1: 基础框架 (1-2 周)

- [x] 设计系统和全局样式
- [x] Landing Page
- [x] 核心翻译页面
- [x] 词库管理页面
- [x] 价格页面
- [ ] NextAuth.js 认证集成
- [ ] 数据库 Schema 设计
- [ ] API Routes 实现

### Phase 2: 核心功能 (2-3 周)

- [ ] 文件上传和存储
- [ ] 翻译服务集成（调用现有 API）
- [ ] WebSocket 实时进度推送
- [ ] 翻译历史管理
- [ ] 术语库 CRUD
- [ ] 批量翻译功能

### Phase 3: 订阅系统 (1-2 周)

- [ ] Stripe 支付集成
- [ ] 订阅管理
- [ ] 使用量统计和限额
- [ ] 发票系统
- [ ] 试用到期提醒

### Phase 4: 优化和部署 (1 周)

- [ ] 性能优化
- [ ] SEO 优化
- [ ] E2E 测试
- [ ] Docker 部署
- [ ] CI/CD 配置
- [ ] 监控和日志

---

## 🎯 技术栈总结

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| UI 库 | shadcn/ui + Tailwind CSS |
| 状态管理 | Zustand / React Context |
| 认证 | NextAuth.js |
| 数据库 | PostgreSQL + Prisma |
| 支付 | Stripe |
| 部署 | Vercel |

---

## 📸 设计截图

### Landing Page
- Hero Section: 渐变标题 + CTA
- Features Grid: 6 个功能卡片
- Pricing Cards: 3 种方案

### Dashboard
- Sidebar Navigation
- File Upload Area
- Settings Panel
- Progress Tracking

### Glossary Manager
- Glossary List (Left)
- Term Table (Right)
- Add/Edit Dialog

---

## 🎨 设计亮点

1. **简洁现代**: 类似 Stripe 的设计语言
2. **色彩一致**: Indigo + Violet 渐变贯穿全站
3. **微交互**: 悬停、点击、加载动画
4. **响应式**: 完美适配移动端到桌面端
5. **可访问性**: 清晰的焦点状态和键盘导航

---

## 📝 设计原则

1. **KISS**: 保持简单直观
2. **一致性**: 统一的视觉语言
3. **反馈**: 明确的状态和进度
4. **效率**: 减少点击和操作步骤
5. **美观**: 细节精致，视觉愉悦

---

**设计师**: Claude (Frontend Design Skill)
**日期**: 2026-02-04
**版本**: v1.0

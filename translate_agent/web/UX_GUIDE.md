# 🎨 TranslateAI - 完整 UX 设计规范

> **版本**: v2.0
> **创建日期**: 2026-02-04
> **基于**: UI/UX Pro Max 设计系统

---

## 📋 目录

- [设计系统](#设计系统)
- [色彩规范](#色彩规范)
- [字体系统](#字体系统)
- [组件规范](#组件规范)
- [交互动效](#交互动效)
- [响应式设计](#响应式设计)
- [可访问性](#可访问性)
- [性能优化](#性能优化)
- [Next.js 最佳实践](#nextjs-最佳实践)

---

## 🎨 设计系统

### 设计模式

**模式名称**: Minimal Single Column (简约单栏)

**核心理念**:
- 单一 CTA 聚焦 - 大字体，大量留白
- 无导航干扰 - 移动优先
- 居中大型 CTA 按钮

**页面结构**:
1. Hero 标题
2. 简短描述
3. 优势要点（最多 3 个）
4. CTA 行动号召
5. 页脚

**视觉风格**:
- **风格**: Glassmorphism (毛玻璃态)
- **关键词**: 磨砂玻璃、透明、模糊背景、分层、活力背景、光源、深度、多层

**适用场景**:
- 现代 SaaS
- 金融仪表板
- 高端企业
- 生活方式应用
- 模态覆盖层
- 导航

**性能**: ⚠ 良好
**可访问性**: ⚠ 需确保 4.5:1 对比度

### 关键效果

1. **背景模糊** (Backdrop blur): 10-20px
2. **微妙的边框**: 1px solid rgba(255, 255, 255, 0.2)
3. **光线反射**: 光源效果
4. **Z 轴深度**: 多层叠加

### 反模式（避免）

- ❌ 过度动画
- ❌ 默认深色模式

---

## 🌈 色彩规范

### 主色调（推荐）

基于 UI/UX Pro Max 分析的 Cyan + Green 方案：

| 角色 | 颜色名称 | Hex | 用途 |
|------|---------|-----|------|
| Primary | Cyan 600 | `#0891B2` | 主要操作、链接、焦点 |
| Secondary | Cyan 400 | `#22D3EE` | 次要操作、高亮 |
| CTA | Green 500 | `#22C55E` | 行动号召按钮 |
| Background | Cyan 50 | `#ECFEFF` | 页面背景 |
| Text | Cyan 900 | `#164E63` | 主要文本 |

**说明**: 清新的青色 + 干净的绿色

### 备选方案（Indigo + Violet）

基于你的原始需求：

| 角色 | 颜色名称 | Hex | 用途 |
|------|---------|-----|------|
| Primary | Indigo 500 | `#6366F1` | 主要操作 |
| Secondary | Violet 500 | `#8B5CF6` | 次要操作 |
| CTA | 混合渐变 | `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)` | CTA 按钮 |
| Background | Gray 50 | `#F9FAFB` | 页面背景 |
| Text | Gray 900 | `#111827` | 主要文本 |

### 语义色

| 语义 | 颜色 | Hex | 用途 |
|------|------|-----|------|
| Success | Green | `#10B981` | 成功状态、确认 |
| Warning | Amber | `#F59E0B` | 警告、注意 |
| Error | Red | `#EF4444` | 错误、危险操作 |
| Info | Blue | `#3B82F6` | 信息提示 |

### 中性色

| 阴影 | Hex | 用途 |
|------|-----|------|
| Gray 50 | `#F9FAFB` | 背景色 |
| Gray 100 | `#F3F4F6` | 卡片背景 |
| Gray 200 | `#E5E7EB` | 边框 |
| Gray 400 | `#9CA3AF` | 禁用文本 |
| Gray 600 | `#4B5563` | 次要文本 |
| Gray 900 | `#111827` | 主要文本 |

### 渐变

```css
/* 主渐变 */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/* 微妙渐变 */
--gradient-subtle: linear-gradient(135deg, #f5f7ff 0%, #fdf4ff 100%);
```

### 色彩对比度要求

**WCAG AA 标准**:
- 普通文本 (14pt+): 最小 4.5:1
- 大文本 (18pt+): 最小 3:1

**推荐对比度**:
- Primary 按钮文本: 7:1 (最佳)
- 正文文本: 7:1-12:1
- 次要文本: 4.5:1-7:1

---

## ✍️ 字体系统

### 推荐字体组合（UI/UX Pro Max）

#### 方案 1: Poppins + Open Sans

**标题**: Poppins
**正文**: Open Sans
**风格**: 现代、专业、简洁、企业、友好、亲切

**适用场景**:
- SaaS 平台
- 企业网站
- 商业应用
- 初创公司
- 专业服务

**Google Fonts**:
```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
```

**配置**:
```css
/* 标题 */
--font-display: 'Poppins', sans-serif;

/* 正文 */
--font-body: 'Open Sans', sans-serif;
```

#### 方案 2: Space Grotesk + Geist/Inter（原始选择）

**标题**: Space Grotesk
**正文**: Geist / Inter
**风格**: 科技感、现代、简洁

**适用场景**:
- 科技产品
- AI 工具
- 开发者平台

### 字体尺度

```css
/* Tailwind 默认 */
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px - 正文最小 */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
text-5xl: 3rem      /* 48px */
text-6xl: 3.75rem   /* 60px */
```

### 字重

```css
/* 字重 */
Light: 300    /* 用于大标题 */
Regular: 400  /* 默认 */
Medium: 500   /* 强调 */
Semibold: 600 /* 小标题 */
Bold: 700     /* 大标题 */
```

### 行高和行长

**行高**:
- 标题: 1.2-1.4
- 正文: 1.5-1.75
- 代码: 1.4-1.6

**行长**:
- 每行 65-75 个字符（约 40-60 个汉字）
- 最大宽度: 65-75ch

### 字体加载

**最佳实践**:
```css
/* 使用 font-display: swap 避免不可见文本闪烁 */
@font-face {
  font-family: 'Poppins';
  font-display: swap;
}
```

**Next.js 字体优化**:
```typescript
import { Poppins, Open_Sans } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})
```

---

## 🧩 组件规范

### 按钮

#### 主要按钮 (Primary)

```tsx
<Button className="btn-primary">
  开始翻译
</Button>
```

**样式**:
```css
.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-secondary-600;
  @apply text-white;
  @apply px-6 py-3 rounded-lg;
  @apply font-medium shadow-md;
  @apply hover:from-primary-700 hover:to-secondary-700;
  @apply hover:shadow-lg;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply cursor-pointer;
}
```

#### 次要按钮 (Secondary)

```tsx
<Button variant="outline">
  取消
</Button>
```

**样式**:
```css
.btn-secondary {
  @apply bg-white text-gray-700;
  @apply border border-gray-300;
  @apply px-6 py-3 rounded-lg;
  @apply hover:bg-gray-50 hover:border-gray-400;
  @apply transition-all duration-200;
  @apply cursor-pointer;
}
```

#### 按钮状态

| 状态 | 样式 |
|------|------|
| Default | 默认样式 |
| Hover | 深化颜色、增加阴影 |
| Active | `scale-95` 微微缩小 |
| Disabled | `bg-gray-200 text-gray-400 cursor-not-allowed` |
| Loading | 显示 spinner、禁用点击 |

**加载按钮**:
```tsx
<Button disabled={loading}>
  {loading ? <Spinner className="animate-spin" /> : '提交'}
</Button>
```

### 卡片

#### 基础卡片

```tsx
<Card className="card">
  卡片内容
</Card>
```

**样式**:
```css
.card {
  @apply bg-white rounded-xl border border-gray-200;
  @apply shadow-card;
  @apply transition-all duration-200;
}

.card-hover:hover {
  @apply border-primary-300 shadow-md;
  @apply cursor-pointer;
}
```

#### 毛玻璃卡片（Glassmorphism）

```css
.card-glass {
  @apply backdrop-blur-xl bg-white/80;
  @apply border border-white/20;
  @apply shadow-lg;
}
```

### 输入框

```tsx
<Input className="input" placeholder="输入..." />
```

**样式**:
```css
.input {
  @apply w-full px-4 py-2.5;
  @apply rounded-lg border border-gray-300;
  @apply focus:outline-none;
  @apply focus:ring-2 focus:ring-primary-500/20;
  @apply focus:border-primary-500;
  @apply transition-all duration-200;
  @apply placeholder:text-gray-400;
}

/* 错误状态 */
.input-error {
  @apply border-error ring-4 ring-error/10;
}

/* 成功状态 */
.input-success {
  @apply border-success ring-4 ring-success/10;
}
```

### 表单标签

**正确** ✅:
```tsx
<label htmlFor="email">邮箱</label>
<input id="email" type="email" />
```

**错误** ❌:
```tsx
<input placeholder="邮箱" /> {/* 仅有 placeholder */}
```

### 徽章（Badge）

```tsx
<Badge className="badge-primary">Pro</Badge>
```

**样式**:
```css
.badge {
  @apply inline-flex items-center;
  @apply px-2.5 py-0.5 rounded-full;
  @apply text-xs font-medium;
}

.badge-primary {
  @apply bg-primary-100 text-primary-700;
}

.badge-success {
  @apply bg-emerald-100 text-emerald-700;
}

.badge-warning {
  @apply bg-amber-100 text-amber-700;
}

.badge-error {
  @apply bg-red-100 text-red-700;
}
```

---

## ✨ 交互动效

### 动画时长

| 动画类型 | 时长 | 缓动函数 |
|---------|------|---------|
| 微交互（按钮悬停） | 150-200ms | `ease-out` |
| 状态切换（展开/收起） | 200-300ms | `ease-in-out` |
| 页面过渡 | 300-400ms | `ease-out` |
| 复杂动画 | 400-500ms | `ease-in-out` |
| 警告：超过 500ms | ❌ 太慢，避免使用 |

**Tailwind 配置**:
```css
transition-all duration-200 ease-out
transition-colors duration-150
transition-transform duration-300 ease-in-out
```

### 缓动函数

```css
/* 推荐使用 */
ease-out      /* 进入元素 */
ease-in       /* 退出元素 */
ease-in-out   /* 状态切换 */

/* 避免使用 */
linear        /* ❌ 感觉机械 */
```

### 加载状态

#### Skeleton 骨架屏（推荐）

```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded" />
</div>
```

**何时使用**:
- 列表加载
- 卡片加载
- 仪表板数据加载

#### Spinner 加载器

```tsx
<div className="animate-spin">
  <LoaderIcon className="w-6 h-6" />
</div>
```

**何时使用**:
- 按钮加载
- 单个操作加载
- 快速操作（< 2秒）

**显示规则**: 操作 > 300ms 时显示加载指示器

### 悬停效果

**推荐** ✅:
```css
/* 颜色变化 */
hover:bg-gray-100
hover:text-primary-600

/* 阴影变化 */
hover:shadow-md

/* 边框变化 */
hover:border-primary-300
```

**避免** ❌:
```css
/* scale 会导致布局偏移 */
hover:scale-105
```

### 动画原则

1. **尊重用户偏好**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. **使用 transform 和 opacity**
```css
/* 好 - GPU 加速 */
transform: translateY(-10px)
opacity: 0.5

/* 避免 - 触发重排 */
width: 100px
height: 100px
```

3. **无限动画仅用于加载**
```css
/* ✅ 好 */
animate-spin on loading spinner

/* ❌ 不好 */
animate-bounce on decorative icon
```

---

## 📱 响应式设计

### 断点系统

```css
/* Tailwind 默认 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
2xl: 1536px /* 超大屏 */
```

### 移动优先

**默认样式**: 移动端
**响应式扩展**: 桌面端

```tsx
{/* 移动：1列，平板：2列，桌面：3列 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 视口元标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 可读字体大小

**移动端最小**: 16px (1rem)
**推荐正文**: 16-18px

```css
/* ❌ 移动端太小 */
text-sm { font-size: 0.875rem; } /* 14px */

/* ✅ 移动端可读 */
text-base { font-size: 1rem; } /* 16px */
```

### 水平滚动

**避免**: 确保内容适应视口宽度

```css
/* ❌ 不好 - 导致水平滚动 */
width: 100vw
padding: 0 2rem

/* ✅ 好 - 使用 max-width */
max-width: 100vw
padding: 0 2rem
box-sizing: border-box
```

### 测试尺寸

测试以下屏幕尺寸:
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (桌面)
- 1440px (大屏)

---

## ♿ 可访问性

### 关键原则

#### 1. 键盘导航

**所有功能必须可通过键盘访问**

```tsx
{/* ✅ 正确 */}
<button onClick={handleClick}>点击</button>

{/* ❌ 错误 - div 无法通过键盘访问 */}
<div onClick={handleClick}>点击</div>
```

**Tab 顺序**: 应与视觉顺序一致

```tsx
{/* 使用 tabIndex 自定义顺序 */}
<button tabIndex={1}>第一步</button>
<button tabIndex={2}>第二步</button>
```

#### 2. 焦点状态

**所有交互元素必须有可见焦点指示器**

```css
/* ✅ 正确 */
.focus:ring-2 .focus:ring-blue-500

/* ❌ 错误 - 移除焦点轮廓且无替代 */
.outline-none
```

#### 3. ARIA 标签

**仅图标按钮需要 aria-label**

```tsx
{/* ✅ 正确 */}
<button aria-label="关闭菜单">
  <XIcon />
</button>

{/* ❌ 错误 */}
<button>
  <XIcon />
</button>
```

#### 4. 跳转到主内容

```tsx
<a href="#main" className="sr-only focus:not-sr-only">
  跳转到主内容
</a>
```

#### 5. Alt 文本

**有意义的图像需要描述性 alt 文本**

```tsx
{/* ✅ 正确 */}
<img src="dog.jpg" alt="狗在公园里玩耍" />

{/* ❌ 错误 */}
<img src="dog.jpg" alt="" /> {/* 内容图片 */}
```

**装饰性图像**: `alt=""`

#### 6. 错误消息

**错误消息必须被屏幕阅读器朗读**

```tsx
{/* ✅ 正确 */}
<div role="alert" className="text-error">
  {error}
</div>

{/* ❌ 错误 - 仅视觉提示 */}
<div className="border-error">{/* 仅有红色边框 */}</div>
```

#### 7. 颜色对比度

**文本必须与背景有足够对比度**

| 对比度 | 等级 | 要求 |
|--------|------|------|
| 7:1+ | AAA | 最佳 |
| 4.5:1+ | AA | 最低标准 |
| < 4.5:1 | ❌ | 不合格 |

**示例**:
```css
/* ✅ 好 - 7:1 */
color: #333 on white

/* ❌ 差 - 2.8:1 */
color: #999 on white
```

#### 8. 不仅用颜色传达信息

```tsx
{/* ✅ 正确 - 颜色 + 图标 */}
<div className="text-error flex items-center gap-2">
  <ErrorIcon />
  <span>发生错误</span>
</div>

{/* ❌ 错误 - 仅用颜色 */}
<div className="text-red-500">错误</div>
```

#### 9. 表单标签

**输入框必须有关联标签**

```tsx
{/* ✅ 正确 */}
<label htmlFor="email">邮箱</label>
<input id="email" type="email" />

{/* ✅ 正确 - 包裹 */}
<label>
  邮箱
  <input type="email" />
</label>

{/* ❌ 错误 - 仅 placeholder */}
<input placeholder="邮箱" />
```

#### 10. 移动键盘

**显示适当的键盘类型**

```tsx
{/* ✅ 正确 */}
<input type="email" /> {/* 邮箱键盘 */}
<input type="number" inputMode="numeric" /> {/* 数字键盘 */}

{/* ❌ 错误 - 所有输入都用默认键盘 */}
<input type="text" inputMode="text" />
```

### ARIA 角色参考

| 元素 | 角色 | 何时使用 |
|------|------|---------|
| `<button>` | `button` | 无需显式声明 |
| `<a>` | `link` | 无需显式声明 |
| `<nav>` | `navigation` | 导航区域 |
| `<main>` | `main` | 主内容区 |
| `<aside>` | `complementary` | 侧边栏 |
| `<header>` | `banner` | 页眉 |
| `<footer>` | `contentinfo` | 页脚 |
| 自定义弹窗 | `dialog` | 模态对话框 |
| 错误提示 | `alert` | 动态错误 |

---

## ⚡ 性能优化

### 图片优化

#### 使用 Next.js Image 组件

```tsx
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero image"
  width={1200}
  height={600}
  priority // 首屏图片
  loading="lazy" // 非首屏图片
  placeholder="blur" // 模糊占位符
/>
```

#### 配置远程图片域名

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
}
```

#### 图片格式

**优先使用**: WebP
**回退**: JPEG/PNG

```html
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="描述" />
</picture>
```

### 懒加载

#### 图片懒加载

```html
<img loading="lazy" src="..." />
```

#### 组件懒加载

```tsx
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

### 代码分割

**避免不必要的 `'use client'`**

```tsx
// ✅ 默认服务端组件
export default function Page() {
  return <div>服务端渲染</div>
}

// ❌ 不必要的客户端组件
'use client'
export default function Page() {
  return <div>静态内容不需要客户端</div>
}
```

### Bundle 分析

```bash
# 安装
npm install @next/bundle-analyzer

# 使用
ANALYZE=true npm run build
```

### 字体优化

**使用可变字体减少 Bundle 大小**

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  // ✅ 单个可变字体文件
  variable: '--font-inter',
})
```

### 避免布局偏移

**为动态内容预留空间**

```tsx
// ✅ 好 - 使用骨架屏
{loading ? <Skeleton className="h-48" /> : <Content />}

// ❌ 差 - 内容突然出现
{loading ? null : <Content />}
```

---

## 🚀 Next.js 最佳实践

### Server Components vs Client Components

**默认使用 Server Components**

```tsx
// ✅ 默认 - 服务端组件
export default function Page() {
  return <div>内容</div>
}

// ❌ 过度使用客户端组件
'use client'
export default function Page() {
  return <div>静态内容</div>
}
```

**何时使用客户端组件**:
- 事件处理（onClick, onChange）
- 状态管理（useState, useEffect）
- 浏览器 API（window, document）
- React Hooks

### 图片优化

**✅ 使用 Image 组件**
```tsx
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
/>
```

**❌ 直接使用 img 标签**
```tsx
<img src="/logo.png" /> {/* 不推荐 */}
```

### 元数据

**包含 OpenGraph 图片**

```tsx
export const metadata = {
  title: 'TranslateAI - AI 文档翻译',
  description: '智能翻译，保留格式',
  openGraph: {
    title: 'TranslateAI',
    description: 'AI 文档翻译平台',
    images: ['/og.png'],
  },
}
```

### 路由

**使用 App Router（推荐）**

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── translate/
│   └── glossary/
└── page.tsx
```

### 部分预渲染（PPR）

**结合静态和动态内容**

```tsx
export default function Page() {
  return (
    <div>
      <Header /> {/* 静态 */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* 动态 */}
      </Suspense>
    </div>
  )
}
```

---

## 📏 间距和布局

### 间距系统

```css
/* Tailwind 默认 */
spacing-1: 0.25rem  /* 4px */
spacing-2: 0.5rem   /* 8px */
spacing-3: 0.75rem  /* 12px */
spacing-4: 1rem     /* 16px - 基础单位 */
spacing-6: 1.5rem   /* 24px */
spacing-8: 2rem     /* 32px */
spacing-12: 3rem    /* 48px */
spacing-16: 4rem    /* 64px */
```

### 圆角

```css
rounded-sm: 0.125rem  /* 2px */
rounded: 0.25rem      /* 4px */
rounded-md: 0.375rem  /* 6px */
rounded-lg: 0.5rem    /* 8px - 默认 */
rounded-xl: 0.75rem   /* 12px - 卡片 */
rounded-2xl: 1rem     /* 16px - 大卡片 */
rounded-full: 9999px  /* 完全圆角 */
```

### 阴影

```css
shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05)
shadow: 0 1px 3px rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### Z-index 管理

```css
/* 定义 z-index 规模 */
z-dropdown: 1000
z-sticky: 1020
z-fixed: 1030
z-modal-backdrop: 1040
z-modal: 1050
z-popover: 1060
z-tooltip: 1070
```

---

## 🎯 专业 UI 常见规则

### 图标和视觉元素

| 规则 | 做 | 不做 |
|------|----|-----|
| **不使用表情符号图标** | 使用 SVG 图标 (Heroicons, Lucide, Simple Icons) | 使用表情符号如 🎨 🚀 ⚙️ 作为 UI 图标 |
| **稳定的悬停状态** | 在悬停时使用颜色/不透明度过渡 | 使用会导致布局偏移的 scale 变换 |
| **正确的品牌 Logo** | 从 Simple Icons 研究官方 SVG | 猜测或使用错误的 Logo 路径 |
| **一致的图标大小** | 使用固定的 viewBox (24x24) 和 w-6 h-6 | 随机混合不同图标大小 |

### 交互和光标

| 规则 | 做 | 不做 |
|------|----|-----|
| **光标指针** | 为所有可点击/悬停的卡片添加 `cursor-pointer` | 在交互元素上保留默认光标 |
| **悬停反馈** | 提供视觉反馈（颜色、阴影、边框） | 无元素可交互的指示 |
| **平滑过渡** | 使用 `transition-colors duration-200` | 瞬间状态变化或太慢（>500ms） |

### 明暗模式对比度

| 规则 | 做 | 不做 |
|------|----|-----|
| **浅色模式毛玻璃卡片** | 使用 `bg-white/80` 或更高不透明度 | 使用 `bg-white/10`（太透明） |
| **浅色模式文本** | 对文本使用 `#0F172A`（slate-900） | 对正文文本使用 `#94A3B8`（slate-400） |
| **静音文本浅色** | 最少使用 `#475569`（slate-600） | 使用 gray-400 或更浅 |
| **边框可见性** | 在浅色模式使用 `border-gray-200` | 使用 `border-white/10`（不可见） |

### 布局和间距

| 规则 | 做 | 不做 |
|------|----|-----|
| **浮动导航栏** | 添加 `top-4 left-4 right-4` 间距 | 将导航栏固定到 `top-0 left-0 right-0` |
| **内容内边距** | 考虑固定的导航栏高度 | 让内容隐藏在固定元素后面 |
| **一致的最大宽度** | 使用相同的 `max-w-6xl` 或 `max-w-7xl` | 混合不同的容器宽度 |

---

## 📋 交付前检查清单

### 视觉质量

- [ ] 不使用表情符号作为图标（使用 SVG）
- [ ] 所有图标来自一致的图标集（Heroicons/Lucide）
- [ ] 品牌 Logo 正确（从 Simple Icons 验证）
- [ ] 悬停状态不导致布局偏移
- [ ] 直接使用主题颜色（bg-primary）而非 var() 包装

### 交互

- [ ] 所有可点击元素都有 `cursor-pointer`
- [ ] 悬停状态提供清晰的视觉反馈
- [ ] 过渡平滑（150-300ms）
- [ ] 键盘导航的焦点状态可见

### 明暗模式

- [ ] 浅色模式文本有足够对比度（4.5:1 最小）
- [ ] 毛玻璃/透明元素在浅色模式可见
- [ ] 两种模式边框都可见
- [ ] 交付前测试两种模式

### 布局

- [ ] 浮动元素距边缘有适当间距
- [ ] 无内容隐藏在固定导航栏后
- [ ] 在 375px, 768px, 1024px, 1440px 响应式
- [ ] 移动端无水平滚动

### 可访问性

- [ ] 所有图像都有 alt 文本
- [ ] 表单输入框有标签
- [ ] 颜色不是唯一指示器
- [ ] 尊重 `prefers-reduced-motion`

### 性能

- [ ] 使用 Next.js Image 组件
- [ ] 懒加载非首屏内容
- [ ] 代码分割重组件
- [ ] 字体使用 `display: swap`

---

## 📚 参考资料

### 官方文档

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

### 工具

- **颜色对比度检查器**: https://webaim.org/resources/contrastchecker/
- **无障碍测试**: https://wave.webaim.org/
- **键盘测试**: Tab 键遍历页面
- **屏幕阅读器**: NVDA (Windows), VoiceOver (macOS)

---

**文档版本**: v2.0
**最后更新**: 2026-02-04
**维护者**: Claude (UI/UX Pro Max)

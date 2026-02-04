# 设计系统文档

## 设计原则

**"专业、简洁、高效"** - 为专业用户打造的翻译工具

### 核心价值
- **专业可信**: 清晰的视觉层次，准确的状态反馈
- **简洁高效**: 减少认知负担，快速完成任务
- **愉悦体验**: 细腻的动效，流畅的交互

---

## 色彩系统

### 主色调
```css
--primary-50: #eef2ff;
--primary-100: #e0e7ff;
--primary-500: #6366f1;  /* 主色 - Indigo */
--primary-600: #4f46e5;
--primary-700: #4338ca;

--secondary-500: #8b5cf6;  /* 辅色 - Violet */
--secondary-600: #7c3aed;
```

### 语义色
```css
--success: #10b981;   /* 绿色 - 成功 */
--warning: #f59e0b;   /* 橙色 - 警告 */
--error: #ef4444;     /* 红色 - 错误 */
--info: #3b82f6;      /* 蓝色 - 信息 */
```

### 中性色
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### 渐变
```css
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
--gradient-subtle: linear-gradient(135deg, #f5f7ff 0%, #fdf4ff 100%);
```

---

## 字体系统

### 字体家族
```css
/* Display - 标题 */
--font-display: 'Space Grotesk', sans-serif;

/* Body - 正文 */
--font-body: 'Geist', 'Inter', -apple-system, sans-serif;

/* Mono - 代码 */
--font-mono: 'Geist Mono', 'Fira Code', monospace;
```

### 字体尺度
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### 字重
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 间距系统

```css
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

---

## 圆角系统

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;
```

---

## 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* 特殊阴影 */
--shadow-glow: 0 0 20px rgb(99 102 241 / 0.3);
--shadow-card: 0 2px 8px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.02);
```

---

## 动效系统

### 缓动函数
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 持续时间
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
```

### 常用动画
```css
/* 淡入 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 上浮淡入 */
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 缩放淡入 */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 旋转加载 */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 组件状态

### 按钮
```
Default:   bg-primary-500 text-white
Hover:     bg-primary-600
Active:    bg-primary-700 scale-95
Disabled:  bg-gray-200 text-gray-400 cursor-not-allowed
```

### 输入框
```
Default:   border-gray-300
Focus:     border-primary-500 ring-4 ring-primary-500/10
Error:     border-error ring-4 ring-error/10
Success:   border-success ring-4 ring-success/10
```

### 卡片
```
Default:   bg-white border-gray-200 shadow-card
Hover:     border-primary-300 shadow-md
```

---

## 响应式断点

```css
--breakpoint-sm: 640px;   /* 手机横屏 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 桌面 */
--breakpoint-xl: 1280px;  /* 大屏 */
--breakpoint-2xl: 1536px; /* 超大屏 */
```

---

## Z-index 层级

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## 图标系统

使用 **Lucide React** - 简洁现代的图标库

```bash
npm install lucide-react
```

常用图标：
- 功能图标: File, Upload, Download, Settings, User
- 状态图标: CheckCircle, XCircle, AlertCircle, Info
- 翻译图标: Languages, Globe, Copy
- 导航图标: Home, History, BookOpen, CreditCard

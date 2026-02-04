# TranslateAI - Landing Page

Create a modern, clean landing page for an AI document translation platform.

## Design System

**Style**: Stripe/Vercel inspired - Clean, Modern, Minimal
**Colors**: Use Indigo + Violet gradient theme
  - Primary: #6366F1 (Indigo 500)
  - Secondary: #8B5CF6 (Violet 500)
  - Gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)
  - Background: #F9FAFB (Gray 50)
  - Text: #111827 (Gray 900)

**Typography**:
  - Headings: Space Grotesk
  - Body: Inter
  - Import from Google Fonts

## Layout

### 1. Header (Fixed Top Navigation)
```
[Logo] [Features] [Pricing] [Docs]        [Login] [Start Free]
```
- Sticky/fixed positioning
- Glassmorphism effect (backdrop-blur)
- Logo left, nav center, CTA buttons right

### 2. Hero Section
**Badge**: "🚀 Next-Gen AI Translation Platform"

**H1**: Large, bold text
```
智能翻译 保持格式
专业高效
```

**Subtitle**: Supporting text describing PPT/Word/Excel/PDF support

**CTA Buttons**:
- Primary: "免费开始翻译" (gradient background, large)
- Secondary: "查看演示" (outline)

**Social Proof**: "免费试用 · 无需信用卡 · 秒级处理"

**Visual**: Include a mockup/preview card showing the translation interface

### 3. Features Section
Grid layout (3 columns, 1 on mobile):
- Card 1: 多格式支持 (FileText icon)
- Card 2: AI 智能翻译 (Sparkles icon)
- Card 3: 术语库管理 (BookOpen icon)
- Card 4: 对话翻译 (Globe icon)
- Card 5: 格式保留 (Check icon)
- Card 6: API 集成 (Code icon)

Each card:
- Icon in colored box
- Title
- Description
- Hover effect (border color + shadow)

### 4. Pricing Section
Grid layout (3 columns):
1. Free: ¥0/月
2. Pro: ¥99/月 (badge: "最受欢迎", highlight)
3. Enterprise: 定制价格

Each plan card:
- Price
- Features list with checkmarks
- CTA button

### 5. Footer
4 columns:
- Logo + description
- Product links
- Resources links
- Company links

## Technical Requirements

- Use Next.js 14 + Tailwind CSS
- Use shadcn/ui components (Button, Card, Badge)
- Use Lucide React icons
- Responsive: Mobile-first (375px - 1440px)
- Accessible: Focus states, ARIA labels, 4.5:1 contrast
- Smooth animations (150-300ms, ease-out)

## Key Interactions

- Hover on cards: Border color change + shadow
- Hover on buttons: Scale/color change
- Smooth scroll for anchor links
- Loading states with skeleton screens

## Important
- NO emoji icons (use SVG only)
- NO scale transforms on hover (use color/shadow only)
- All clickable elements need cursor-pointer
- Use Semantic HTML (header, nav, main, footer)

Please implement this landing page with all sections, ensuring professional quality matching Stripe/Vercel design standards.

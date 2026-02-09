# AI 翻译平台 - 项目结构

```
translate-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 认证路由组
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── (dashboard)/             # 主应用路由组
│   │   ├── layout.tsx           # Dashboard 布局（侧边栏）
│   │   ├── page.tsx             # 首页/概览
│   │   ├── translate/           # 翻译功能
│   │   │   ├── page.tsx         # 翻译首页
│   │   │   ├── documents/       # 文档翻译
│   │   │   │   └── [type]/      # ppt/docx/xlsx/pdf
│   │   │   └── chat/            # 对话翻译
│   │   ├── glossary/            # 词库管理
│   │   │   ├── page.tsx         # 词库列表
│   │   │   └── [id]/            # 词库详情
│   │   ├── history/             # 翻译历史
│   │   └── settings/            # 设置
│   │
│   ├── (pricing)/               # 订阅路由组
│   │   ├── page.tsx             # 价格页面
│   │   └── checkout/            # 结账流程
│   │
│   ├── api/                     # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── translate/
│   │   ├── glossary/
│   │   └── subscription/
│   │
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页 (Landing Page)
│   └── globals.css              # 全局样式
│
├── components/                  # React 组件
│   ├── ui/                      # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── auth/                    # 认证组件
│   │   ├── login-button.tsx
│   │   └── user-menu.tsx
│   │
│   ├── translate/               # 翻译组件
│   │   ├── file-uploader.tsx
│   │   ├── language-selector.tsx
│   │   ├── model-selector.tsx
│   │   ├── progress-bar.tsx
│   │   └── result-viewer.tsx
│   │
│   ├── glossary/                # 词库组件
│   │   ├── term-editor.tsx
│   │   ├── glossary-uploader.tsx
│   │   └── term-table.tsx
│   │
│   ├── subscription/            # 订阅组件
│   │   ├── pricing-card.tsx
│   │   ├── feature-list.tsx
│   │   └── usage-indicator.tsx
│   │
│   └── layout/                  # 布局组件
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── footer.tsx
│       └── mobile-nav.tsx
│
├── lib/                         # 工具库
│   ├── auth.ts                  # NextAuth 配置
│   ├── db.ts                    # 数据库
│   ├── api.ts                   # API 客户端
│   └── utils.ts                 # 工具函数
│
├── hooks/                       # 自定义 Hooks
│   ├── use-translate.ts
│   ├── use-glossary.ts
│   └── use-subscription.ts
│
├── stores/                      # 状态管理
│   ├── translate-store.ts
│   └── user-store.ts
│
├── types/                       # TypeScript 类型
│   ├── translate.ts
│   ├── glossary.ts
│   └── subscription.ts
│
├── public/                      # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                      # 额外样式
│   └── theme.css                # 主题变量
│
├── tailwind.config.ts           # Tailwind 配置
├── next.config.js               # Next.js 配置
├── package.json
└── tsconfig.json
```

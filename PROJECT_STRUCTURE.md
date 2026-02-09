# 🏗️ AI Office 翻译平台 v2.0 - 项目结构

**最后更新**: 2026-02-09

---

## 📁 根目录结构

```
ai_server_translate_office/
├── app/                    # 后端应用 (FastAPI + TranslationEngine)
├── web/                    # 前端应用 (Next.js 14)
├── docs/                   # 项目文档
├── tests/                  # 测试文件
├── source_backup/          # 旧版 Gradio 应用备份
├── _bmad/                  # BMAD 工作流配置
├── _bmad-output/           # BMAD 输出文件
├── main.py                 # FastAPI 应用入口
├── requirements.txt        # Python 依赖
├── pyproject.toml          # UV 项目配置
├── uv.lock                 # UV 依赖锁定
├── README.md               # 项目说明
├── CLAUDE.md               # AI 助手指南
├── RESTRUCTURE_NOTES.md    # 重构说明
└── .env                    # 环境变量配置
```

---

## 🐍 后端架构 (app/)

```
app/
├── __init__.py
├── api/                    # FastAPI 路由
│   ├── __init__.py
│   └── tasks.py            # 任务管理 API
│
├── core/                   # 核心引擎 ⭐
│   ├── __init__.py
│   ├── engine.py           # TranslationEngine 主类
│   ├── queue.py            # 优先级任务队列
│   ├── scheduler.py        # 任务调度器
│   └── state_machine.py    # 状态机
│
├── models/                 # 数据模型
│   ├── __init__.py
│   ├── task.py             # TranslationTask, TaskResult
│   └── workflow.py         # 工作流模型
│
├── services/               # 翻译服务 (待实现)
│   └── __init__.py
│
├── utils/                  # 工具函数
│   └── __init__.py
│
├── logs/                   # 运行时日志 (gitignore)
├── uploads/                # 上传文件 (gitignore)
└── output/                 # 输出文件 (gitignore)
```

### 核心组件说明

- **engine.py** (~260行): 翻译工作流引擎，负责任务创建、管理、状态跟踪
- **queue.py** (~200行): 基于堆的优先级队列，FIFO 同级排序
- **scheduler.py** (~250行): 任务调度器，并发控制、Worker 协程池
- **state_machine.py** (~150行): 状态机，严格的状态转换规则

**总计**: ~978 行 Python 代码

---

## ⚛️ 前端架构 (web/)

```
web/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx            # 首页 (Landing Page) ✅
│   ├── globals.css         # 全局样式 ✅
│   │
│   ├── (dashboard)/        # 主功能区
│   │   ├── translate/      # 翻译页面
│   │   │   └── page.tsx    # 待完善
│   │   └── glossary/       # 词库管理
│   │       └── page.tsx    # 待完善
│   │
│   └── (pricing)/          # 订阅页面
│       └── page.tsx        # 订阅方案展示 ✅
│
├── components/             # React 组件
│   └── translate/          # 翻译相关组件 ✅
│       ├── file-uploader.tsx       # 文件拖拽上传 (7KB)
│       ├── language-selector.tsx   # 语言选择器 (5KB)
│       ├── model-selector.tsx      # AI 模型选择 (8KB)
│       └── progress-bar.tsx        # 翻译进度条 (5KB)
│
├── package.json            # NPM 配置 ✅
├── next.config.js          # Next.js 配置 ✅
├── tailwind.config.js      # Tailwind CSS 配置 ✅
├── postcss.config.js       # PostCSS 配置 ✅
├── tsconfig.json           # TypeScript 配置 ✅
│
└── [设计文档]/             # UI/UX 设计规范
    ├── COMPLETE_PAGES_SPEC.md    # 11 个页面完整规范 (95KB)
    ├── UX_GUIDE.md               # UX 设计指南 (22KB)
    ├── DESIGN_SYSTEM.md          # 设计系统 (5KB)
    ├── SHADCN_GUIDE.md           # shadcn/ui 组件指南 (12KB)
    ├── V0_PROMPT.md              # V0 实现 Prompt (17KB)
    ├── V0_STEP_BY_STEP.md        # 分步实现指南 (9KB)
    └── ...
```

### 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **字体**: Space Grotesk (标题) + Geist (正文)
- **主题**: Indigo + Violet 渐变

### 页面状态

| 页面 | 状态 | 说明 |
|------|------|------|
| Landing Page | ✅ 已完成 | 首页 Hero + Features + CTA |
| Pricing Page | ✅ 已完成 | 3 种订阅方案展示 |
| Translate Page | ⚠️ 30% | 核心翻译功能页面 |
| Glossary Page | ⚠️ 30% | 词库管理页面 |
| 其他 7 个页面 | 🔴 0% | 待开发 |

**组件完成度**: 60% (4/7 核心组件已完成)

---

## 📚 文档 (docs/)

```
docs/
└── ARCHITECTURE.md         # translate_agent 架构设计文档
```

---

## 🧪 测试 (tests/)

```
tests/
└── test_engine.py          # 引擎基础测试 (待完善)
```

⚠️ **当前测试覆盖率**: 接近 0%

---

## 🗃️ 旧版备份 (source_backup/)

```
source_backup/
├── app/                    # 旧的 Gradio 应用
│   ├── compent/            # Gradio UI 组件
│   ├── service/            # LLM + Office 服务层
│   │   ├── langchain/      # 4 个 LLM 提供商
│   │   └── office/         # PPT/Word/Excel/PDF 处理
│   ├── util/               # 工具函数 (pptx.py 等)
│   ├── schemas/            # 数据模型
│   ├── prompt/             # 提示词模板
│   ├── logs/               # 历史日志
│   ├── uploads/            # 历史上传文件
│   └── output/             # 历史输出文件
│
├── translate_agent/        # 原始设计文档目录
├── main.py                 # 旧的 Gradio 入口
├── demo.py                 # 演示代码
├── flagged/                # Gradio 标记数据
├── environment.yml         # Conda 环境配置
└── requirements.txt        # 旧依赖列表
```

**⚠️ 重要提醒**:
- 包含完整的翻译逻辑实现
- 包含可用的 Gradio UI
- 可作为参考和回退方案
- **不要删除此目录**

---

## 🚀 快速开始

### 后端 (FastAPI)

```bash
# 安装依赖
uv venv --python 3.10
source .venv/bin/activate
uv pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 添加 API Keys

# 启动服务
python main.py
# 访问: http://localhost:8002
# API 文档: http://localhost:8002/docs
```

### 前端 (Next.js)

```bash
cd web

# 安装依赖
npm install
# 或 pnpm install

# 开发模式
npm run dev
# 访问: http://localhost:3000

# 生产构建
npm run build
npm run start
```

---

## 📊 开发进度

| 模块 | 进度 | 说明 |
|------|------|------|
| **后端核心引擎** | 95% ✅ | engine/queue/scheduler/state_machine |
| **API 接口** | 65% ⚠️ | 基础 CRUD 完成，WebSocket 待实现 |
| **翻译服务** | 0% 🔴 | services/ 为空，需对接旧代码 |
| **数据库** | 0% 🔴 | 任务持久化待实现 |
| **前端核心组件** | 60% ✅ | 4/7 组件完成 |
| **前端页面** | 30% ⚠️ | 2/11 页面完成 |
| **认证系统** | 0% 🔴 | NextAuth 待集成 |
| **测试** | 0% 🔴 | 无测试覆盖 |

**整体进度**: 35-40%

---

## 🎯 下一步计划

### Phase 1: 核心功能 (1-2周)
- [ ] 从 source_backup/ 迁移翻译服务层
- [ ] 修复旧版 Bug (PDF 切片、Word 格式)
- [ ] 实现数据库持久化 (SQLite)
- [ ] 完善 API 接口

### Phase 2: 前端开发 (2-3周)
- [ ] 完善翻译页面 (批量上传、进度显示)
- [ ] 完善词库管理页面
- [ ] 实现其他 9 个页面
- [ ] API 集成和联调

### Phase 3: SaaS 功能 (3-4周)
- [ ] NextAuth 用户认证
- [ ] Stripe 订阅支付
- [ ] 配额管理系统
- [ ] 翻译历史记录

### Phase 4: 测试与优化 (1-2周)
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 安全加固

### Phase 5: 部署上线 (1周)
- [ ] Docker 部署
- [ ] CI/CD 配置
- [ ] 监控告警
- [ ] 生产环境配置

---

## 🔑 关键技术决策

1. **架构**: FastAPI (后端) + Next.js 14 (前端) - 现代化、高性能
2. **任务队列**: 内置异步队列 + SQLite - 简单可靠，可扩展到 Redis/PostgreSQL
3. **前端框架**: Next.js 14 App Router - SSR + 静态生成，SEO 友好
4. **组件库**: shadcn/ui - 现代、可定制、无供应商锁定
5. **样式**: Tailwind CSS - 快速开发、一致性好
6. **认证**: NextAuth.js - 成熟、多提供商、易集成
7. **支付**: Stripe - 全球通用、文档完善

---

## 📝 开发规范

- **Python**: 3.10.x (⚠️ 不支持 3.13)
- **代码风格**: Black + Ruff
- **提交规范**: Conventional Commits
- **分支策略**: feature/* → develop → main
- **环境管理**: UV (Python) + PNPM (Node.js)

---

**作者**: RongYe.Liu
**维护者**: Aring
**最后更新**: 2026-02-09

# CLAUDE.md

AI Office 文档翻译服务，支持 PPT/Word/Excel/PDF 智能翻译并保留格式。

**版本**: v3.0.0 | **架构**: Next.js 全栈 | **数据库**: PostgreSQL

---

## 快速启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build && npm start
```

**访问地址**:
- 应用: http://localhost:3000
- API 文档: http://localhost:3000/api (TODO)

---

## 核心架构

```
用户浏览器
  ↓
Next.js 14 (App Router)
  ├── app/              前端页面
  │   ├── (dashboard)/  主应用
  │   └── (pricing)/    定价页
  ├── app/api/          后端 API Routes
  │   ├── translate/    翻译接口
  │   └── history/      历史记录
  ├── components/       UI 组件
  └── lib/              工具库
  ↓
PostgreSQL (translation_tasks)
```

**Python 后端（已归档）**: `source_back/` 目录保留完整 FastAPI 实现作为参考

---

## 关键路径

| 功能 | 前端页面 | API Routes | 状态 |
|------|---------|-----------|------|
| 翻译 | `/translate` | `POST /api/translate` | 🚧 骨架 |
| 状态 | `/translate` | `GET /api/translate/[id]` | 🚧 骨架 |
| 历史 | `/history` | `GET /api/history` | 🚧 骨架 |
| 词库 | `/glossary` | - | ⏳ 未实现 |

---

## 重要事项

### 🎯 当前状态 (v3.0.0)

**已完成**:
- ✅ 目录重构（Python 移至 source_back）
- ✅ Next.js 页面和组件（翻译、历史、词库骨架）
- ✅ API Routes 骨架（translate, history）
- ✅ UI 组件库（shadcn/ui）

**待实现**:
- ⏳ API Routes 业务逻辑（调用 LLM）
- ⏳ 数据库集成（Prisma ORM）
- ⏳ 文件上传和处理
- ⏳ 认证系统（NextAuth.js）
- ⏳ 术语库功能

### 📋 优先级

- P0: 实现翻译 API 核心逻辑
- P1: 数据库集成 + 认证
- P2: 术语库 + 前后对比

---

## 配置要求

**.env 必需**:
```bash
DATABASE_URL=postgresql://blue_focus@localhost:5432/ai_translate
OPENAI_API_KEY=sk-xxx  # 至少配置一个
NEXTAUTH_SECRET=xxx     # 生成: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

**Node.js**: 18.x+ | **包管理器**: npm

---

## 详细文档

@/Users/blue_focus/Desktop/work/program/ai_translate_office/ai_server_translate_office/cc_code/docs/PROJECT_FILES_EXPLAINED.md

@/Users/blue_focus/Desktop/work/program/ai_translate_office/ai_server_translate_office/cc_code/docs/web/

---

## 对话历史记录

### v3.0.0 - 2026-02-12
- 主题: 重构为 Next.js 全栈架构
- 记录: `.chat_history/nextjs_restructure/master_restructure.md`
- 摘要: Python 移至 source_back，创建 Next.js API Routes 骨架

### v2.0.0 - 2026-02-12
- 主题: 目录整理 + 项目结构说明
- 记录: `.chat_history/directory_cleanup/master_structure_explanation.md`
- 摘要: 按 aring-rule 整理目录，创建完整项目文档

### v2.0.0 - 2026-02-09
- 主题: 项目架构重构 + PRD 工作流
- 记录: `.chat_history/project_restructure_and_prd/master_restructure_and_prd_workflow.md`
- 摘要: 目录重构，Next.js 配置，PRD 用户画像

---

**作者**: RongYe.Liu | **网站**: https://rongyeliu.com | **更新**: 2026-02-12

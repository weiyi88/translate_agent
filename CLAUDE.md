# CLAUDE.md

AI Office 文档翻译服务，支持 PPT/Word/Excel/PDF 智能翻译并保留格式。

**版本**: v2.0.0 | **架构**: FastAPI + Next.js | **数据库**: PostgreSQL

---

## 快速启动

```bash
# 后端
source .venv/bin/activate && python main.py

# 前端
cd web && npm run dev

# 状态检查
./check_status.sh
```

**访问地址**:
- 前端: http://localhost:3001/translate
- 后端 API: http://localhost:8002/docs

---

## 核心架构

```
用户浏览器 (Next.js)
  ↓ HTTP
FastAPI (app/)
  ├── api/          路由层
  ├── core/         业务层 (engine, scheduler)
  ├── services/     服务层 (llm, office)
  └── models/       数据层
  ↓
PostgreSQL (translation_tasks)
```

---

## 关键路径

| 功能 | 前端 | 后端 API | 后端服务 |
|------|------|---------|---------|
| 翻译 | `/translate` | `POST /api/translate/upload` | `engine.py` |
| 状态 | `/translate` | `GET /api/translate/status/{id}` | `tasks.py` |
| 历史 | `/history` | `GET /api/translate/history` | `tasks.py` |

---

## 重要事项

### ⚠️ 严重 Bug (P0)

1. **PDF 切片**: `app/service/office/pdf_service.py:27` - 语法错误 `i+i+` 应为 `i:i+`
2. **Word 格式丢失**: `docx_service.py:98` - `restore_text_to_docx()` 被注释
3. **无认证机制**: 任何人可访问，需添加 auth

### 🎯 优先级

- P0: 修复 Bug + 添加认证
- P1: Excel 批量翻译 + PPT 并行
- P2: 术语库 + 前后对比

---

## 配置要求

**.env 必需**:
```bash
DATABASE_URL=postgresql+asyncpg://blue_focus@localhost:5432/ai_translate
OPENAI_API_KEY=sk-xxx  # 至少配置一个
```

**Python**: 3.10.x (不支持 3.13)

---

## 详细文档

@/Users/blue_focus/Desktop/work/program/ai_translate_office/ai_server_translate_office/cc_code/docs/PROJECT_FILES_EXPLAINED.md

@/Users/blue_focus/Desktop/work/program/ai_translate_office/ai_server_translate_office/README.md

---

## 对话历史记录

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

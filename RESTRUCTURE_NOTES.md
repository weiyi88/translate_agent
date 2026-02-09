# 🔄 项目重构说明

**日期**: 2026-02-08
**操作人**: Aring + Claude PM Agent

---

## 📦 重构内容

### 1. 目录结构变更

```
重构前:
├── app/              (Gradio 应用)
├── main.py           (Gradio 入口)
├── demo.py
├── flagged/
├── translate_agent/  (新设计)
└── requirements.txt

重构后:
├── app/              (translate_agent 核心引擎) ⭐ 新
├── web/              (Next.js 前端) ⭐ 新
├── docs/             (架构文档) ⭐ 新
├── tests/            (测试目录) ⭐ 新
├── main.py           (FastAPI 入口) ⭐ 新
├── requirements_agent.txt  (新依赖) ⭐ 新
├── source_backup/    (旧版备份) 🗃️
│   ├── app/          (旧 Gradio 应用)
│   ├── main.py       (旧入口)
│   ├── demo.py
│   ├── flagged/
│   └── ...
└── translate_agent/  (保留设计文档)
```

---

## 🗃️ 备份内容 (source_backup/)

以下文件已移动到 `source_backup/` 目录：

| 文件/目录 | 说明 | 备份原因 |
|----------|------|---------|
| `app/` | 旧的 Gradio 应用 | 包含完整的翻译逻辑，需要迁移 |
| `main.py` | 旧的 Gradio 入口 | 启动 Gradio UI |
| `demo.py` | 演示文件 | 测试代码 |
| `flagged/` | Gradio 标记数据 | 用户反馈数据 |
| `requirements.txt` | 旧依赖列表 | Gradio + LangChain |
| `CLAUDE.md` | 旧版 AI 指南 | 包含详细的旧版说明 |
| `README.md` | 旧版 README | 简单的项目介绍 |

---

## ⭐ 新增内容

### 1. 核心引擎 (app/)

从 `translate_agent/app/` 复制而来：

- `app/core/engine.py` - 翻译工作流引擎 (258行)
- `app/core/queue.py` - 任务队列 (~200行)
- `app/core/scheduler.py` - 任务调度器 (~250行)
- `app/core/state_machine.py` - 状态机 (~150行)
- `app/models/` - 数据模型
- `app/api/` - FastAPI 接口
- `app/services/` - 翻译服务 (待实现)

**总计**: ~978 行 Python 代码

### 2. 前端 (web/)

从 `translate_agent/web/` 复制而来：

- `web/app/page.tsx` - 首页 (20KB)
- `web/app/(pricing)/page.tsx` - 订阅页 (11KB)
- `web/app/globals.css` - 全局样式 (6KB)
- `web/components/translate/` - 翻译组件 (4个组件)
  - `file-uploader.tsx` (7KB)
  - `language-selector.tsx` (5KB)
  - `model-selector.tsx` (8KB)
  - `progress-bar.tsx` (5KB)

### 3. 文档 (docs/)

- `docs/ARCHITECTURE.md` - 架构设计文档

### 4. 新入口 (main.py)

从 `translate_agent/main.py` 复制：

- FastAPI 应用
- 端口: 8002
- API 文档: /docs

### 5. 新依赖 (requirements_agent.txt)

```
fastapi
uvicorn
pydantic
sqlalchemy
...
```

---

## 🔗 保留内容

### translate_agent/ (设计文档目录)

保留完整的设计文档，供开发参考：

- `translate_agent/README.md` - 模块说明
- `translate_agent/PROJECT_SUMMARY.md` - 项目总结
- `translate_agent/DESIGN_DELIVERY.md` - 设计交付
- `translate_agent/web/` - 前端设计文档
  - `COMPLETE_PAGES_SPEC.md` (95KB) - 11 个页面规范 ⭐
  - `UX_GUIDE.md` (22KB) - UX 设计指南
  - `V0_PROMPT.md` (17KB) - V0 实现 Prompt
  - `SHADCN_GUIDE.md` (12KB) - 组件使用指南
  - `V0_STEP_BY_STEP.md` (9KB) - 分步实现指南
  - 其他设计文档...

---

## 📋 迁移待办事项

### 需要从 source_backup/ 迁移的内容

1. **翻译服务实现** (优先级: 🔴 高)
   - `source_backup/app/service/office/pptx_service.py`
   - `source_backup/app/service/office/docx_service.py`
   - `source_backup/app/service/office/xlsx_service.py`
   - `source_backup/app/service/office/pdf_service.py`

   → 目标位置: `app/services/`

2. **LLM 集成层** (优先级: 🔴 高)
   - `source_backup/app/service/langchain/` (4个提供商)
   - `source_backup/app/schemas/llm_interface.py`

   → 目标位置: `app/services/llm/`

3. **工具函数** (优先级: ⚠️ 中)
   - `source_backup/app/util/pptx.py` - PPT 格式处理
   - `source_backup/app/util/config.py` - 配置管理

   → 目标位置: `app/utils/`

4. **Prompt 模板** (优先级: ⚠️ 中)
   - `source_backup/app/prompt/*.txt`

   → 目标位置: `app/prompts/`

5. **测试日志** (优先级: 低)
   - `source_backup/app/logs/` - 历史日志

   → 分析后可删除

---

## 🐛 需要修复的 Bug

在迁移旧代码时，必须修复以下已知问题：

1. **PDF 切片 Bug** (source_backup/app/service/office/pdf_service.py:27)
   ```python
   # ❌ 错误
   segments = [text[i+i+Settings.CHUNK_LENGTH] ...]

   # ✅ 正确
   segments = [text[i:i+Settings.CHUNK_LENGTH] ...]
   ```

2. **Word 格式丢失** (source_backup/app/service/office/docx_service.py:98)
   ```python
   # 取消注释这一行
   new_doc = await restore_text_to_docx(text_properties, process_text)

   # 删除这些行
   # new_doc = Document()
   # new_doc.add_paragraph(process_text.content)
   ```

3. **Excel 性能问题** (source_backup/app/service/office/xlsx_service.py)
   - 改为批量翻译 (50-100 单元格/批)

---

## 📊 当前状态

### 完成度

- ✅ 目录重构: 100%
- ✅ 备份旧代码: 100%
- ✅ 新架构搭建: 100%
- ✅ 核心引擎: 95%
- ✅ 前端组件: 60%
- 🔴 翻译服务: 0% (待迁移)
- 🔴 数据库层: 0% (待实现)
- 🔴 前端页面: 30% (2/11 页)

**整体进度**: 35-40%

---

## 🎯 下一步行动

### 选项 A: 快速修复旧版 (1-2天)
1. 在 source_backup/ 中修复 3 个 Bug
2. 保持旧版可用
3. 为用户提供临时方案

### 选项 B: 迁移翻译服务 (1周)
1. 迁移 PPT/Word/Excel/PDF 翻译逻辑
2. 集成到新的 app/services/
3. 对接 TranslationEngine

### 选项 C: 完善前端 (2周)
1. 实现翻译页面
2. 实现词库管理页面
3. 前后端 API 对接

### 选项 D: 创建完整 PRD (1-2天)
1. 整合所有需求
2. 定义优先级和里程碑
3. 制定详细开发计划

---

## 📝 重要提醒

1. **不要删除 source_backup/**
   - 包含完整的翻译逻辑
   - 包含可用的 Gradio UI
   - 可作为参考和回退方案

2. **不要删除 translate_agent/**
   - 包含完整的设计文档
   - 前端 UI/UX 规范
   - V0 实现指南

3. **Git 提交建议**
   ```bash
   git add source_backup/ app/ web/ docs/ tests/
   git commit -m "refactor: 重构项目结构，迁移到 translate_agent 架构

   - 备份旧版 Gradio 应用到 source_backup/
   - 提升 translate_agent 核心引擎到主目录
   - 添加 Next.js 前端框架
   - 更新 README 和文档

   当前进度: 35-40%
   待办: 翻译服务迁移、数据库集成、前端完善"
   ```

---

**操作人**: Aring
**协助**: Claude PM Agent (John)
**日期**: 2026-02-08
**用时**: ~30 分钟

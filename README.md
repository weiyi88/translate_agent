# 🔄 AI Office 翻译平台 v2.0

> 基于工作流引擎的智能文档翻译服务

---

## 📁 项目结构 (2026-02-08 重构)

```
ai_server_translate_office/
├── app/                      # 核心应用 (translate_agent 引擎)
│   ├── core/                 # 核心引擎
│   │   ├── engine.py         # 翻译工作流引擎 ⭐
│   │   ├── queue.py          # 任务队列
│   │   ├── scheduler.py      # 任务调度器
│   │   └── state_machine.py  # 状态机
│   ├── models/               # 数据模型
│   ├── api/                  # FastAPI 接口
│   ├── services/             # 翻译服务 (待实现)
│   └── utils/                # 工具函数
│
├── web/                      # 前端 (Next.js 14)
│   ├── app/                  # 页面
│   │   ├── page.tsx          # 首页 ✅
│   │   ├── (dashboard)/      # 主功能区
│   │   │   ├── translate/    # 翻译页面 (待实现)
│   │   │   └── glossary/     # 词库管理 (待实现)
│   │   └── (pricing)/        # 订阅页面 ✅
│   └── components/           # 组件
│       └── translate/        # 翻译相关组件 ✅
│
├── docs/                     # 文档
│   └── ARCHITECTURE.md       # 架构文档
│
├── tests/                    # 测试 (待实现)
│
├── source_backup/            # 旧版本备份 🗃️
│   ├── app/                  # 旧的 Gradio 应用
│   ├── main.py               # 旧的入口文件
│   └── ...
│
├── translate_agent/          # 原始设计文档
│   ├── README.md
│   ├── PROJECT_SUMMARY.md
│   └── web/                  # 前端设计文档
│       ├── COMPLETE_PAGES_SPEC.md  # 11 个页面规范 ⭐
│       ├── UX_GUIDE.md
│       ├── V0_PROMPT.md
│       └── ...
│
├── main.py                   # 应用入口 (FastAPI)
├── requirements.txt          # 旧依赖 (Gradio)
├── requirements_agent.txt    # 新依赖 (FastAPI)
├── pyproject.toml            # UV 项目配置
└── CLAUDE.md                 # AI 助手指南

```

---

## 🎯 项目定位

**v2.0 重构目标**: 从单体 Gradio 应用升级为基于工作流引擎的现代化翻译平台

### 新架构特性

- ✅ **任务编排**: 多文件批量翻译、优先级队列、依赖管理
- ✅ **并发控制**: 限制并发数、防止 OOM
- ✅ **进度跟踪**: 实时进度、队列位置、预估时间
- ✅ **错误处理**: 自动重试、错误分类、手动重试
- ✅ **现代 UI**: Next.js 14 + Tailwind + shadcn/ui

---

## 🚀 快速开始

### 环境要求

```bash
# Python 3.10.x
uv venv --python 3.10
source .venv/bin/activate
uv pip install -r requirements_agent.txt
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 添加 LLM API Keys
```

### 启动后端

```bash
python main.py
# API: http://localhost:8002
# Docs: http://localhost:8002/docs
```

### 启动前端 (待实现)

```bash
cd web
npm install
npm run dev
# UI: http://localhost:3000
```

---

## 📊 开发进度

| 模块 | 进度 | 说明 |
|------|------|------|
| **后端核心** | 95% | engine/queue/scheduler/state_machine 完成 ✅ |
| **API 接口** | 65% | 基础 CRUD 完成，WebSocket 待实现 |
| **翻译服务** | 0% | services/ 为空，需对接旧代码 🔴 |
| **数据库** | 0% | 任务持久化待实现 🔴 |
| **前端核心组件** | 60% | file-uploader/language-selector/model-selector 完成 ✅ |
| **前端页面** | 30% | 首页/订阅页完成，翻译/词库页待实现 |
| **认证系统** | 0% | NextAuth 待集成 🔴 |
| **测试** | 0% | 无测试覆盖 🔴 |

**整体进度**: 35-40%

---

## 🗂️ 旧版本说明 (source_backup/)

旧版本是基于 Gradio + LangChain 的单体应用，功能如下：

- ✅ PPT 翻译 (8/10 - 最成熟)
- ⚠️ Excel 翻译 (6/10 - 性能问题)
- ⚠️ Word 翻译 (4/10 - 格式丢失)
- 🔴 PDF 翻译 (3/10 - 切片 Bug)
- ✅ 在线文本翻译

**已知问题**:
1. PDF 切片语法错误: `text[i+i+length]` → `text[i:i+length]`
2. Word 格式丢失: `restore_text_to_docx()` 被注释
3. 无认证机制
4. Excel 逐单元格翻译，成本高

---

## 📋 下一步计划

### Phase 1: 修复旧版 Bug (快速修复)
- [ ] 修复 PDF 切片 Bug
- [ ] 修复 Word 格式丢失
- [ ] 添加基础认证

### Phase 2: 实现翻译服务 (核心功能)
- [ ] 实现 app/services/ 翻译服务
- [ ] 对接旧的 pptx/docx/xlsx/pdf 处理逻辑
- [ ] 实现数据库持久化

### Phase 3: 完善前端 (用户体验)
- [ ] 实现翻译页面
- [ ] 实现词库管理页面
- [ ] 前后端 API 对接

### Phase 4: 增强功能 (高级特性)
- [ ] WebSocket 实时进度
- [ ] NextAuth 认证
- [ ] 术语库功能
- [ ] 翻译质量评估

### Phase 5: 生产部署
- [ ] 添加测试覆盖
- [ ] Docker 部署
- [ ] CI/CD 流水线
- [ ] 监控告警

---

## 📚 参考文档

- **架构设计**: `docs/ARCHITECTURE.md`
- **项目总结**: `translate_agent/PROJECT_SUMMARY.md`
- **前端设计**: `translate_agent/web/COMPLETE_PAGES_SPEC.md`
- **V0 实现**: `translate_agent/web/V0_PROMPT.md`
- **AI 助手**: `CLAUDE.md`

---

## 🔗 相关链接

- **Git 分支**: `feature/translate_agent`
- **旧版文档**: `source_backup/CLAUDE.md`
- **V0 项目**: https://v0.app/chat/oizg0goSDcy

---

**作者**: RongYe.Liu
**重构日期**: 2026-02-08
**版本**: v2.0 (工作流引擎架构)

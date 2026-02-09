# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目定位

基于 Gradio + LangChain 的 AI Office 文档翻译服务，支持 PPT/Word/Excel/PDF 智能翻译并保留格式。

**当前版本**: v1.0.0 (开发阶段) | **总体评分**: 6.5/10

---

## 快速启动

### 环境要求
```bash
# Python 3.10.x（❌ 不支持 3.13）
uv venv --python 3.10
source .venv/bin/activate
uv pip install -r requirements.txt
```

### 配置 .env 文件
```bash
# 至少配置一个 LLM 提供商
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
MOONSHOT_API_KEY=sk-xxx
SILICONFLOW_API_KEY=sk-xxx

# Gradio
GRADIO_SERVER_NAME=0.0.0.0
GRADIO_SERVER_PORT=8001
```

### 启动和访问
```bash
python main.py
# 访问 http://localhost:8001
```

### 必需的 Prompt 文件
确保 `app/prompt/` 存在：
- `translate_pptx_json.txt`, `translate_docx_json.txt`, `translate_xlsx_json.txt`
- `translate_pdf_json.txt`, `struct_json.txt`

---

## 架构核心

### 三层架构
```
Gradio UI (app/compent/)
    ↓
Service Layer (app/service/)
    ├── langchain/    LLM 抽象层
    └── office/       文档处理层
    ↓
Utils + Schemas
```

### LLM 工厂模式
```python
# app/service/langchain/index.py
def LLM_obj(llm_name: str, output: str = 'json') -> LLMInterface:
    # 根据 llm_name 返回对应实现
    # 付费模型: Settings.PAYMENT_MODEL
    # 其他: SiliconflowLLMLangchainClass
```

### 文件翻译路由
```python
# app/compent/file_service.py:generate_file()
match file_type:
    case "pptx": launch_translation_pptx()
    case "docx": launch_translation_docx()
    case "xlsx": launch_translate_xlsx()
    case "pdf":  launch_translate_pdf()
```

---

## 模块状态和评分

| 模块 | 评分 | 文件位置 | 核心问题 |
|------|------|---------|---------|
| **PPT** | 8/10 | `pptx_service.py` + `pptx.py` | 串行翻译慢 |
| **Excel** | 6/10 | `xlsx_service.py` | 逐单元格调用，API 成本高 |
| **在线翻译** | 7/10 | `chat_service.py` | 无历史记录 |
| **Word** | 4/10 | `docx_service.py` | 🔴 格式丢失（函数被注释） |
| **PDF** | 3/10 | `pdf_service.py` | 🔴 切片 Bug + 输出 TXT |

### PPT 翻译流程（参考标准）
```
异步生成器逐页提取 → 保存格式信息 → LLM 批量翻译 → 还原格式 → 保存
```
支持的元素: 文本框、表格、图表标题、组合形状、自动形状

---

## 🚨 严重 Bug (P0 - 需立即修复)

### 1. PDF 切片语法错误
**文件**: `app/service/office/pdf_service.py:27`
```python
# ❌ 错误
segments = [text[i+i+Settings.CHUNK_LENGTH] ...]

# ✅ 正确
segments = [text[i:i+Settings.CHUNK_LENGTH] ...]
```

### 2. Word 格式丢失
**文件**: `app/service/office/docx_service.py:98`
```python
# 问题: restore_text_to_docx() 被注释
# 结果: 输出纯文本，丢失所有样式
# 修复: 取消注释，按 Run 翻译避免字符对齐问题
```

### 3. 无认证机制
**影响**: 任何人可访问服务，高安全风险
**修复**: 添加 Gradio auth 或自定义认证

---

## 📋 优化路线图

### Phase 1: 安全加固 (1周)
- [ ] 添加用户登录认证
- [ ] 隐藏 API Key
- [ ] 文件上传校验（类型、大小、MIME）
- [ ] 速率限制

### Phase 2: Bug 修复 (1周)
- [ ] 修复 PDF 切片 Bug
- [ ] 启用 Word 格式保留
- [ ] 修复异步 gather 使用
- [ ] 清理未使用 import

### Phase 3: 性能优化 (2周)
- [ ] Excel 批量翻译（50-100 单元格/批）
- [ ] PPT 并行翻译（Semaphore 限制并发）
- [ ] 翻译缓存（Redis/内存）
- [ ] 任务队列

### Phase 4: 功能增强 (1月)
- [ ] 术语库/记忆库
- [ ] PDF 保留排版输出
- [ ] 翻译质量评估
- [ ] 前后对比预览
- [ ] 智能内容识别（跳过 URL/邮箱/代码）

### Phase 5: 生产化 (1月)
- [ ] 数据库集成（用户、任务、配额）
- [ ] 用户配额管理
- [ ] 监控告警
- [ ] Docker 部署
- [ ] CI/CD 流水线

---

## 开发指南

### 添加新的 LLM 提供商
1. `app/service/langchain/` 创建服务文件
2. 继承 `LLMInterface`，实现 4 个方法：
   - `__init__(model, output)`
   - `translates_chain(prompt)`
   - `chain_ainvoke(content, struct, language)`
   - `chain_astream(content, struct, language)`
3. 在 `LLM_obj()` 工厂函数注册
4. `app/compent/radio_compent.py` 添加 UI
5. `app/util/config.py` 添加配置

### 添加新文件格式
1. `app/service/office/` 创建 `new_format_service.py`
2. 实现 `launch_translate_xxx()` 异步函数
3. `file_service.py:generate_file()` 添加 case
4. `config.py:FILE_TYPE_LIST` 添加扩展名
5. 创建 prompt 文件并添加到 `NEED_FILE_LIST`

### 添加新语言
编辑 `app/compent/radio_compent.py`:
```python
choices=["English", "Chinese", "Japanese", "Korean",
         "Arabic", "Greek", "French"]  # 添加语言
```

---

## 已知性能问题 (P1-P2)

### 高优先级 (P1)
- **无并发限制**: 多人使用可能 OOM
- **文件无清理**: uploads/output 目录无限增长
- **异常全捕获**: 用户看不到具体错误

### 中优先级 (P2)
- **Excel 逐单元格调用**: `xlsx_service.py` - API 成本高
- **未使用 import**: 多处代码冗余
- **变量拼写错误**: `llm_ragio` → `llm_radio`
- **Gradio 配置未生效**: `config.py` 定义但未传给 launch()

---

## 日志和调试

### 日志位置
```
app/logs/YYYY-MM-DD-translation.log
```

### 日志级别
- `INFO`: 正常操作
- `WARNING`: 格式应用失败等可恢复问题
- `ERROR`: 翻译失败、文件处理错误

### 启动检查
`main.py:14-16` 会检查所有必需的 prompt 文件是否存在

---

## 关键依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| gradio | 4.40.0 | Web UI |
| langchain | 0.2.11 | LLM 编排 |
| python-pptx | 0.6.23 | PPT 处理 |
| python-docx | 1.1.2 | Word 处理 |
| openpyxl | 3.1.5 | Excel 处理 |
| pdfplumber | 0.11.3 | PDF 文本提取 |

---

## 代码风格约定

1. **异步优先**: 所有 I/O 使用 `async/await`
2. **接口抽象**: LLM 服务必须实现 `LLMInterface`
3. **配置集中**: 所有配置在 `Settings` 类
4. **错误处理**: 明确异常类型，不用裸 `except:`
5. **类型提示**: 新代码添加类型注解

---

## 文件结构速查

```
app/
├── compent/           # Gradio UI
│   ├── index.py       # 主界面
│   ├── file_service.py # 文件翻译路由
│   └── chat_service.py # 在线翻译
├── service/
│   ├── langchain/     # LLM 服务 (4个提供商)
│   └── office/        # 文档处理 (4种格式)
├── schemas/
│   └── llm_interface.py # LLM 抽象接口
├── util/
│   ├── config.py      # 配置管理
│   └── pptx.py        # PPT 工具
├── uploads/           # 上传目录
├── output/            # 输出目录
├── logs/              # 日志目录
└── prompt/            # 提示词模板
```

---

## 当前优先级建议

基于 `PROJECT_README.md` 的评估，建议优先处理：

1. **立即修复**: PDF Bug、Word 格式丢失
2. **安全加固**: 添加认证机制
3. **性能优化**: Excel 批量翻译、PPT 并行
4. **功能完善**: 术语库、前后对比

---

## 对话历史记录

### v2.0.0 - 2026-02-09
- **主题**: 项目架构重构 + PRD 工作流启动
- **记录**: `.chat_history/project_restructure_and_prd/master_restructure_and_prd_workflow.md`
- **摘要**: 完成项目目录彻底重构，清理冗余文件，创建 Next.js 配置，启动 PRD 创建工作流并完成用户画像深度挖掘

---

## 作者信息

- **作者**: RongYe.Liu
- **网站**: https://rongyeliu.com
- **最后更新**: 2026-02-09

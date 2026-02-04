# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

这是一个基于 Gradio + LangChain 的 AI Office 文档翻译服务，支持 PPT、Word、Excel、PDF 的智能翻译，保留原始格式输出。

**核心特性**: 多 LLM 支持 (OpenAI/Claude/Moonshot/Siliconflow) | 格式保留 | 进度显示 | 在线文本翻译

---

## 运行和开发命令

### 环境准备
```bash
# 注意：Python 版本必须是 3.10.x，不支持 3.13（httptools 编译会失败）
uv venv --python 3.10
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

### 启动服务
```bash
python main.py
# 或
uv run main.py
```

### 访问地址
- 本地: http://localhost:8001
- 局域网: http://<your-ip>:8001

### 环境变量配置
必须创建 `.env` 文件并配置以下内容：
```bash
# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1

# 至少配置一个 LLM 提供商的 API Key
ANTHROPIC_API_KEY=sk-ant-xxx  # Claude
MOONSHOT_API_KEY=sk-xxx       # Moonshot
SILICONFLOW_API_KEY=sk-xxx    # Siliconflow

# Gradio
GRADIO_SERVER_NAME=0.0.0.0
GRADIO_SERVER_PORT=8001
```

### 必需的 Prompt 文件
确保 `app/prompt/` 目录下存在以下文件：
- `translate_pptx_json.txt` - PPT 翻译提示词
- `translate_docx_json.txt` - Word 翻译提示词
- `translate_xlsx_json.txt` - Excel 翻译提示词
- `translate_pdf_json.txt` - PDF 翻译提示词
- `struct_json.txt` - JSON 输出结构模板

---

## 架构概览

### 分层架构

```
┌─────────────────────────────────────────────┐
│         Gradio Web UI (app/compent/)        │
├─────────────────────────────────────────────┤
│   Service Layer (app/service/)              │
│   ├── langchain/   LLM 抽象层                │
│   └── office/      文档处理层                │
├─────────────────────────────────────────────┤
│   Schemas (app/schemas/)                     │
│   ├── llm_interface.py    LLM 接口定义       │
│   └── file_Exception.py   自定义异常         │
├─────────────────────────────────────────────┤
│   Utils (app/util/)                         │
│   ├── config.py            配置管理          │
│   └── pptx.py              PPT 工具函数      │
└─────────────────────────────────────────────┘
```

### 核心设计模式

**1. LLM 工厂模式 + 接口抽象**
- `LLMInterface` (app/schemas/llm_interface.py) 定义统一接口
- `LLM_obj()` (app/service/langchain/index.py) 工厂函数根据模型名称返回对应实现
- 支持的提供商: OpenAI, Anthropic, Moonshot, Siliconflow
- 付费模型列表: `Settings.PAYMENT_MODEL`

**2. 异步生成器处理大文件**
- PPT 翻译使用异步生成器 `extract_text_from_presentation()` 逐页提取文本
- 避免一次性加载所有内容到内存

**3. 格式保留机制**
- PPT: `get_font_info()` 提取字体格式 → 翻译 → `apply_font_info_safely()` 还原
- 支持字体、颜色、粗体、斜体、对齐方式、行距等属性

---

## 关键模块说明

### 文件翻译入口
**位置**: `app/compent/file_service.py`

核心函数 `generate_file()`:
- 根据 `file_type` (pptx/docx/pdf/xlsx) 分发到不同的翻译服务
- 生成唯一输出文件名: `YYYYMMDD_HHMMSS_to_{language}:{filename}`
- 所有翻译服务必须返回文件路径用于下载

### LLM 集成
**位置**: `app/service/langchain/`

每个提供商实现 `LLMInterface` 接口的四个方法：
- `__init__(model, output)` - 初始化
- `translates_chain(prompt)` - 创建翻译链
- `chain_ainvoke(content, struct, language)` - 异步调用翻译
- `chain_astream(content, struct, language)` - 异步流式翻译

### 文档处理服务

| 文件 | 功能 | 格式保留 | 状态 |
|------|------|---------|------|
| `pptx_service.py` | PPT 翻译 | ✅ 完善 | ⭐⭐⭐⭐ |
| `xlsx_service.py` | Excel 翻译 | ✅ 值保留 | ⭐⭐⭐ |
| `docx_service.py` | Word 翻译 | ⚠️ 未启用 | ⭐⭐ |
| `pdf_service.py` | PDF 翻译 | ❌ 输出 TXT | ⭐⭐ |

### PPT 翻译流程 (最完善的模块)
```
上传 → 异步生成器逐页提取文本 → 保存格式信息 → LLM 批量翻译
     → 还原格式到新 PPT → 保存到 output/
```

支持的 PPT 元素:
- ✅ 普通文本框、表格、图表标题、组合形状、自动形状
- ❌ 图表数据标签、SmartArt

---

## 已知问题和注意事项

### 严重 Bug (需立即修复)
1. **PDF 切片错误** (`app/service/office/pdf_service.py:27`)
   ```python
   # 错误: text[i+i+...]
   # 正确: text[i:i+...]
   ```

2. **Word 格式丢失** (`app/service/office/docx_service.py:98`)
   - 虽然 `extract_text_with_properties()` 和 `restore_text_to_docx()` 已实现
   - 但 `restore_text_to_docx()` 被注释，最终输出纯文本

3. **无认证机制** - 任何人都可以访问服务，高安全风险

### 性能问题
- Excel 逐单元格调用 LLM，API 成本高
- PPT 串行翻译，无并发控制
- 无翻译缓存机制

### 代码质量
- 存在未使用的 import
- 变量名拼写错误: `llm_ragio` → `llm_radio`
- 异常捕获过于宽泛，用户看不到具体错误

---

## 开发指南

### 添加新的 LLM 提供商
1. 在 `app/service/langchain/` 创建新服务文件
2. 继承 `LLMInterface` 接口，实现四个方法
3. 在 `app/service/langchain/index.py` 的 `LLM_obj()` 函数中注册
4. 在 `app/compent/radio_compent.py` 添加 UI 选项
5. 在 `app/util/config.py` 添加配置项

### 添加新的文件格式
1. 在 `app/service/office/` 创建 `new_format_service.py`
2. 实现 `launch_translate_xxx()` 异步函数
3. 在 `app/compent/file_service.py` 的 `generate_file()` 添加 case 分支
4. 在 `app/util/config.py` 的 `FILE_TYPE_LIST` 添加扩展名
5. 创建对应的 prompt 文件并添加到 `NEED_FILE_LIST`

### 添加新语言
编辑 `app/compent/radio_compent.py`:
```python
def radio_language_compent():
    return gr.Radio(
        choices=["English", "Chinese", "Japanese", "Korean",
                 "Arabic", "Greek", "French"],  # 添加新语言
        value="English"
    )
```

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

### 调试建议
- 启动时检查 prompt 文件是否存在 (main.py:14-16)
- 使用 `logging.info()` 记录关键步骤
- 异常处理不要使用裸 `except:`，应该明确异常类型

---

## 依赖说明

### 关键依赖
- `gradio==4.40.0` - Web UI 框架
- `langchain==0.2.11` - LLM 编排
- `python-pptx==0.6.23` - PPT 处理
- `python-docx==1.1.2` - Word 处理
- `openpyxl==3.1.5` - Excel 处理
- `pdfplumber==0.11.3` - PDF 文本提取

### Python 版本要求
- ✅ Python 3.10.x
- ❌ Python 3.13 (httptools 编译失败)

---

## 文件结构速查

```
app/
├── compent/           # Gradio UI 组件
│   ├── index.py       # 主界面入口
│   ├── file_service.py # 文件翻译路由
│   └── chat_service.py # 在线翻译服务
├── service/
│   ├── langchain/     # LLM 服务 (OpenAI/Claude/Moonshot/Siliconflow)
│   └── office/        # 文档处理 (pptx/docx/xlsx/pdf)
├── schemas/
│   └── llm_interface.py # LLM 抽象接口
├── util/
│   ├── config.py      # 配置管理
│   └── pptx.py        # PPT 工具函数
├── uploads/           # 上传文件目录
├── output/            # 翻译输出目录
├── logs/              # 日志目录
└── prompt/            # 提示词模板
```

---

## 代码风格约定

1. **异步优先**: 所有 I/O 操作使用 `async/await`
2. **接口抽象**: LLM 服务必须实现 `LLMInterface`
3. **配置集中**: 所有配置项在 `app/util/config.py` 的 `Settings` 类中
4. **错误处理**: 不要使用裸 `except:`，明确异常类型并记录日志
5. **类型提示**: 新代码建议添加类型注解

---

## 与用户交流时

- 使用"喵"、"nya"等语气词
- 保持专业但轻松的语气
- 解释技术方案时用简洁明了的语言
- 遇到需要确认的操作时主动询问用户

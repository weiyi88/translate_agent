# PPT 翻译服务集成指南

## 概述

`PPTTranslationService` 提供了 PPT 文件的智能翻译功能，支持保留原有格式，包括：

- 文本框
- 表格
- 图表标题
- 组合形状
- 自动形状
- 字体样式、颜色、对齐方式等

## 使用方法

### 1. 基本用法

```python
from app.services.ppt_translation_service import PPTTranslationService
from app.service.langchain.index import LLM_obj

# 创建 LLM 服务
llm_service = LLM_obj("gpt-4o-mini")

# 加载 prompt 和结构
prompt = "翻译 prompt 内容..."
struct = '{"translate_text": []}'

# 创建翻译服务
service = PPTTranslationService(
    llm_service=llm_service,
    prompt=prompt,
    struct=struct,
)

# 执行翻译
output_path = await service.translate(
    file_path="/input/presentation.pptx",
    target_language="English",
    output_path="/output/presentation_en.pptx",
)

print(f"翻译完成: {output_path}")
```

### 2. 带进度回调

```python
def progress_callback(progress: float, message: str):
    print(f"[{progress:.1f}%] {message}")

service = PPTTranslationService(
    llm_service=llm_service,
    prompt=prompt,
    struct=struct,
    progress_callback=progress_callback,
)

output_path = await service.translate(
    file_path="/input/presentation.pptx",
    target_language="English",
    output_path="/output/presentation_en.pptx",
)
```

### 3. 集成到 TranslationEngine

在 `app/core/scheduler.py` 的 `_translate()` 方法中集成：

```python
async def _translate(self, task: TranslationTask) -> None:
    """执行翻译"""

    # 进度回调
    def progress_callback(progress: float, message: str):
        task.progress = progress
        logger.info(f"Task {task.id}: [{progress:.1f}%] {message}")

    # 根据文件类型选择服务
    if task.file_type == "pptx":
        # 加载 LLM 服务
        from app.service.langchain.index import LLM_obj
        llm_service = LLM_obj(task.model)

        # 加载 prompt (TODO: 从配置或数据库加载)
        prompt = load_prompt("translate_pptx_json")
        struct = load_prompt("struct_json")

        # 创建 PPT 翻译服务
        from app.services.ppt_translation_service import PPTTranslationService
        ppt_service = PPTTranslationService(
            llm_service=llm_service,
            prompt=prompt,
            struct=struct,
            progress_callback=progress_callback,
        )

        # 执行翻译
        output_path = await ppt_service.translate(
            file_path=task.file_path,
            target_language=task.target_language,
            output_path=f"/output/{task.id}.pptx",
        )

        task.output_path = output_path

    # TODO: 添加其他文件类型的支持
    else:
        raise ValueError(f"不支持的文件类型: {task.file_type}")
```

## 依赖说明

### 必需的工具函数

`PPTTranslationService` 依赖 `app/util/pptx.py` 中的工具函数：

- `get_psr(file_path)` - 加载 PPT 文件
- `page_num_presentation(psr)` - 获取页数
- `extract_text_from_presentation(psr)` - 提取文本（异步生成器）
- `restore_text_to_presentation(psr, data)` - 还原文本到 PPT
- `save_traslate_file(psr, output_path)` - 保存文件

### LLM 服务接口

LLM 服务必须实现 `LLMInterface`，提供以下方法：

```python
class LLMInterface:
    def translates_chain(self, prompt: str):
        """返回一个支持 chain_ainvoke 的对象"""
        pass

class Chain:
    async def chain_ainvoke(
        self,
        content: str,
        struct: str,
        language: str
    ) -> dict:
        """
        执行翻译

        Returns:
            {"translate_text": ["翻译文本1", "翻译文本2", ...]}
        """
        pass
```

## 配置说明

### Prompt 文件位置

- PPT 翻译 prompt: `source_backup/app/prompt/translate_pptx_json.txt`
- 输出结构: `source_backup/app/prompt/struct_json.txt`

### 环境变量

```bash
# LLM API Keys
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
MOONSHOT_API_KEY=sk-xxx
SILICONFLOW_API_KEY=sk-xxx

# 文件路径
FILE_OUTPUT_PATH=/output/
```

## 错误处理

服务会抛出以下异常：

- `Exception("PPT 翻译失败: ...")` - 翻译过程中的任何错误

建议在调用时使用 try-catch 处理：

```python
try:
    output_path = await service.translate(...)
except Exception as e:
    logger.error(f"翻译失败: {e}")
    # 处理错误
```

## 测试

运行测试：

```bash
pytest tests/services/test_ppt_translation_service.py -v
```

## 性能优化建议

1. **并行翻译**: 当前实现是串行的（逐页翻译），可以考虑并行处理多页
2. **批量翻译**: 可以将多页的文本合并后一次性翻译，减少 API 调用
3. **缓存**: 对于重复的文本，可以使用缓存避免重复翻译

## 待办事项

- [ ] 集成到 TranslationEngine (等待 Task #1 完成)
- [ ] 添加数据库进度跟踪
- [ ] 支持术语库
- [ ] 支持翻译缓存
- [ ] 性能优化（并行/批量）

## 版本历史

- v1.0.0 (2026-02-11): 初始版本，从旧架构迁移

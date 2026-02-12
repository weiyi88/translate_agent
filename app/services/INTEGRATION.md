# Scheduler 集成说明

## 目标

将 `PPTTranslationService` 集成到 `app/core/scheduler.py` 的 `_translate()` 方法中。

## 当前状态

`scheduler.py:135-158` 的 `_translate()` 方法目前是一个 TODO 占位符。

## 集成步骤

### 1. 导入必要的模块

在 `app/core/scheduler.py` 顶部添加：

```python
from app.services.factory import TranslationServiceFactory
from app.service.langchain.index import LLM_obj
```

### 2. 初始化工厂

在 `TaskScheduler.__init__()` 中添加：

```python
def __init__(
    self,
    max_concurrent_tasks: int = 3,
    engine: TranslationEngine = None,
):
    # ... 现有代码 ...

    # 创建翻译服务工厂
    self.translation_factory = TranslationServiceFactory()
```

### 3. 替换 `_translate()` 方法

将现有的 `_translate()` 方法替换为：

```python
async def _translate(self, task: TranslationTask) -> None:
    """
    执行翻译

    Args:
        task: 翻译任务

    Raises:
        Exception: 翻译失败
    """
    logger.info(f"开始翻译任务: {task.id}, 文件类型: {task.file_type}")

    # 进度回调
    def progress_callback(progress: float, message: str):
        task.progress = progress
        logger.info(f"Task {task.id}: [{progress:.1f}%] {message}")

    try:
        # 创建 LLM 服务
        llm_service = LLM_obj(task.model)

        # 根据文件类型选择服务
        if task.file_type == "pptx":
            # 创建 PPT 翻译服务
            service = self.translation_factory.create_ppt_service(
                llm_service=llm_service,
                progress_callback=progress_callback,
            )

            # 执行翻译
            output_path = await service.translate(
                file_path=task.file_path,
                target_language=task.target_language,
                output_path=f"/output/{task.id}.pptx",  # TODO: 从配置获取输出路径
            )

            task.output_path = output_path

        elif task.file_type == "docx":
            # TODO: 实现 Word 翻译
            raise NotImplementedError("Word 翻译尚未实现")

        elif task.file_type == "xlsx":
            # TODO: 实现 Excel 翻译
            raise NotImplementedError("Excel 翻译尚未实现")

        elif task.file_type == "pdf":
            # TODO: 实现 PDF 翻译
            raise NotImplementedError("PDF 翻译尚未实现")

        else:
            raise ValueError(f"不支持的文件类型: {task.file_type}")

        logger.info(f"翻译完成: {task.output_path}")

    except Exception as e:
        logger.error(f"翻译任务失败: {task.id}, 错误: {e}", exc_info=True)
        raise
```

## 注意事项

1. **输出路径配置**: 目前硬编码为 `/output/{task.id}.pptx`，应该从配置或环境变量获取
2. **LLM 服务配置**: 确保 `app.service.langchain.index.LLM_obj` 可用
3. **Prompt 文件**: 确保 `source_backup/app/prompt/` 目录下有必要的 prompt 文件
4. **错误处理**: 已经在 `_process_task()` 中处理，会自动重试

## 测试集成

```python
# 在 scheduler.py 或测试文件中
async def test_integration():
    from app.core.engine import TranslationEngine
    from app.models.task import TranslationTask

    # 创建引擎
    engine = TranslationEngine(max_concurrent_tasks=1)
    await engine.start()

    # 创建测试任务
    task = await engine.create_task(
        file_path="/path/to/test.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o-mini",
    )

    # 等待完成
    result = await engine.wait_for_task(task.id, timeout=300)

    print(f"翻译结果: {result}")

    await engine.stop()

# 运行测试
asyncio.run(test_integration())
```

## 依赖检查

确保以下文件存在：

- [x] `app/services/ppt_translation_service.py`
- [x] `app/services/factory.py`
- [x] `app/util/pptx.py`
- [x] `source_backup/app/prompt/translate_pptx_json.txt`
- [x] `source_backup/app/prompt/struct_json.txt`
- [ ] `app/service/langchain/index.py` (需要从 source_backup 复制)
- [ ] `app/util/config.py` (需要从 source_backup 复制)
- [ ] 其他 langchain 服务文件

## 待完成

- [ ] 等待 Task #1 (数据库模型) 完成
- [ ] 复制必要的 langchain 服务文件
- [ ] 更新 scheduler.py
- [ ] 测试集成
- [ ] 更新数据库中的进度 (需要 Task #1 的支持)

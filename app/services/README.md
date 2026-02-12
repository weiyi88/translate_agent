# Services 目录

## 文件说明

### 核心服务
- `ppt_translation_service.py` - PPT 翻译服务类
- `factory.py` - 翻译服务工厂

### 文档
- `README_PPT.md` - PPT 翻译服务详细使用指南
- `INTEGRATION.md` - 集成到 TranslationEngine 的步骤说明
- `TASK_2_REPORT.md` - Task #2 完成报告

### 工具
- `verify_setup.py` - 验证服务配置的脚本

## 快速开始

### 1. 验证配置

```bash
# 激活虚拟环境
source .venv/bin/activate

# 运行验证脚本
python app/services/verify_setup.py
```

### 2. 使用 PPT 翻译服务

```python
from app.services.factory import TranslationServiceFactory
from app.service.langchain.index import LLM_obj

# 创建工厂和服务
factory = TranslationServiceFactory()
llm_service = LLM_obj("gpt-4o-mini")
service = factory.create_ppt_service(llm_service)

# 翻译
output = await service.translate(
    file_path="input.pptx",
    target_language="English",
    output_path="output.pptx"
)
```

### 3. 集成到 Engine

参见 `INTEGRATION.md`

## 待办事项

- [ ] 等待 Task #1 完成
- [ ] 集成到 scheduler.py
- [ ] 端到端测试

## 联系

开发者: Amelia (amelia-ppt)

# 数据库模块使用指南

## 概述

本模块提供 PostgreSQL 数据库支持，用于管理翻译任务。

## 文件结构

```
app/db/
├── __init__.py         # 模块导出
├── database.py         # 数据库连接配置
├── models.py           # SQLAlchemy 数据库模型
└── repository.py       # CRUD 操作

alembic/
├── versions/           # 迁移脚本
├── env.py              # Alembic 环境配置（支持异步）
└── alembic.ini         # Alembic 配置文件

tests/db/
└── test_repository.py  # Repository 测试
```

## 环境配置

### 1. 安装依赖

```bash
uv pip install sqlalchemy[asyncio] asyncpg alembic greenlet
```

### 2. 配置数据库连接

在 `.env` 文件中添加：

```bash
# PostgreSQL 连接字符串
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ai_translate
```

### 3. 运行迁移

```bash
# 初始化数据库（创建表）
.venv/bin/alembic upgrade head

# 查看迁移历史
.venv/bin/alembic history

# 回滚到上一个版本
.venv/bin/alembic downgrade -1
```

## 数据模型

### TranslationTaskDB

翻译任务表，包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| file_name | String(255) | 原文件名 |
| file_path | String(512) | 文件存储路径 |
| file_type | Enum | 文件类型 (pptx/docx/xlsx/pdf) |
| target_language | String(50) | 目标语言 |
| model | String(100) | LLM 模型名称 |
| status | Enum | 任务状态 (pending/queued/processing/completed/failed/cancelled) |
| priority | Integer | 任务优先级 (1-10) |
| progress | Float | 翻译进度 (0-100) |
| created_at | DateTime | 创建时间 |
| started_at | DateTime | 开始处理时间 |
| completed_at | DateTime | 完成时间 |
| error_message | Text | 错误详细信息 |
| error_type | Enum | 错误类型 (api_error/file_error/translation_error/system_error) |
| retry_count | Integer | 重试次数 |
| output_path | String(512) | 翻译结果文件路径 |

### 索引

- `ix_translation_tasks_status`: 按状态查询
- `ix_translation_tasks_priority`: 按优先级排序
- `ix_translation_tasks_created_at`: 按创建时间排序

## 使用示例

### 在 FastAPI 中使用

```python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db, TaskRepository
from app.models.task import TaskStatus

app = FastAPI()

@app.post("/tasks")
async def create_task(db: AsyncSession = Depends(get_db)):
    repo = TaskRepository(db)
    task = await repo.create_task(
        file_name="example.pptx",
        file_path="/uploads/example.pptx",
        file_type="pptx",
        target_language="English",
        model="gpt-4o",
    )
    return task.to_dict()

@app.get("/tasks")
async def list_tasks(
    status: TaskStatus = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    repo = TaskRepository(db)
    tasks = await repo.get_tasks(status=status, skip=skip, limit=limit)
    return [task.to_dict() for task in tasks]

@app.get("/tasks/{task_id}")
async def get_task(task_id: str, db: AsyncSession = Depends(get_db)):
    from uuid import UUID
    repo = TaskRepository(db)
    task = await repo.get_task(UUID(task_id))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.to_dict()

@app.patch("/tasks/{task_id}")
async def update_task(
    task_id: str,
    status: TaskStatus = None,
    progress: float = None,
    db: AsyncSession = Depends(get_db)
):
    from uuid import UUID
    repo = TaskRepository(db)
    task = await repo.update_task(
        UUID(task_id),
        status=status,
        progress=progress
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.to_dict()
```

### 在脚本中使用

```python
import asyncio
from app.db import AsyncSessionLocal, TaskRepository
from app.models.task import TaskStatus

async def main():
    async with AsyncSessionLocal() as session:
        repo = TaskRepository(session)

        # 创建任务
        task = await repo.create_task(
            file_name="test.pptx",
            file_path="/path/to/test.pptx",
            file_type="pptx",
            target_language="Chinese",
            model="gpt-4o"
        )
        await session.commit()
        print(f"Created task: {task.id}")

        # 更新任务
        await repo.update_task(
            task.id,
            status=TaskStatus.PROCESSING,
            progress=50.0
        )
        await session.commit()
        print("Updated task")

        # 查询任务
        tasks = await repo.get_pending_tasks(limit=10)
        for t in tasks:
            print(f"Pending task: {t.file_name}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Repository API

### TaskRepository

#### create_task()
创建新任务

```python
task = await repo.create_task(
    file_name="example.pptx",
    file_path="/uploads/example.pptx",
    file_type="pptx",
    target_language="English",
    model="gpt-4o",
    priority=5  # 可选，默认 5
)
```

#### get_task(task_id)
根据 ID 获取任务

```python
from uuid import UUID
task = await repo.get_task(UUID("..."))
```

#### get_tasks(status, skip, limit, order_by, desc)
获取任务列表（分页）

```python
tasks = await repo.get_tasks(
    status=TaskStatus.PENDING,  # 可选
    skip=0,
    limit=100,
    order_by="created_at",
    desc=True
)
```

#### update_task(task_id, **kwargs)
更新任务

```python
task = await repo.update_task(
    task_id,
    status=TaskStatus.COMPLETED,
    progress=100.0,
    output_path="/output/result.pptx",
    completed_at=datetime.now()
)
```

#### delete_task(task_id)
删除任务

```python
success = await repo.delete_task(task_id)
```

#### count_tasks(status)
统计任务数量

```python
total = await repo.count_tasks()
pending = await repo.count_tasks(status=TaskStatus.PENDING)
```

#### get_pending_tasks(limit)
获取待处理任务（按优先级排序）

```python
tasks = await repo.get_pending_tasks(limit=10)
```

#### increment_retry_count(task_id)
增加重试次数

```python
task = await repo.increment_retry_count(task_id)
```

## 测试

运行测试：

```bash
pytest tests/db/test_repository.py -v
```

测试使用 SQLite 内存数据库，不需要 PostgreSQL。

## 注意事项

1. **事务管理**：使用 `get_db()` 依赖注入时，事务自动管理（成功提交，失败回滚）
2. **连接池**：生产环境建议调整 `pool_size` 和 `max_overflow`
3. **日志**：开发环境 `echo=True` 打印 SQL，生产环境改为 `False`
4. **迁移**：生产环境使用 alembic 管理数据库变更，不要用 `init_db()`

## 与 Pydantic 模型的关系

- **app/models/task.py**: Pydantic 模型，用于 API 输入/输出验证
- **app/db/models.py**: SQLAlchemy 模型，用于数据库操作

两者字段基本一致，可通过 `to_dict()` 方法转换。

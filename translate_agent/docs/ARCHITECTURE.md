# Translate Agent 架构文档

## 架构概览

```
┌─────────────────────────────────────────────┐
│          FastAPI API Layer                  │
│  (RESTful API + Swagger UI)                  │
├─────────────────────────────────────────────┤
│          TranslationEngine                   │
│  - 任务管理                                  │
│  - 状态跟踪                                  │
│  - 依赖关系管理                              │
├─────────────────────────────────────────────┤
│     TaskScheduler + TaskQueue                │
│  - 优先级队列                                │
│  - 并发控制                                  │
│  - Worker 协程池                             │
├─────────────────────────────────────────────┤
│          State Machine                      │
│  - 状态转换                                  │
│  - 状态历史                                  │
│  - 转换规则                                  │
├─────────────────────────────────────────────┤
│       Translation Services (TODO)           │
│  - PPT Translator                           │
│  - Word Translator                          │
│  - Excel Translator                         │
│  - PDF Translator                           │
└─────────────────────────────────────────────┘
```

## 核心组件

### 1. TranslationEngine (翻译引擎)

**职责**:
- 任务创建和管理
- 状态跟踪
- 依赖关系管理
- 错误处理和重试

**关键方法**:
- `create_task()`: 创建翻译任务
- `get_task_status()`: 查询任务状态
- `retry_task()`: 重试失败任务
- `cancel_task()`: 取消任务
- `wait_for_task()`: 等待任务完成

### 2. TaskQueue (任务队列)

**职责**:
- 基于优先级的任务队列
- FIFO 同级排序
- 线程安全

**实现**: 使用 `heapq` 实现最小堆

### 3. TaskScheduler (任务调度器)

**职责**:
- 从队列中获取任务
- 使用信号量控制并发
- 分配任务给 Worker 协程
- 错误处理和重试逻辑

**Worker 模式**: 多个协程并发执行任务

### 4. TaskStateMachine (状态机)

**职责**:
- 状态转换规则
- 状态历史记录
- 防止非法转换

**状态转换**:
```
PENDING → QUEUED → PROCESSING → COMPLETED
                              ↘ FAILED → QUEUED (重试)
```

## 数据模型

### TranslationTask

```python
{
  "id": "uuid",
  "file_path": "/path/to/file.pptx",
  "file_type": "pptx",
  "target_language": "English",
  "model": "gpt-4o-mini",
  "status": "processing",
  "priority": 5,
  "progress": 45.0,
  "created_at": "2026-02-04T12:00:00",
  "started_at": "2026-02-04T12:01:00",
  "completed_at": null,
  "error_message": null,
  "retry_count": 0,
  "output_path": null,
  "depends_on": []
}
```

## API 接口

### 任务管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/tasks | 创建任务 |
| POST | /api/tasks/batch | 批量创建 |
| GET | /api/tasks/{id} | 查询状态 |
| POST | /api/tasks/{id}/retry | 重试 |
| DELETE | /api/tasks/{id} | 取消 |
| GET | /api/tasks/{id}/wait | 等待完成 |
| GET | /api/tasks | 列出所有任务 |

## 并发控制

### 信号量机制

```python
self.semaphore = asyncio.Semaphore(max_concurrent_tasks)

async with self.semaphore:
    # 执行任务
```

### 队列保护

- 使用 `asyncio.Lock` 保护队列操作
- 使用 `asyncio.Condition` 实现等待/通知机制

## 错误处理

### 重试策略

- 指数退避: `delay * backoff^retry_count`
- 最大重试次数: 3
- 可配置重试延迟和退避因子

### 错误分类

```python
class ErrorType(str, Enum):
    API_ERROR = "api_error"
    FILE_ERROR = "file_error"
    TRANSLATION_ERROR = "translation_error"
    SYSTEM_ERROR = "system_error"
```

## 依赖关系管理

### 依赖检查

```python
async def _check_dependencies(task: TranslationTask) -> bool:
    for dep_id in task.depends_on:
        dep_task = self.tasks[dep_id]
        if dep_task.status != TaskStatus.COMPLETED:
            return False
    return True
```

### 依赖满足回调

任务完成后，自动检查是否有其他任务依赖此任务，如果所有依赖都满足，则将任务加入队列。

## 性能优化

### 优先级队列

使用堆实现，入队/出队时间复杂度: O(log n)

### 异步 I/O

所有 I/O 操作使用 `async/await`，避免阻塞事件循环

### 并发控制

通过信号量限制同时执行的任务数量，防止 OOM

## 待实现功能

- [ ] 数据库持久化 (SQLite/PostgreSQL)
- [ ] 实际翻译服务集成
- [ ] WebSocket 实时进度推送
- [ ] 工作流管理 API
- [ ] 翻译质量评估
- [ ] 术语库支持
- [ ] 前端 UI (Gradio 集成)

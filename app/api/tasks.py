"""
任务管理 API
"""
from fastapi import APIRouter, HTTPException, status

from app.core.engine import TranslationEngine
from app.models.task import (
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskResult,
    TranslationTask,
)


router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# 全局引擎实例（在 main.py 中初始化）
engine: TranslationEngine = None


@router.post("", response_model=TranslationTask, status_code=status.HTTP_201_CREATED)
async def create_task(request: TaskCreateRequest) -> TranslationTask:
    """
    创建翻译任务

    - **file_path**: 文件路径
    - **file_type**: 文件类型 (pptx/docx/xlsx/pdf)
    - **target_language**: 目标语言
    - **model**: LLM 模型
    - **priority**: 优先级 (1-10, 默认 5)
    - **depends_on**: 依赖的任务 ID 列表
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    task = await engine.create_task(
        file_path=request.file_path,
        file_type=request.file_type,
        target_language=request.target_language,
        model=request.model,
        priority=request.priority,
        depends_on=request.depends_on,
    )

    return task


@router.post("/batch", response_model=list[TranslationTask])
async def create_tasks_batch(requests: list[TaskCreateRequest]) -> list[TranslationTask]:
    """批量创建翻译任务"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    tasks = []
    for req in requests:
        task = await engine.create_task(
            file_path=req.file_path,
            file_type=req.file_type,
            target_language=req.target_language,
            model=req.model,
            priority=req.priority,
            depends_on=req.depends_on,
        )
        tasks.append(task)

    return tasks


@router.get("/{task_id}", response_model=TaskResult)
async def get_task_status(task_id: str) -> TaskResult:
    """查询任务状态"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    try:
        result = await engine.get_task_status(task_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{task_id}/retry", status_code=status.HTTP_202_ACCEPTED)
async def retry_task(task_id: str):
    """重试失败的任务"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    try:
        await engine.retry_task(task_id)
        return {"message": f"Task {task_id} queued for retry"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_task(task_id: str):
    """取消任务"""
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    try:
        await engine.cancel_task(task_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{task_id}/wait", response_model=TaskResult)
async def wait_for_task(task_id: str, timeout: float = None):
    """
    等待任务完成

    - **timeout**: 超时时间（秒），可选
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    try:
        result = await engine.wait_for_task(task_id, timeout=timeout)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except TimeoutError:
        raise HTTPException(status_code=408, detail=f"Task {task_id} timed out")


@router.get("", response_model=list[TranslationTask])
async def list_tasks(
    status: str = None,
    limit: int = 100,
    offset: int = 0,
) -> list[TranslationTask]:
    """
    列出所有任务

    - **status**: 按状态过滤 (pending/queued/processing/completed/failed)
    - **limit**: 返回数量限制
    - **offset**: 偏移量
    """
    if engine is None:
        raise HTTPException(status_code=500, detail="Engine not initialized")

    tasks = list(engine.tasks.values())

    # 过滤
    if status:
        tasks = [t for t in tasks if t.status == status]

    # 排序（按创建时间倒序）
    tasks = sorted(tasks, key=lambda t: t.created_at, reverse=True)

    # 分页
    return tasks[offset:offset + limit]

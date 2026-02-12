"""
翻译 API 路由 - MVP 核心 3 端点

实现核心翻译功能：
1. 上传并创建翻译任务
2. 查询任务状态
3. 下载翻译结果
"""
import os
import uuid
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db, TaskRepository
from app.db.models import TranslationTaskDB
from app.api.schemas.translate import (
    TranslateUploadRequest,
    TranslateUploadResponse,
    TaskStatusResponse,
)
from app.models.task import TaskStatus, ErrorType
from app.core.engine import TranslationEngine

# 创建路由
router = APIRouter(prefix="/api/translate", tags=["translate"])

# 全局引擎实例（在 main.py 中初始化）
engine: Optional[TranslationEngine] = None

# 文件配置
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("output")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pptx", ".docx", ".xlsx", ".pdf"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB


def set_engine(translation_engine: TranslationEngine):
    """设置全局引擎实例"""
    global engine
    engine = translation_engine


@router.post("/upload", response_model=TranslateUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_translate(
    file: UploadFile = File(...),
    target_language: str = "English",
    model: str = "gpt-4",
    db: AsyncSession = Depends(get_db),
):
    """
    上传文件并创建翻译任务

    **MVP 核心端点 #1**

    Args:
        file: 上传的文件 (.pptx, .docx, .xlsx, .pdf)
        target_language: 目标语言（默认 English）
        model: LLM 模型（默认 gpt-4）

    Returns:
        TranslateUploadResponse: 包含 task_id 和状态

    Raises:
        400: 不支持的文件类型或文件过大
        500: 文件保存失败或任务创建失败
    """
    # 验证引擎已初始化
    if engine is None:
        raise HTTPException(status_code=500, detail="Translation engine not initialized")

    # 1. 验证文件类型
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Only {', '.join(ALLOWED_EXTENSIONS)} are allowed"
        )

    # 2. 读取文件内容
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {str(e)}")

    # 3. 验证文件大小
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // 1024 // 1024}MB"
        )

    # 4. 生成唯一文件名并保存
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}{file_ext}"
    file_path = UPLOAD_DIR / safe_filename

    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # 5. 创建数据库任务记录
    repo = TaskRepository(db)
    file_type = file_ext[1:]  # 移除前缀点号，如 .pptx -> pptx

    try:
        db_task = await repo.create_task(
            file_name=file.filename,
            file_path=str(file_path),
            file_type=file_type,
            target_language=target_language,
            model=model,
            priority=5,  # 默认优先级
        )
        await db.commit()
        await db.refresh(db_task)

        # 6. 创建翻译引擎任务
        engine_task = await engine.create_task(
            file_path=str(file_path),
            file_type=file_type,
            target_language=target_language,
            model=model,
        )

        return TranslateUploadResponse(
            task_id=str(db_task.id),
            status="pending",
            message="Translation task created successfully"
        )

    except Exception as e:
        # 清理上传的文件
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")


@router.get("/status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    查询任务状态

    **MVP 核心端点 #2**

    Args:
        task_id: 任务 UUID

    Returns:
        TaskStatusResponse: 任务状态详情

    Raises:
        404: 任务不存在
        422: 无效的 UUID 格式
    """
    # 验证 UUID 格式
    try:
        from uuid import UUID
        task_uuid = UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid task ID format")

    # 查询数据库
    repo = TaskRepository(db)
    task = await repo.get_task(task_uuid)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # 返回任务状态
    return TaskStatusResponse(
        task_id=str(task.id),
        status=task.status.value if isinstance(task.status, TaskStatus) else task.status,
        progress=task.progress,
        file_name=task.file_name,
        output_path=task.output_path,
        error_message=task.error_message,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@router.get("/download/{task_id}")
async def download_translated_file(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    下载翻译结果

    **MVP 核心端点 #3**

    Args:
        task_id: 任务 UUID

    Returns:
        FileResponse: 翻译后的文件

    Raises:
        404: 任务不存在或文件未找到
        400: 任务未完成
        422: 无效的 UUID 格式
    """
    # 验证 UUID 格式
    try:
        from uuid import UUID
        task_uuid = UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid task ID format")

    # 查询任务
    repo = TaskRepository(db)
    task = await repo.get_task(task_uuid)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # 检查任务状态
    if task.status != TaskStatus.COMPLETED:
        raise HTTPException(
            status_code=400,
            detail=f"Task is not completed yet. Current status: {task.status}"
        )

    # 检查输出文件是否存在
    if not task.output_path:
        raise HTTPException(status_code=404, detail="Output file path not found")

    output_file = Path(task.output_path)
    if not output_file.exists():
        raise HTTPException(status_code=404, detail="Output file not found on server")

    # 返回文件
    return FileResponse(
        path=output_file,
        filename=f"translated_{task.file_name}",
        media_type="application/octet-stream",
    )

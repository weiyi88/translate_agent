"""
历史记录 API 路由

提供翻译任务历史记录的查询、详情和删除功能
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.history import (
    HistoryResponse,
    TaskDetailResponse,
    DeleteTaskResponse,
)
from app.db.database import get_db
from app.db.repository import TaskRepository
from app.models.task import TaskStatus


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/translate/history", tags=["history"])


@router.get("/", response_model=HistoryResponse)
async def get_history(
    page: int = Query(1, ge=1, description="页码，从 1 开始"),
    page_size: int = Query(20, ge=1, le=100, description="每页条数"),
    status: Optional[TaskStatus] = Query(None, description="按状态筛选"),
    file_type: Optional[str] = Query(None, description="按文件类型筛选 (pptx/docx/xlsx/pdf)"),
    order_by: str = Query("created_at", description="排序字段"),
    desc: bool = Query(True, description="是否降序"),
    db: AsyncSession = Depends(get_db),
) -> HistoryResponse:
    """
    查询历史记录（分页）

    Args:
        page: 页码，从 1 开始
        page_size: 每页条数，范围 1-100
        status: 按状态筛选（可选）
        file_type: 按文件类型筛选（可选）
        order_by: 排序字段，默认 created_at
        desc: 是否降序，默认 True

    Returns:
        分页的历史记录列表

    Raises:
        HTTPException: 查询失败时抛出 500 错误
    """
    try:
        repo = TaskRepository(db)

        # 计算 offset
        skip = (page - 1) * page_size

        # TODO: 添加 file_type 筛选支持（等 repository 更新）
        # 查询任务列表
        tasks = await repo.get_tasks(
            status=status,
            skip=skip,
            limit=page_size,
            order_by=order_by,
            desc=desc,
        )

        # 统计总数
        total = await repo.count_tasks(status=status)

        # 转换为响应模型
        items = [
            {
                "task_id": task.id,
                "file_name": task.file_name,
                "file_type": task.file_type,
                "target_language": task.target_language,
                "model": task.model,
                "status": task.status,
                "progress": task.progress,
                "created_at": task.created_at,
                "started_at": task.started_at,
                "completed_at": task.completed_at,
            }
            for task in tasks
        ]

        return HistoryResponse(
            total=total,
            page=page,
            page_size=page_size,
            items=items,
        )

    except Exception as e:
        logger.error(f"查询历史记录失败: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"查询历史记录失败: {str(e)}")


@router.get("/{task_id}", response_model=TaskDetailResponse)
async def get_task_detail(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> TaskDetailResponse:
    """
    查询单个任务详情

    Args:
        task_id: 任务 UUID

    Returns:
        任务详细信息

    Raises:
        HTTPException: 任务不存在时抛出 404，查询失败时抛出 500
    """
    try:
        repo = TaskRepository(db)

        # 查询任务
        task = await repo.get_task(task_id)

        if not task:
            raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")

        # 转换为响应模型
        return TaskDetailResponse(
            task_id=task.id,
            file_name=task.file_name,
            file_path=task.file_path,
            file_type=task.file_type,
            target_language=task.target_language,
            model=task.model,
            status=task.status,
            priority=task.priority,
            progress=task.progress,
            created_at=task.created_at,
            started_at=task.started_at,
            completed_at=task.completed_at,
            output_path=task.output_path,
            error_message=task.error_message,
            error_type=task.error_type,
            retry_count=task.retry_count,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"查询任务详情失败: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"查询任务详情失败: {str(e)}")


@router.delete("/{task_id}", response_model=DeleteTaskResponse)
async def delete_task(
    task_id: UUID,
    delete_files: bool = Query(True, description="是否同时删除文件"),
    db: AsyncSession = Depends(get_db),
) -> DeleteTaskResponse:
    """
    删除历史记录

    Args:
        task_id: 任务 UUID
        delete_files: 是否同时删除原文件和译文

    Returns:
        删除结果

    Raises:
        HTTPException: 任务不存在时抛出 404，删除失败时抛出 500
    """
    try:
        repo = TaskRepository(db)

        # 查询任务（获取文件路径）
        task = await repo.get_task(task_id)

        if not task:
            raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")

        deleted_files = []

        # 删除文件
        if delete_files:
            import os

            # 删除原文件
            if task.file_path and os.path.exists(task.file_path):
                try:
                    os.remove(task.file_path)
                    deleted_files.append(task.file_path)
                    logger.info(f"已删除原文件: {task.file_path}")
                except Exception as e:
                    logger.warning(f"删除原文件失败: {e}")

            # 删除译文
            if task.output_path and os.path.exists(task.output_path):
                try:
                    os.remove(task.output_path)
                    deleted_files.append(task.output_path)
                    logger.info(f"已删除译文: {task.output_path}")
                except Exception as e:
                    logger.warning(f"删除译文失败: {e}")

        # 删除数据库记录
        await repo.delete_task(task_id)
        await db.commit()

        logger.info(f"已删除任务: {task_id}")

        return DeleteTaskResponse(
            success=True,
            message=f"任务 {task_id} 已删除",
            deleted_files=deleted_files,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除任务失败: {e}", exc_info=True)
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"删除任务失败: {str(e)}")

"""
数据库 CRUD Repository
提供异步数据库操作接口
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import TranslationTaskDB
from app.models.task import TaskStatus, TaskPriority, ErrorType


class TaskRepository:
    """翻译任务数据库操作类"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_task(
        self,
        file_name: str,
        file_path: str,
        file_type: str,
        target_language: str,
        model: str,
        priority: int = TaskPriority.NORMAL,
    ) -> TranslationTaskDB:
        """
        创建新任务

        Args:
            file_name: 文件名
            file_path: 文件存储路径
            file_type: 文件类型 (pptx/docx/xlsx/pdf)
            target_language: 目标语言
            model: LLM 模型名称
            priority: 任务优先级

        Returns:
            创建的任务对象
        """
        task = TranslationTaskDB(
            file_name=file_name,
            file_path=file_path,
            file_type=file_type,
            target_language=target_language,
            model=model,
            priority=priority,
            status=TaskStatus.PENDING,
            progress=0.0,
        )
        self.session.add(task)
        await self.session.flush()  # 刷新以获取生成的 ID
        await self.session.refresh(task)
        return task

    async def get_task(self, task_id: UUID) -> Optional[TranslationTaskDB]:
        """
        根据 ID 获取单个任务

        Args:
            task_id: 任务 UUID

        Returns:
            任务对象，不存在则返回 None
        """
        result = await self.session.execute(
            select(TranslationTaskDB).where(TranslationTaskDB.id == task_id)
        )
        return result.scalar_one_or_none()

    async def get_tasks(
        self,
        status: Optional[TaskStatus] = None,
        skip: int = 0,
        limit: int = 100,
        order_by: str = "created_at",
        desc: bool = True,
    ) -> List[TranslationTaskDB]:
        """
        获取任务列表（分页）

        Args:
            status: 按状态过滤（可选）
            skip: 跳过前 N 条记录
            limit: 返回最多 N 条记录
            order_by: 排序字段
            desc: 是否降序

        Returns:
            任务列表
        """
        query = select(TranslationTaskDB)

        # 状态过滤
        if status:
            query = query.where(TranslationTaskDB.status == status)

        # 排序
        order_column = getattr(TranslationTaskDB, order_by, TranslationTaskDB.created_at)
        if desc:
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # 分页
        query = query.offset(skip).limit(limit)

        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def count_tasks(self, status: Optional[TaskStatus] = None) -> int:
        """
        统计任务数量

        Args:
            status: 按状态过滤（可选）

        Returns:
            任务总数
        """
        query = select(func.count(TranslationTaskDB.id))
        if status:
            query = query.where(TranslationTaskDB.status == status)

        result = await self.session.execute(query)
        return result.scalar_one()

    async def update_task(
        self,
        task_id: UUID,
        status: Optional[TaskStatus] = None,
        progress: Optional[float] = None,
        error_message: Optional[str] = None,
        error_type: Optional[ErrorType] = None,
        output_path: Optional[str] = None,
        started_at: Optional[datetime] = None,
        completed_at: Optional[datetime] = None,
    ) -> Optional[TranslationTaskDB]:
        """
        更新任务信息

        Args:
            task_id: 任务 UUID
            status: 新状态
            progress: 新进度
            error_message: 错误信息
            error_type: 错误类型
            output_path: 输出文件路径
            started_at: 开始时间
            completed_at: 完成时间

        Returns:
            更新后的任务对象，不存在则返回 None
        """
        # 构建更新字段
        update_data = {}
        if status is not None:
            update_data["status"] = status
        if progress is not None:
            update_data["progress"] = progress
        if error_message is not None:
            update_data["error_message"] = error_message
        if error_type is not None:
            update_data["error_type"] = error_type
        if output_path is not None:
            update_data["output_path"] = output_path
        if started_at is not None:
            update_data["started_at"] = started_at
        if completed_at is not None:
            update_data["completed_at"] = completed_at

        # 如果没有更新字段，直接返回
        if not update_data:
            return await self.get_task(task_id)

        # 执行更新
        stmt = (
            update(TranslationTaskDB)
            .where(TranslationTaskDB.id == task_id)
            .values(**update_data)
        )
        await self.session.execute(stmt)
        await self.session.flush()

        # 返回更新后的对象
        return await self.get_task(task_id)

    async def delete_task(self, task_id: UUID) -> bool:
        """
        删除任务

        Args:
            task_id: 任务 UUID

        Returns:
            True 删除成功，False 任务不存在
        """
        stmt = delete(TranslationTaskDB).where(TranslationTaskDB.id == task_id)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def get_pending_tasks(self, limit: int = 10) -> List[TranslationTaskDB]:
        """
        获取待处理任务（按优先级排序）

        Args:
            limit: 返回最多 N 条记录

        Returns:
            待处理任务列表
        """
        query = (
            select(TranslationTaskDB)
            .where(TranslationTaskDB.status == TaskStatus.PENDING)
            .order_by(TranslationTaskDB.priority.desc(), TranslationTaskDB.created_at.asc())
            .limit(limit)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def increment_retry_count(self, task_id: UUID) -> Optional[TranslationTaskDB]:
        """
        增加重试次数

        Args:
            task_id: 任务 UUID

        Returns:
            更新后的任务对象
        """
        task = await self.get_task(task_id)
        if not task:
            return None

        stmt = (
            update(TranslationTaskDB)
            .where(TranslationTaskDB.id == task_id)
            .values(retry_count=TranslationTaskDB.retry_count + 1)
        )
        await self.session.execute(stmt)
        await self.session.flush()
        return await self.get_task(task_id)

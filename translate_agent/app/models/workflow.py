"""
工作流模型
"""
from datetime import datetime
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field

from .task import TaskStatus


class Workflow(BaseModel):
    """工作流模型"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: Optional[str] = None

    # 任务列表
    task_ids: list[str] = Field(default_factory=list)

    # 状态
    status: TaskStatus = TaskStatus.PENDING
    progress: float = 0.0  # 整体进度

    # 时间戳
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class WorkflowCreateRequest(BaseModel):
    """创建工作流请求"""
    name: str
    description: Optional[str] = None
    tasks: list[dict]  # 任务定义列表


class WorkflowStatus(BaseModel):
    """工作流状态"""
    workflow_id: str
    name: str
    status: TaskStatus
    progress: float
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

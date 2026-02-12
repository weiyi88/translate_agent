"""
历史记录 API 响应模型
"""
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import TaskStatus


class TaskHistoryItem(BaseModel):
    """历史记录列表项"""

    task_id: UUID = Field(..., description="任务 ID")
    file_name: str = Field(..., description="文件名")
    file_type: str = Field(..., description="文件类型 (pptx/docx/xlsx/pdf)")
    target_language: str = Field(..., description="目标语言")
    model: str = Field(..., description="使用的 LLM 模型")
    status: TaskStatus = Field(..., description="任务状态")
    progress: float = Field(..., ge=0, le=100, description="翻译进度 (0-100)")
    created_at: datetime = Field(..., description="创建时间")
    started_at: Optional[datetime] = Field(None, description="开始时间")
    completed_at: Optional[datetime] = Field(None, description="完成时间")

    class Config:
        from_attributes = True


class TaskDetailResponse(BaseModel):
    """单个任务详情"""

    task_id: UUID = Field(..., description="任务 ID")
    file_name: str = Field(..., description="原文件名")
    file_path: str = Field(..., description="原文件路径")
    file_type: str = Field(..., description="文件类型")
    target_language: str = Field(..., description="目标语言")
    model: str = Field(..., description="LLM 模型")
    status: TaskStatus = Field(..., description="任务状态")
    priority: int = Field(..., description="优先级")
    progress: float = Field(..., ge=0, le=100, description="进度")

    # 时间信息
    created_at: datetime = Field(..., description="创建时间")
    started_at: Optional[datetime] = Field(None, description="开始时间")
    completed_at: Optional[datetime] = Field(None, description="完成时间")

    # 结果信息
    output_path: Optional[str] = Field(None, description="输出文件路径")
    error_message: Optional[str] = Field(None, description="错误信息")
    error_type: Optional[str] = Field(None, description="错误类型")
    retry_count: int = Field(0, description="重试次数")

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    """历史记录分页响应"""

    total: int = Field(..., description="总记录数")
    page: int = Field(..., ge=1, description="当前页码")
    page_size: int = Field(..., ge=1, le=100, description="每页条数")
    items: List[TaskHistoryItem] = Field(..., description="历史记录列表")


class DeleteTaskResponse(BaseModel):
    """删除任务响应"""

    success: bool = Field(..., description="是否成功")
    message: str = Field(..., description="响应消息")
    deleted_files: List[str] = Field(default_factory=list, description="已删除的文件")

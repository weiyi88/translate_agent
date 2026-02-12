"""
API 响应模型扩展

为 Task #3 准备的额外 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.task import TaskStatus, TaskPriority, ErrorType


class TaskResponse(BaseModel):
    """
    任务响应模型（用于 API 返回）
    与 TranslationTask 类似，但 id 为字符串格式
    """
    id: str
    file_name: str
    file_path: str
    file_type: str
    target_language: str
    model: str
    status: TaskStatus
    priority: int
    progress: float
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    error_type: Optional[ErrorType] = None
    retry_count: int = 0
    output_path: Optional[str] = None

    class Config:
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "file_name": "presentation.pptx",
                "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000.pptx",
                "file_type": "pptx",
                "target_language": "English",
                "model": "gpt-4o",
                "status": "processing",
                "priority": 5,
                "progress": 50.0,
                "created_at": "2026-02-11T12:00:00Z",
                "started_at": "2026-02-11T12:00:05Z",
                "completed_at": None,
                "error_message": None,
                "error_type": None,
                "retry_count": 0,
                "output_path": None
            }
        }


class TaskListResponse(BaseModel):
    """任务列表响应（带分页信息）"""
    total: int = Field(..., description="总任务数")
    items: List[TaskResponse] = Field(..., description="任务列表")
    skip: int = Field(0, description="跳过的记录数")
    limit: int = Field(100, description="返回的最大记录数")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 150,
                "items": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "file_name": "presentation.pptx",
                        "status": "completed",
                        "progress": 100.0
                    }
                ],
                "skip": 0,
                "limit": 100
            }
        }


class StatsResponse(BaseModel):
    """任务统计响应"""
    total_tasks: int = Field(..., description="总任务数")
    pending: int = Field(..., description="待处理任务数")
    queued: int = Field(..., description="已排队任务数")
    processing: int = Field(..., description="处理中任务数")
    completed: int = Field(..., description="已完成任务数")
    failed: int = Field(..., description="失败任务数")
    cancelled: int = Field(..., description="已取消任务数")
    average_completion_time: float = Field(..., description="平均完成时间（秒）")

    class Config:
        json_schema_extra = {
            "example": {
                "total_tasks": 1000,
                "pending": 50,
                "queued": 10,
                "processing": 5,
                "completed": 900,
                "failed": 30,
                "cancelled": 5,
                "average_completion_time": 120.5
            }
        }


class HealthResponse(BaseModel):
    """健康检查响应"""
    status: str = Field(..., description="总体状态", pattern="^(healthy|degraded|unhealthy)$")
    database: str = Field(..., description="数据库状态")
    queue: str = Field(..., description="任务队列状态")
    workers: int = Field(..., description="Worker 数量")
    uptime_seconds: float = Field(..., description="运行时间（秒）")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "database": "connected",
                "queue": "running",
                "workers": 4,
                "uptime_seconds": 86400.5
            }
        }


class UploadResponse(BaseModel):
    """文件上传响应"""
    file_path: str = Field(..., description="文件存储路径")
    file_name: str = Field(..., description="原始文件名")
    file_size: int = Field(..., description="文件大小（字节）")
    file_type: str = Field(..., description="文件类型")

    class Config:
        json_schema_extra = {
            "example": {
                "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000.pptx",
                "file_name": "presentation.pptx",
                "file_size": 1048576,
                "file_type": "pptx"
            }
        }


class ErrorResponse(BaseModel):
    """错误响应"""
    detail: str = Field(..., description="错误详情")
    error_code: Optional[str] = Field(None, description="错误代码")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Task not found",
                "error_code": "TASK_NOT_FOUND"
            }
        }


class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str = Field(..., description="消息内容")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Task cancelled successfully"
            }
        }


class RetryResponse(BaseModel):
    """重试任务响应"""
    message: str = Field(..., description="消息内容")
    retry_count: int = Field(..., description="当前重试次数")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Task queued for retry",
                "retry_count": 2
            }
        }

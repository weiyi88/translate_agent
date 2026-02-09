"""
翻译任务模型
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    """任务状态枚举"""
    PENDING = "pending"        # 待处理
    QUEUED = "queued"          # 已排队
    PROCESSING = "processing"  # 处理中
    COMPLETED = "completed"    # 已完成
    FAILED = "failed"          # 失败
    CANCELLED = "cancelled"    # 已取消


class TaskPriority(int, Enum):
    """任务优先级"""
    LOW = 1
    NORMAL = 5
    HIGH = 8
    URGENT = 10


class ErrorType(str, Enum):
    """错误类型"""
    API_ERROR = "api_error"           # API 调用错误
    FILE_ERROR = "file_error"         # 文件处理错误
    TRANSLATION_ERROR = "translation_error"  # 翻译错误
    SYSTEM_ERROR = "system_error"     # 系统错误


class TranslationTask(BaseModel):
    """翻译任务模型"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    file_path: str
    file_type: str  # pptx/docx/xlsx/pdf
    target_language: str
    model: str
    status: TaskStatus = TaskStatus.PENDING
    priority: int = TaskPriority.NORMAL
    progress: float = 0.0  # 0-100

    # 时间戳
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # 错误信息
    error_message: Optional[str] = None
    error_type: Optional[ErrorType] = None
    retry_count: int = 0

    # 输出
    output_path: Optional[str] = None

    # 依赖
    depends_on: list[str] = Field(default_factory=list)  # 依赖的任务 ID

    class Config:
        use_enum_values = True


class TaskResult(BaseModel):
    """任务执行结果"""
    task_id: str
    status: TaskStatus
    output_path: Optional[str] = None
    error_message: Optional[str] = None
    progress: float = 0.0
    created_at: datetime
    completed_at: Optional[datetime] = None


class TaskCreateRequest(BaseModel):
    """创建任务请求"""
    file_path: str
    file_type: str
    target_language: str
    model: str
    priority: int = TaskPriority.NORMAL
    depends_on: list[str] = Field(default_factory=list)


class TaskUpdateRequest(BaseModel):
    """更新任务请求"""
    status: Optional[TaskStatus] = None
    progress: Optional[float] = None
    error_message: Optional[str] = None
    output_path: Optional[str] = None

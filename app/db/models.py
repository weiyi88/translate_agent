"""
SQLAlchemy 数据库模型
定义 TranslationTask 表结构
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base
from app.models.task import TaskStatus, TaskPriority, ErrorType


class TranslationTaskDB(Base):
    """
    翻译任务数据库模型

    对应 Pydantic 模型: app.models.task.TranslationTask
    """
    __tablename__ = "translation_tasks"

    # 主键
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="任务唯一标识"
    )

    # 文件信息
    file_name = Column(String(255), nullable=False, comment="原文件名")
    file_path = Column(String(512), nullable=False, comment="文件存储路径")
    file_type = Column(
        SQLEnum("pptx", "docx", "xlsx", "pdf", name="file_type_enum"),
        nullable=False,
        comment="文件类型"
    )

    # 翻译配置
    target_language = Column(String(50), nullable=False, comment="目标语言")
    model = Column(String(100), nullable=False, comment="LLM 模型名称")

    # 任务状态
    status = Column(
        SQLEnum(TaskStatus, name="task_status_enum"),
        nullable=False,
        default=TaskStatus.PENDING,
        index=True,
        comment="任务状态"
    )
    priority = Column(
        Integer,
        nullable=False,
        default=TaskPriority.NORMAL,
        index=True,
        comment="任务优先级"
    )
    progress = Column(Float, nullable=False, default=0.0, comment="翻译进度 (0-100)")

    # 时间戳
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.now,
        index=True,
        comment="创建时间"
    )
    started_at = Column(DateTime, nullable=True, comment="开始处理时间")
    completed_at = Column(DateTime, nullable=True, comment="完成时间")

    # 错误信息
    error_message = Column(Text, nullable=True, comment="错误详细信息")
    error_type = Column(
        SQLEnum(ErrorType, name="error_type_enum", create_type=True),
        nullable=True,
        comment="错误类型"
    )
    retry_count = Column(Integer, nullable=False, default=0, comment="重试次数")

    # 输出
    output_path = Column(String(512), nullable=True, comment="翻译结果文件路径")

    def __repr__(self):
        return (
            f"<TranslationTask("
            f"id={self.id}, "
            f"file_name={self.file_name}, "
            f"status={self.status}, "
            f"progress={self.progress}%"
            f")>"
        )

    def to_dict(self):
        """转换为字典（用于 API 响应）"""
        return {
            "id": str(self.id),
            "file_name": self.file_name,
            "file_path": self.file_path,
            "file_type": self.file_type,
            "target_language": self.target_language,
            "model": self.model,
            "status": self.status.value if isinstance(self.status, TaskStatus) else self.status,
            "priority": self.priority,
            "progress": self.progress,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "error_message": self.error_message,
            "error_type": self.error_type.value if self.error_type else None,
            "retry_count": self.retry_count,
            "output_path": self.output_path,
        }

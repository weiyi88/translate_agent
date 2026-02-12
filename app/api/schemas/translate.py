"""
翻译 API Schema 定义
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TranslateUploadRequest(BaseModel):
    """
    翻译上传请求

    用户上传文件并指定翻译参数
    """
    target_language: str = Field(..., description="目标语言，如 'English', 'Chinese', 'Japanese'")
    model: str = Field(default="gpt-4", description="使用的 LLM 模型")

    class Config:
        json_schema_extra = {
            "example": {
                "target_language": "English",
                "model": "gpt-4"
            }
        }


class TranslateUploadResponse(BaseModel):
    """
    翻译上传响应

    返回创建的任务信息
    """
    task_id: str = Field(..., description="任务唯一标识符")
    status: str = Field(..., description="任务状态")
    message: str = Field(..., description="响应消息")

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "pending",
                "message": "Translation task created successfully"
            }
        }


class TaskStatusResponse(BaseModel):
    """
    任务状态响应

    查询任务状态时返回的详细信息
    """
    task_id: str = Field(..., description="任务唯一标识符")
    status: str = Field(..., description="任务状态: pending/processing/completed/failed")
    progress: float = Field(..., ge=0, le=100, description="翻译进度 (0-100)")
    file_name: Optional[str] = Field(None, description="原始文件名")
    output_path: Optional[str] = Field(None, description="翻译结果文件路径")
    error_message: Optional[str] = Field(None, description="错误信息（如果失败）")
    created_at: datetime = Field(..., description="任务创建时间")
    completed_at: Optional[datetime] = Field(None, description="任务完成时间")

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "processing",
                "progress": 65.5,
                "file_name": "presentation.pptx",
                "output_path": None,
                "error_message": None,
                "created_at": "2026-02-11T12:00:00Z",
                "completed_at": None
            }
        }


class TaskHistoryResponse(BaseModel):
    """
    任务历史响应

    分页查询任务历史记录
    """
    total: int = Field(..., description="总任务数")
    page: int = Field(..., ge=1, description="当前页码（从 1 开始）")
    page_size: int = Field(..., ge=1, le=100, description="每页大小")
    items: List[TaskStatusResponse] = Field(..., description="任务列表")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 150,
                "page": 1,
                "page_size": 20,
                "items": [
                    {
                        "task_id": "550e8400-e29b-41d4-a716-446655440000",
                        "status": "completed",
                        "progress": 100.0,
                        "file_name": "presentation.pptx",
                        "output_path": "output/translated_550e8400.pptx",
                        "error_message": None,
                        "created_at": "2026-02-11T12:00:00Z",
                        "completed_at": "2026-02-11T12:05:30Z"
                    }
                ]
            }
        }

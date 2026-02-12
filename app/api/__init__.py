"""
API 路由初始化
"""
from fastapi import APIRouter

from app.api.tasks import router as tasks_router
from app.api.upload import router as upload_router
from app.api.routes.translate import router as translate_router
from app.api.routes.history import router as history_router


api_router = APIRouter()

# 注册路由
api_router.include_router(tasks_router)
api_router.include_router(upload_router)
api_router.include_router(translate_router)  # MVP 核心 3 端点
api_router.include_router(history_router)    # 历史记录 API

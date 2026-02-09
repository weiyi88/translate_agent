"""
API 路由初始化
"""
from fastapi import APIRouter

from app.api.tasks import router as tasks_router


api_router = APIRouter()

# 注册路由
api_router.include_router(tasks_router)

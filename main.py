"""
Translate Agent - 翻译工作流引擎主入口
"""
import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.engine import TranslationEngine


# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# 全局引擎实例
engine: TranslationEngine = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global engine

    # 启动
    logger.info("Starting Translate Agent...")

    engine = TranslationEngine(
        max_concurrent_tasks=3,
        queue_size=100,
        max_retries=3,
        retry_delay=1.0,
        retry_backoff=2.0,
    )

    await engine.start()

    # 注入引擎到 API 模块
    from app.api import tasks
    tasks.engine = engine

    logger.info("Translate Agent started successfully")

    yield

    # 关闭
    logger.info("Stopping Translate Agent...")
    await engine.stop()
    logger.info("Translate Agent stopped")


# 创建 FastAPI 应用
app = FastAPI(
    title="Translate Agent",
    description="AI Office 文档翻译工作流引擎",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(api_router)


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": "Translate Agent",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "engine_running": engine is not None and engine.is_running,
    }


def main():
    """主函数"""
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info",
    )


if __name__ == "__main__":
    main()

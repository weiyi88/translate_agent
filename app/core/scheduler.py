"""
任务调度器
"""
import asyncio
import logging
from typing import TYPE_CHECKING
from uuid import UUID

from app.core.queue import TaskQueue
from app.models.task import TranslationTask, TaskStatus
from app.services.factory import TranslationServiceFactory
from app.service.langchain.index import LLM_obj
from app.util.config import Settings
from app.db.database import get_db
from app.db.repository import TaskRepository

if TYPE_CHECKING:
    from app.core.engine import TranslationEngine


logger = logging.getLogger(__name__)


class TaskScheduler:
    """
    任务调度器

    负责:
    - 从队列中获取任务
    - 控制并发数量
    - 执行翻译任务
    - 错误处理和重试
    """

    def __init__(
        self,
        max_concurrent_tasks: int = 3,
        engine: "TranslationEngine" = None,
    ):
        self.max_concurrent_tasks = max_concurrent_tasks
        self.engine = engine

        # 信号量控制并发
        self.semaphore = asyncio.Semaphore(max_concurrent_tasks)

        # 运行状态
        self.is_running = False
        self._workers: list[asyncio.Task] = []

        # 翻译服务工厂
        self.translation_factory = TranslationServiceFactory()

    async def start(self) -> None:
        """启动调度器"""
        if self.is_running:
            logger.warning("Scheduler is already running")
            return

        self.is_running = True
        logger.info("TaskScheduler started")

        # 启动工作协程
        for i in range(self.max_concurrent_tasks):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self._workers.append(worker)

    async def stop(self) -> None:
        """停止调度器"""
        if not self.is_running:
            return

        self.is_running = False

        # 取消所有工作协程
        for worker in self._workers:
            worker.cancel()

        # 等待所有工作协程结束
        await asyncio.gather(*self._workers, return_exceptions=True)
        self._workers.clear()

        logger.info("TaskScheduler stopped")

    async def _worker(self, name: str) -> None:
        """
        工作协程

        Args:
            name: 工作协程名称
        """
        logger.info(f"{name} started")

        while self.is_running:
            try:
                # 从队列获取任务
                task = await self.engine.queue.dequeue()

                # 使用信号量控制并发
                async with self.semaphore:
                    logger.info(f"{name} processing task {task.id}")
                    await self._process_task(task)

            except Exception as e:
                logger.error(f"{name} error: {e}", exc_info=True)
                await asyncio.sleep(1)

        logger.info(f"{name} stopped")

    async def _process_task(self, task: TranslationTask) -> None:
        """
        处理翻译任务

        Args:
            task: 翻译任务
        """
        try:
            # 状态转换: QUEUED -> PROCESSING
            await self.engine._transition_task(task.id, TaskStatus.PROCESSING)

            # 执行翻译
            await self._translate(task)

            # 状态转换: PROCESSING -> COMPLETED
            await self.engine._transition_task(task.id, TaskStatus.COMPLETED)

            # 触发完成回调
            await self.engine._on_task_completed(task.id)

            logger.info(f"Task {task.id} completed successfully")

        except Exception as e:
            # 状态转换: PROCESSING -> FAILED
            await self.engine._transition_task(task.id, TaskStatus.FAILED)

            task.error_message = str(e)
            logger.error(f"Task {task.id} failed: {e}", exc_info=True)

            # 检查是否需要重试
            if task.retry_count < self.engine.max_retries:
                retry_delay = self.engine.retry_delay * (
                    self.engine.retry_backoff ** task.retry_count
                )
                logger.info(f"Retrying task {task.id} in {retry_delay}s")
                await asyncio.sleep(retry_delay)
                await self.engine.retry_task(task.id)

    async def _translate(self, task: TranslationTask) -> None:
        """
        执行翻译

        Args:
            task: 翻译任务

        Raises:
            Exception: 翻译失败
        """
        logger.info(f"开始翻译任务: {task.id}, 文件类型: {task.file_type}")

        # 进度回调（同时更新内存和数据库）
        async def progress_callback(progress: float, message: str):
            task.progress = progress
            logger.info(f"Task {task.id}: [{progress:.1f}%] {message}")

            # 更新数据库
            try:
                async for db in get_db():
                    repo = TaskRepository(db)
                    await repo.update_task(
                        task_id=UUID(task.id),
                        progress=progress
                    )
                    await db.commit()
                    break  # 只需要一个 session
            except Exception as e:
                logger.warning(f"更新数据库进度失败: {e}")

        try:
            # 创建 LLM 服务
            llm_service = LLM_obj(task.model)

            # 根据文件类型选择服务
            if task.file_type == "pptx":
                # 创建 PPT 翻译服务
                service = self.translation_factory.create_ppt_service(
                    llm_service=llm_service,
                    progress_callback=progress_callback,
                )

                # 构建输出路径
                output_path = f"{Settings.FILE_OUTPUT_PATH}{task.id}.pptx"

                # 执行翻译
                output_path = await service.translate(
                    file_path=task.file_path,
                    target_language=task.target_language,
                    output_path=output_path,
                )

                task.output_path = output_path

                # 更新数据库输出路径
                try:
                    async for db in get_db():
                        repo = TaskRepository(db)
                        await repo.update_task(
                            task_id=UUID(task.id),
                            output_path=output_path
                        )
                        await db.commit()
                        break
                except Exception as e:
                    logger.warning(f"更新数据库输出路径失败: {e}")

            elif task.file_type == "docx":
                # TODO: 实现 Word 翻译
                raise NotImplementedError("Word 翻译尚未实现")

            elif task.file_type == "xlsx":
                # TODO: 实现 Excel 翻译
                raise NotImplementedError("Excel 翻译尚未实现")

            elif task.file_type == "pdf":
                # TODO: 实现 PDF 翻译
                raise NotImplementedError("PDF 翻译尚未实现")

            else:
                raise ValueError(f"不支持的文件类型: {task.file_type}")

            logger.info(f"翻译完成: {task.output_path}")

        except Exception as e:
            logger.error(f"翻译任务失败: {task.id}, 错误: {e}", exc_info=True)
            raise

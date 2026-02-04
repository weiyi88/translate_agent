"""
任务调度器
"""
import asyncio
import logging

from app.core.engine import TranslationEngine
from app.core.queue import TaskQueue
from app.models.task import TranslationTask, TaskStatus


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
        engine: TranslationEngine = None,
    ):
        self.max_concurrent_tasks = max_concurrent_tasks
        self.engine = engine

        # 信号量控制并发
        self.semaphore = asyncio.Semaphore(max_concurrent_tasks)

        # 运行状态
        self.is_running = False
        self._workers: list[asyncio.Task] = []

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
        # TODO: 实现实际的翻译逻辑
        # 这里应该调用现有的翻译服务

        logger.info(f"Translating {task.file_path} to {task.target_language}")

        # 模拟翻译进度
        for i in range(0, 101, 10):
            task.progress = float(i)
            await asyncio.sleep(0.1)

        # 设置输出路径
        task.output_path = f"/output/{task.id}_{task.target_language}.{task.file_type}"

        logger.info(f"Translation completed: {task.output_path}")
